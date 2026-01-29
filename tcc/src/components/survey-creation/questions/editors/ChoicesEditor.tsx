'use client';

import * as React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { QuestionKind } from '@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/questionPalette';

type Props = {
  element: any;
  onPatch: (patch: Partial<any>) => void;
  onChangeKind?: (next: QuestionKind) => void;
};

export function ChoicesEditor({ element, onPatch }: Props) {
  const choices: any[] = Array.isArray(element?.choices) ? element.choices : [];

  const setChoiceAt = (idx: number, value: string) => {
    const next = choices.slice();
    next[idx] = value; // store as strings first (simple + SurveyJS supports it)
    onPatch({ choices: next });
  };

  const addChoice = () => {
    const next = [...choices, `Option ${choices.length + 1}`];
    onPatch({ choices: next });
  };

  return (
    <Box>
      <Typography sx={{ fontWeight: 700, mb: 1 }}>Choices</Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {choices.map((c, idx) => (
          <TextField
            key={`${element.name}_choice_${idx}`}
            value={typeof c === 'string' ? c : String(c?.text ?? c?.value ?? '')}
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
