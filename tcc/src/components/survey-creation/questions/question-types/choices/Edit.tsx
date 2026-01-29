'use client';

import * as React from 'react';
import { Box, Button, IconButton, TextField, Typography, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type { QuestionTypeProps } from '../../types/QuestionTypeComponent';

export function ChoicesEdit({ element, onPatch }: QuestionTypeProps) {
  const choices: any[] = Array.isArray(element?.choices) ? element.choices : [];

  const setChoiceAt = (idx: number, value: string) => {
    const next = choices.slice();
    next[idx] = value;
    onPatch({ choices: next });
  };

  const addChoice = () => {
    const next = [...choices, `Option ${choices.length + 1}`];
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
        {choices.map((c, idx) => (
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
              value={typeof c === 'string' ? c : String(c?.text ?? c?.value ?? '')}
              onChange={(e) => setChoiceAt(idx, e.target.value)}
              fullWidth
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
            />

            <Tooltip title="Delete option" arrow>
              <IconButton
                onClick={() => removeChoiceAt(idx)}
                aria-label={`Delete option ${idx + 1}`}
                sx={{
                  borderRadius: 2,
                }}
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
