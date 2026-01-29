'use client';

import * as React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import type { QuestionKind } from '@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/questionPalette';
import type { SurveyElement } from '@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/surveyJson';

type Props = {
  element: SurveyElement;
  onPatch: (patch: Partial<SurveyElement>) => void;
  onChangeKind?: (next: QuestionKind) => void;
};

type ChoiceObject = { value?: unknown; text?: unknown };
type Choice = string | ChoiceObject;

function choiceToString(c: Choice): string {
  if (typeof c === 'string') return c;
  const t = c.text ?? c.value ?? '';
  return String(t);
}

export function ChoicesEditor({ element, onPatch }: Props) {
  const choices: Choice[] = Array.isArray((element as Record<string, unknown>).choices)
    ? ((element as Record<string, unknown>).choices as Choice[])
    : [];

  const setChoiceAt = (idx: number, value: string) => {
    const next = choices.slice();
    next[idx] = value; // store as strings (simple; SurveyJS supports this)
    onPatch({ choices: next } as Partial<SurveyElement>);
  };

  const addChoice = () => {
    const next = [...choices, `Option ${choices.length + 1}`];
    onPatch({ choices: next } as Partial<SurveyElement>);
  };

  return (
    <Box>
      <Typography sx={{ fontWeight: 700, mb: 1 }}>Choices</Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {choices.map((c, idx) => (
          <TextField
            key={`${element.name}_choice_${idx}`}
            value={choiceToString(c)}
            onChange={(e) => setChoiceAt(idx, e.target.value)}
            fullWidth
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
          />
        ))}
      </Box>

      <Button startIcon={<AddIcon />} onClick={addChoice} sx={{ mt: 1, textTransform: 'none' }}>
        Add choice
      </Button>
    </Box>
  );
}
