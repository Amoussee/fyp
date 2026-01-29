'use client';

import * as React from 'react';
import { Box, Button, IconButton, TextField, Typography, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type { QuestionTypeProps } from '../../types/QuestionTypeComponent';
import type { ChoiceItem } from '@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/surveyJson';

type ChoiceLike = string | { value?: unknown; text?: unknown };

function toChoiceItem(c: ChoiceLike): ChoiceItem {
  if (typeof c === 'string') return { value: c, text: c };

  const valueRaw = c?.value;
  const textRaw = c?.text;

  const value = typeof valueRaw === 'string' ? valueRaw : valueRaw == null ? '' : String(valueRaw);

  const text =
    typeof textRaw === 'string' ? textRaw : textRaw == null ? undefined : String(textRaw);

  // Ensure required `value: string`
  return { value, ...(text ? { text } : {}) };
}

function toChoiceLabel(c: ChoiceLike): string {
  if (typeof c === 'string') return c;
  if (typeof c?.text === 'string') return c.text;
  if (typeof c?.value === 'string') return c.value;
  return String(c?.text ?? c?.value ?? '');
}

export function ChoicesEdit({ element, onPatch }: QuestionTypeProps) {
  const raw: unknown[] = Array.isArray(element?.choices) ? element.choices : [];

  const choicesLike: ChoiceLike[] = raw.filter(
    (c): c is ChoiceLike => typeof c === 'string' || (c !== null && typeof c === 'object'),
  );

  // ✅ Canonical form that matches SurveyElement.choices typing
  const choices: ChoiceItem[] = choicesLike.map(toChoiceItem);

  const setChoiceAt = (idx: number, value: string) => {
    const next = choices.slice();
    next[idx] = { value, text: value };
    onPatch({ choices: next });
  };

  const addChoice = () => {
    const label = `Option ${choices.length + 1}`;
    const next = [...choices, { value: label, text: label }];
    onPatch({ choices: next });
  };

  const removeChoiceAt = (idx: number) => {
    const next = choices.filter((_, i) => i !== idx);
    onPatch({ choices: next });
  };

  return (
    <Box>
      <Typography sx={{ color: 'GrayText', fontSize: 14, fontWeight: 400, mb: 1, mx: 1 }}>
        Choices
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {choicesLike.map((c, idx) => (
          <Box
            key={`${element.name}_choice_${idx}`}
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: 1,
              alignItems: 'center',
            }}
          >
            <TextField
              value={toChoiceLabel(c)}
              onChange={(e) => setChoiceAt(idx, e.target.value)}
              fullWidth
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
            />

            <Tooltip title="Delete option" arrow>
              <IconButton
                onClick={() => removeChoiceAt(idx)}
                aria-label={`Delete option ${idx + 1}`}
                sx={{ borderRadius: 2 }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ))}
      </Box>

      <Button startIcon={<AddIcon />} onClick={addChoice} sx={{ mt: 1, textTransform: 'none' }}>
        Add choice
      </Button>
    </Box>
  );
}
