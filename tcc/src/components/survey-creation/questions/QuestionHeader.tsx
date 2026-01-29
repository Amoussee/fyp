'use client';

import * as React from 'react';
import { Box, TextField, Typography } from '@mui/material';

type BaseProps = {
  index: number;
  title: string;
  description: string;
  isRequired?: boolean; // ✅ add this
};

type EditProps = BaseProps & {
  mode: 'edit';
  onTitleChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
};

type PreviewProps = BaseProps & {
  mode: 'preview';
};

export type QuestionHeaderProps = EditProps | PreviewProps;

export function QuestionHeader(props: QuestionHeaderProps) {
  const { index, title, description, isRequired } = props;
  const safeTitle = (title ?? '').trim();
  const safeDesc = (description ?? '').trim();

  if (props.mode === 'preview') {
    const shownTitle = safeTitle || `Question ${index + 1}`;

    return (
      <Box sx={{ mt: 2 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 18 }}>
          {shownTitle}
          {isRequired ? (
            <Typography
              component="span"
              sx={{ ml: 0.5, color: 'error.main', fontWeight: 900 }}
              aria-label="Required"
            >
              *
            </Typography>
          ) : null}
        </Typography>

        {safeDesc ? (
          <Typography sx={{ mt: 0.5, color: 'text.secondary', fontSize: 13 }}>
            {safeDesc}
          </Typography>
        ) : null}
      </Box>
    );
  }

  // edit mode
  return (
    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label={`Question ${index + 1}`}
        placeholder="Enter your question"
        value={title ?? ''}
        onChange={(e) => props.onTitleChange(e.target.value)}
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2.5,
            fontWeight: 600,
            fontSize: 18,
            bgcolor: 'white',
          },
        }}
      />

      <TextField
        label="Description"
        value={description ?? ''}
        onChange={(e) => props.onDescriptionChange(e.target.value)}
        fullWidth
        multiline
        minRows={1}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2.5,
            bgcolor: 'white',
          },
        }}
      />
    </Box>
  );
}
