'use client';

import * as React from 'react';
import { Box, TextField, Typography } from '@mui/material';
import type { QuestionTypeProps } from '../../types/QuestionTypeComponent';
import type {
  SurveyElement,
  SurveyElementPatch,
  SurveyValidator,
  NumericValidator,
} from '@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/surveyJson';

const SHORT_TEXT_MAX = 1000;
const LONG_TEXT_MAX = 3000;
const LONG_TEXT_ROWS = 3;

function enforceIfDifferent(
  element: SurveyElement,
  desired: Partial<SurveyElement>,
): Partial<SurveyElement> {
  const patch: Partial<SurveyElement> = {};
  for (const [k, v] of Object.entries(desired)) {
    if (element?.[k] !== v) patch[k] = v;
  }
  return patch;
}

function getNumericValidator(element: SurveyElement): NumericValidator | null {
  const validators = Array.isArray(element.validators) ? element.validators : [];
  const v = validators.find((x): x is NumericValidator => x?.type === 'numeric');
  return v ?? null;
}

function upsertNumericValidator(
  element: SurveyElement,
  patch: { minValue?: number; maxValue?: number },
): SurveyElementPatch {
  const validators: SurveyValidator[] = Array.isArray(element.validators)
    ? [...element.validators]
    : [];

  const idx = validators.findIndex((x) => x?.type === 'numeric');

  const current: NumericValidator = (
    idx >= 0 ? validators[idx] : { type: 'numeric' }
  ) as NumericValidator;
  const next: NumericValidator = { ...current, ...patch };

  const hasMin = typeof next.minValue === 'number';
  const hasMax = typeof next.maxValue === 'number';

  if (!hasMin && !hasMax) {
    if (idx >= 0) validators.splice(idx, 1);
    return { validators };
  }

  if (idx >= 0) validators[idx] = next;
  else validators.push(next);

  return { validators };
}

const toNumOrUndef = (v: string) => (v === '' ? undefined : Number(v));

export function TextEdit({ kind, element, onPatch }: QuestionTypeProps) {
  // If your QuestionTypeProps.element is still `any`, cast once here.
  const el = element as SurveyElement;
  const patchEl = onPatch as (patch: Partial<SurveyElement>) => void;

  React.useEffect(() => {
    if (kind === 'short_text') {
      const patch = enforceIfDifferent(el, {
        type: 'text',
        inputType: 'text',
        maxLength: SHORT_TEXT_MAX,
      });
      if (Object.keys(patch).length) patchEl(patch);
    }

    if (kind === 'long_text') {
      const patch = enforceIfDifferent(el, {
        type: 'comment',
        rows: LONG_TEXT_ROWS,
        maxLength: LONG_TEXT_MAX,
        autoGrow: true,
      });
      if (Object.keys(patch).length) patchEl(patch);
    }

    if (kind === 'number' || kind === 'number_range') {
      const patch = enforceIfDifferent(el, {
        type: 'text',
        inputType: 'number',
      });
      if (Object.keys(patch).length) patchEl(patch);
    }

    if (kind === 'single_date') {
      const patch = enforceIfDifferent(el, {
        type: 'text',
        inputType: 'date',
      });
      if (Object.keys(patch).length) patchEl(patch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  if (kind === 'long_text') {
    return (
      <Box>
        <Typography sx={{ color: 'GrayText', fontSize: 14, fontWeight: 400, mb: 1, mx: 1 }}>
          Long text settings
        </Typography>
        <TextField
          placeholder="Your answer"
          fullWidth
          minRows={(el?.rows as number | undefined) ?? LONG_TEXT_ROWS}
          disabled
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2.5,
              bgcolor: 'rgba(0,0,0,0.02)',
            },
          }}
        />
      </Box>
    );
  }

  if (kind === 'number_range') {
    const numeric = getNumericValidator(el);
    const minValue = numeric?.minValue ?? '';
    const maxValue = numeric?.maxValue ?? '';

    return (
      <Box>
        <Typography sx={{ color: 'GrayText', fontSize: 14, fontWeight: 400, mb: 1, mx: 1 }}>
          Number range
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          <TextField
            label="Min"
            type="number"
            value={minValue}
            onChange={(e) => {
              const min = toNumOrUndef(e.target.value);
              patchEl(upsertNumericValidator(el, { minValue: min }));
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
          />
          <TextField
            label="Max"
            type="number"
            value={maxValue}
            onChange={(e) => {
              const max = toNumOrUndef(e.target.value);
              patchEl(upsertNumericValidator(el, { maxValue: max }));
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
          />
        </Box>

        <Typography sx={{ mt: 1, color: 'text.secondary', fontSize: 13 }}>
          Stored as a SurveyJS numeric validator (<code>validators</code>).
        </Typography>
      </Box>
    );
  }

  if (kind === 'number') {
    return (
      <Box>
        <Typography sx={{ color: 'GrayText', fontSize: 14, fontWeight: 400, mb: 1, mx: 1 }}>
          Number settings
        </Typography>
        <TextField
          type="number"
          placeholder="Enter a number"
          fullWidth
          disabled
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2.5,
              bgcolor: 'rgba(0,0,0,0.02)',
            },
          }}
        />
      </Box>
    );
  }

  if (kind === 'single_date') {
    return (
      <Box>
        <Typography sx={{ color: 'GrayText', fontSize: 14, fontWeight: 400, mb: 1, mx: 1 }}>
          Date settings
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography sx={{ color: 'GrayText', fontSize: 14, fontWeight: 400, mb: 1, mx: 1 }}>
        Short text settings
      </Typography>
      <TextField
        placeholder="Your answer"
        fullWidth
        disabled
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2.5,
            bgcolor: 'rgba(0,0,0,0.02)',
          },
        }}
      />
    </Box>
  );
}
