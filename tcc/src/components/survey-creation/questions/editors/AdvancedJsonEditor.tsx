'use client';

import * as React from 'react';
import { Box, Button, Collapse, TextField, Typography } from '@mui/material';
import type { SurveyElement } from '@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/surveyJson';

type Props = {
  element: SurveyElement;
  onPatch: (patch: Partial<SurveyElement>) => void;
};

export function AdvancedJsonEditor({ element, onPatch }: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(() => JSON.stringify(element, null, 2));
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // keep textarea in sync when element changes (like switching question)
    setValue(JSON.stringify(element, null, 2));
    setError(null);
  }, [element]);

  const apply = () => {
    try {
      const parsed = JSON.parse(value) as Record<string, unknown>;
      const { ...rest } = parsed;
      delete (rest as Record<string, unknown>)['name'];
      onPatch(rest as Partial<SurveyElement>);
      setError(null);
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message);
      else setError('Invalid JSON');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Typography sx={{ fontWeight: 700 }}>Advanced settings</Typography>
        <Button onClick={() => setOpen((v) => !v)} sx={{ textTransform: 'none' }}>
          {open ? 'Hide' : 'Show'}
        </Button>
      </Box>

      <Collapse in={open}>
        <Box sx={{ mt: 1 }}>
          <TextField
            value={value}
            onChange={(e) => setValue(e.target.value)}
            fullWidth
            multiline
            minRows={10}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5, fontFamily: 'monospace' } }}
            helperText={error ?? 'Edit SurveyJS element JSON. (name is not applied for safety)'}
            error={!!error}
          />

          <Button onClick={apply} sx={{ mt: 1, textTransform: 'none' }} variant="outlined">
            Apply JSON
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
}
