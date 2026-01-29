'use client';

import * as React from 'react';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Switch,
  FormControlLabel,
  Autocomplete,
} from '@mui/material';
import { BRAND } from '@/src/styles/brand';
import { getSchools } from '@/src/lib/api/schools';
import type { School } from '@/src/lib/api/types';
import { toTitleCase } from '@/src/lib/utils/text';
import type {
  SurveyCreationForm,
  SurveyCreationErrors,
  RecipientOption,
} from '@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/types';

type Props = {
  form: SurveyCreationForm;
  setForm: React.Dispatch<React.SetStateAction<SurveyCreationForm>>;
  errors: SurveyCreationErrors;
  clearError: (key: keyof SurveyCreationForm) => void;
};

export function SurveyDetailsStep({ form, setForm, errors, clearError }: Props) {
  const [recipientOptions, setRecipientOptions] = React.useState<RecipientOption[]>([]);
  const [loadingRecipients, setLoadingRecipients] = React.useState(false);
  const [recipientsError, setRecipientsError] = React.useState<string | null>(null);

  // fetch schools once
  React.useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoadingRecipients(true);
        setRecipientsError(null);

        const schools: School[] = await getSchools();

        const opts: RecipientOption[] = schools
          .map((s) => ({
            id: String(s.school_id),
            label: toTitleCase(s.school_name),
          }))
          .sort((a, b) => a.label.localeCompare(b.label));

        if (alive) setRecipientOptions(opts);
      } catch (e) {
        if (alive) setRecipientsError('Failed to load schools.');
      } finally {
        if (alive) setLoadingRecipients(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // If switching from Directed -> Open, clear recipients (optional)
  React.useEffect(() => {
    if (!form.isDirected && form.recipients.length > 0) {
      setForm((prev) => ({ ...prev, recipients: [] }));
    }
  }, [form.isDirected, form.recipients.length, setForm]);

  return (
    <Card elevation={0} sx={{ border: `1px solid ${BRAND.border}`, borderRadius: 3 }}>
      <CardContent sx={{ p: 3, m: 3 }}>
        {/* <Typography variant="h6" sx={{ fontWeight: 700, color: BRAND.text }}>
          Survey Details
        </Typography> */}
        <TextField
          label="Survey Title"
          placeholder="Enter a Title"
          value={form.title}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, title: e.target.value }));
            clearError('title');
          }}
          error={Boolean(errors.title)}
          helperText={errors.title ?? ' '}
          fullWidth
          InputLabelProps={{
            sx: {
              transform: 'translate(14px, 10px) scale(2)',
              '&.MuiInputLabel-shrink': {
                transform: 'translate(14px, -9px) scale(0.75)',
              },
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2.5,
            },
          }}
          slotProps={{
            input: {
              sx: {
                '& .MuiInputBase-input': {
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  py: 1.4,
                },
              },
            },
          }}
        />

        <Box>
          <FormControlLabel
            label={form.isDirected ? 'Directed Survey' : 'Open Survey'}
            control={
              <Switch
                checked={form.isDirected}
                onChange={(e) => setForm((prev) => ({ ...prev, isDirected: e.target.checked }))}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: BRAND.green },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: BRAND.green,
                  },
                }}
              />
            }
            sx={{
              m: 0,
              '& .MuiFormControlLabel-label': { color: BRAND.muted, fontWeight: 600, fontSize: 13 },
            }}
          />
        </Box>

        <Box
          sx={{
            mt: 2,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
            gap: 2,
          }}
        >
          <Autocomplete
            multiple
            options={recipientOptions}
            value={form.recipients}
            onChange={(_, value) => {
              setForm((prev) => ({ ...prev, recipients: value }));
              clearError('recipients');
            }}
            getOptionLabel={(opt) => opt.label} // ✅ label shown = school_name
            isOptionEqualToValue={(opt, val) => opt.id === val.id} // ✅ avoids MUI warning
            disabled={!form.isDirected}
            loading={loadingRecipients}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Recipients"
                placeholder={form.isDirected ? 'Select schools...' : undefined}
                error={Boolean(errors.recipients) || Boolean(recipientsError)}
                helperText={
                  errors.recipients ??
                  recipientsError ??
                  (form.isDirected
                    ? 'Choose schools to receive this survey.'
                    : 'This field is only intended for Directed Surveys.')
                }
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingRecipients ? <CircularProgress size={18} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2.5,
                ...(form.isDirected ? {} : { bgcolor: 'rgba(0,0,0,0.02)' }),
              },
            }}
          />

          <TextField
            label="Minimum Number of Responses"
            type="number"
            value={form.minResponses}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === '') {
                setForm((prev) => ({ ...prev, minResponses: '' }));
                clearError('minResponses');
                return;
              }
              const n = Number(raw);
              const clamped = Math.max(0, Math.min(99999, n));
              setForm((prev) => ({ ...prev, minResponses: clamped }));
              clearError('minResponses');
            }}
            error={Boolean(errors.minResponses)}
            helperText={errors.minResponses ?? ' '}
            inputProps={{ min: 0, step: 1 }}
            fullWidth
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <TextField
            label="Description"
            value={form.description}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, description: e.target.value }));
              clearError('description');
            }}
            error={Boolean(errors.description)}
            helperText={errors.description ?? ' '}
            fullWidth
            multiline
            minRows={4}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
