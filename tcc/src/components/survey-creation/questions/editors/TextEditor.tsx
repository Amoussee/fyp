'use client';

import * as React from 'react';
import { Box, TextField, Typography } from '@mui/material';

import type { SurveyElement } from '@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/surveyJson';

const SHORT_TEXT_MAX = 1000;
const LONG_TEXT_MAX = 3000;
const LONG_TEXT_ROWS = 3;

type JsonRecord = Record<string, unknown>;

function enforceIfDifferent(element: SurveyElement, desired: JsonRecord) {
  const current = element as JsonRecord;
  const patch: JsonRecord = {};

  for (const [k, v] of Object.entries(desired)) {
    if (current[k] !== v) patch[k] = v;
  }

  return patch as Partial<SurveyElement>;
}

type NumericValidator = {
  type: 'numeric';
  minValue?: number;
  maxValue?: number;
} & JsonRecord;

type Props = {
  element: SurveyElement; // SurveyJS element JSON
  onPatch: (patch: Partial<SurveyElement>) => void;
};

function getNumericValidator(element: SurveyElement): NumericValidator | null {
  const rec = element as JsonRecord;
  const validators = Array.isArray(rec.validators) ? rec.validators : [];

  const found = validators.find((x) => {
    if (!x || typeof x !== 'object') return false;
    const xr = x as JsonRecord;
    return xr.type === 'numeric';
  });

  return found && typeof found === 'object' ? (found as NumericValidator) : null;
}

function upsertNumericValidator(
  element: SurveyElement,
  patch: { minValue?: number; maxValue?: number },
): Partial<SurveyElement> {
  const rec = element as JsonRecord;
  const validatorsRaw = Array.isArray(rec.validators) ? rec.validators : [];
  const validators: JsonRecord[] = validatorsRaw
    .filter((v): v is JsonRecord => !!v && typeof v === 'object')
    .map((v) => ({ ...v })); // clone objects

  const idx = validators.findIndex((x) => x.type === 'numeric');

  const current: JsonRecord = idx >= 0 ? validators[idx] : ({ type: 'numeric' } as JsonRecord);
  const next: JsonRecord = { ...current, ...patch, type: 'numeric' };

  const hasMin = typeof next.minValue === 'number' && !Number.isNaN(next.minValue);
  const hasMax = typeof next.maxValue === 'number' && !Number.isNaN(next.maxValue);

  // Remove validator if empty (optional behaviour)
  if (!hasMin && !hasMax) {
    if (idx >= 0) validators.splice(idx, 1);
    return { validators } as Partial<SurveyElement>;
  }

  if (idx >= 0) validators[idx] = next;
  else validators.push(next);

  return { validators } as Partial<SurveyElement>;
}

const toNumOrUndef = (v: string) => (v === '' ? undefined : Number(v));

export function TextEditor({ element, onPatch }: Props) {
  const rec = element as JsonRecord;
  const kind = typeof rec.kind === 'string' ? rec.kind : 'short_text';

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
        autoGrow: true,
      });
      if (Object.keys(patch).length) onPatch(patch);
    }

    if (kind === 'number_range') {
      if (rec.type !== 'text' || rec.inputType !== 'number') {
        onPatch({ type: 'text', inputType: 'number' });
      }
    }

    if (kind === 'number') {
      if (rec.type !== 'text' || rec.inputType !== 'number') {
        onPatch({ type: 'text', inputType: 'number' });
      }
    }

    if (kind === 'single_date') {
      if (rec.type !== 'text' || rec.inputType !== 'date') {
        onPatch({ type: 'text', inputType: 'date' });
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
          Uses SurveyJS <code>text</code> with <code>{'inputType: "number"'}</code>.
        </Typography>
      </Box>
    );
  }

  if (kind === 'single_date') {
    return (
      <Box>
        <Typography sx={{ fontWeight: 700, mb: 1 }}>Date settings</Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>
          Uses SurveyJS <code>text</code> with <code>{'inputType: "date"'}</code>.
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
