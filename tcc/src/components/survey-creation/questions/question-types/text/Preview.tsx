'use client';

import * as React from 'react';
import { Box, TextField } from '@mui/material';
import type { QuestionTypeProps } from '../../types/QuestionTypeComponent';

const LONG_TEXT_ROWS = 3;

export function TextPreview({ kind, element }: QuestionTypeProps) {
  if (kind === 'long_text') {
    return (
      <Box sx={{ mt: 1 }}>
        <TextField
          placeholder="Your answer"
          fullWidth
          multiline
          minRows={element?.rows ?? LONG_TEXT_ROWS}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: 'rgba(0,0,0,0.02)' } }}
        />
      </Box>
    );
  }

  if (kind === 'single_date') {
    return (
      <Box sx={{ mt: 1 }}>
        <TextField
          type="date"
          fullWidth
          disabled
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: 'rgba(0,0,0,0.02)' } }}
        />
      </Box>
    );
  }

  if (kind === 'number' || kind === 'number_range') {
    return (
      <Box sx={{ mt: 1 }}>
        <TextField
          type="number"
          placeholder="0"
          fullWidth
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: 'rgba(0,0,0,0.02)' } }}
        />
      </Box>
    );
  }

  // short_text default
  return (
    <Box sx={{ mt: 1 }}>
      <TextField
        placeholder="Your answer"
        fullWidth
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: 'rgba(0,0,0,0.02)' } }}
      />
    </Box>
  );
}
