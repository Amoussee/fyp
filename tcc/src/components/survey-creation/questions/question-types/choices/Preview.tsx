'use client';

import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';

import type { QuestionTypeProps } from '../../types/QuestionTypeComponent';

function normalizeChoice(c: unknown) {
  if (typeof c === 'string') return { value: c, label: c };

  if (c && typeof c === 'object') {
    const obj = c as { value?: unknown; text?: unknown; label?: unknown };
    const label = String(obj.text ?? obj.label ?? obj.value ?? '');
    const value = String(obj.value ?? obj.text ?? obj.label ?? '');
    return { value, label };
  }

  // fallback (shouldn’t really happen, but keeps it safe)
  return { value: '', label: '' };
}

export function ChoicesPreview({ element, kind }: QuestionTypeProps) {
  const choicesRaw: unknown[] = Array.isArray(element?.choices) ? element.choices : [];
  const choices = choicesRaw.map(normalizeChoice).filter((c) => c.label);

  const isMulti = kind === 'multi_select';

  return (
    <Box sx={{ mt: 1 }}>
      {choices.length === 0 ? (
        <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>No options yet.</Typography>
      ) : isMulti ? (
        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <FormGroup>
            {choices.map((c, idx) => (
              <FormControlLabel
                key={`${c.value}_${idx}`}
                control={<Checkbox />}
                label={c.label}
                sx={{
                  '& .MuiCheckbox-root': { mr: 0.5 },
                  '& .MuiFormControlLabel-label': { fontSize: 16 },
                }}
              />
            ))}
          </FormGroup>
        </FormControl>
      ) : (
        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <RadioGroup>
            {choices.map((c, idx) => (
              <FormControlLabel
                key={`${c.value}_${idx}`}
                value={c.value}
                control={<Radio />}
                label={c.label}
                sx={{
                  '& .MuiRadio-root': { mr: 0.5 },
                  '& .MuiFormControlLabel-label': { fontSize: 16 },
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>
      )}
    </Box>
  );
}
