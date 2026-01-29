'use client';

import * as React from 'react';
import { Box, TextField, Typography } from '@mui/material';

const SHORT_TEXT_MAX = 1000;
const LONG_TEXT_MAX = 3000;
const LONG_TEXT_ROWS = 3;

function enforceIfDifferent(element: any, desired: Record<string, any>) {
  const patch: Record<string, any> = {};
  for (const [k, v] of Object.entries(desired)) {
    if (element?.[k] !== v) patch[k] = v;
  }
  return patch;
}

type Props = {
  element: any; // SurveyJS element JSON
  onPatch: (patch: Partial<any>) => void;
};

function getNumericValidator(element: any) {
  const validators: any[] = Array.isArray(element?.validators) ? element.validators : [];
  const v = validators.find((x) => x?.type === 'numeric');
  return v ?? null;
}

function upsertNumericValidator(element: any, patch: { minValue?: number; maxValue?: number }) {
  const validators: any[] = Array.isArray(element?.validators) ? [...element.validators] : [];
  const idx = validators.findIndex((x) => x?.type === 'numeric');

  const current = idx >= 0 ? validators[idx] : { type: 'numeric' };
  const next = { ...current, ...patch };

  // Remove empty validator (optional)
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

export function TextEditor({ element, onPatch }: Props) {
  const kind = String(element?.kind ?? 'short_text');

  // enforce “base” settings for each kind (without being too aggressive)
  React.useEffect(() => {
    if (kind === 'short_text') {
      const patch = enforceIfDifferent(element, {
        type: 'text',
        inputType: 'text',
        maxLength: SHORT_TEXT_MAX,
      });
      if (Object.keys(patch).length) onPatch(patch);
    }

    if (kind === 'long_text') {
      const patch = enforceIfDifferent(element, {
        type: 'comment',
        rows: LONG_TEXT_ROWS,
        maxLength: LONG_TEXT_MAX,
        autoGrow: true, // remove this line if your SurveyJS build doesn't support it
      });
      if (Object.keys(patch).length) onPatch(patch);
    }

    if (kind === 'number_range') {
      if (element.type !== 'text' || element.inputType !== 'number') {
        onPatch({ type: 'text', inputType: 'number' });
      }
    }

    if (kind === 'single_date') {
      if (element.type !== 'text' || element.inputType !== 'date') {
        onPatch({ type: 'text', inputType: 'date' });
      }
    }

    if (kind === 'long_text') {
      if (element.type !== 'comment') {
        onPatch({ type: 'comment', rows: element.rows ?? 4 });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  // --- UI per kind ---
  if (kind === 'long_text') {
    return (
      <Box>
        <Typography sx={{ fontWeight: 700, mb: 1 }}>Long text</Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>
          3-line comment box (auto-expands), max {LONG_TEXT_MAX} characters.
        </Typography>
      </Box>
    );
  }

  if (kind === 'number_range') {
    const numeric = getNumericValidator(element);
    const minValue = numeric?.minValue ?? '';
    const maxValue = numeric?.maxValue ?? '';

    return (
      <Box>
        <Typography sx={{ fontWeight: 700, mb: 1 }}>Number range</Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          <TextField
            label="Min"
            type="number"
            value={minValue}
            onChange={(e) => {
              const min = toNumOrUndef(e.target.value);
              onPatch(upsertNumericValidator(element, { minValue: min }));
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
          />
          <TextField
            label="Max"
            type="number"
            value={maxValue}
            onChange={(e) => {
              const max = toNumOrUndef(e.target.value);
              onPatch(upsertNumericValidator(element, { maxValue: max }));
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
          />
        </Box>

        <Typography sx={{ mt: 1, color: 'text.secondary', fontSize: 13 }}>
          Stored as SurveyJS numeric validator (minValue / maxValue).
        </Typography>
      </Box>
    );
  }

  if (kind === 'number') {
    return (
      <Box>
        <Typography sx={{ fontWeight: 700, mb: 1 }}>Number settings</Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>
          Uses SurveyJS <code>text</code> with <code>inputType: "number"</code>.
        </Typography>
      </Box>
    );
  }

  if (kind === 'single_date') {
    return (
      <Box>
        <Typography sx={{ fontWeight: 700, mb: 1 }}>Date settings</Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>
          Uses SurveyJS <code>text</code> with <code>inputType: "date"</code>.
        </Typography>
      </Box>
    );
  }

  // short_text default
  return (
    <Box>
      <Typography sx={{ fontWeight: 700, mb: 1 }}>Short text</Typography>
      <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>
        Single-line input, max {SHORT_TEXT_MAX} characters.
      </Typography>
    </Box>
  );
}
