'use client';

import * as React from 'react';
import { Box, TextField } from '@mui/material';
import type { QuestionTypeProps } from '../../types/QuestionTypeComponent';

const LONG_TEXT_ROWS = 3;

function toMinRows(rows: unknown, fallback = LONG_TEXT_ROWS): number {
  // accept only finite positive numbers
  if (typeof rows === 'number' && Number.isFinite(rows) && rows > 0) return rows;
  // accept numeric strings too (optional)
  if (typeof rows === 'string') {
    const n = Number(rows);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return fallback;
}

export function TextPreview({ kind, element }: QuestionTypeProps) {
  if (kind === 'long_text') {
    const minRows = toMinRows(element?.rows);

    return (
      <Box sx={{ mt: 1 }}>
        <TextField
          placeholder="Your answer"
          fullWidth
          multiline
          minRows={minRows}
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

  return (
    <Box sx={{ mt: 1 }}>
      <TextField
        placeholder="Your answer"
        // fullWidth
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: 'rgba(0,0,0,0.02)' } }}
      />
    </Box>
  );
}
