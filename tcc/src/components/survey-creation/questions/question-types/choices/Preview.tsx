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

function normalizeChoice(c: any) {
  if (typeof c === 'string') return { value: c, label: c };
  const label = String(c?.text ?? c?.label ?? c?.value ?? '');
  const value = String(c?.value ?? c?.text ?? c?.label ?? '');
  return { value, label };
}

export function ChoicesPreview({ element, kind }: QuestionTypeProps) {
  const choicesRaw: any[] = Array.isArray(element?.choices) ? element.choices : [];
  const choices = choicesRaw.map(normalizeChoice).filter((c) => c.label);

  const isMulti = kind === 'multi_select';
  // ranking not covered here — you can add a different preview later if you want
  const isSingle = kind === 'single_choice';

  return (
    <Box sx={{ mt: 1 }}>
      {/* optional: remove this title if you don’t want it */}
      {/* <Typography sx={{ fontWeight: 700, mb: 1 }}>Preview</Typography> */}

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
