'use client';

import * as React from 'react';
import { Box, Button, Chip, IconButton, Typography } from '@mui/material';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { BRAND } from '@/src/styles/brand';

type StepId = 0 | 1 | 2;

type Props = {
  activeStep: StepId;
  steps: readonly { label: string; helper: string }[];
  onPrev: () => void;
  onNext: () => void;
  onSaveDraft?: () => void;
};

export function SurveyCreationTopBar({
  activeStep,
  steps,
  onPrev,
  onNext,
  onSaveDraft,
}: Props) {
  const isFirst = activeStep === 0;
  const isLast = activeStep === steps.length - 1;

  return (
    <Box sx={{ mb: 2 }}>
      {/* "Step x of y" */}
      <Typography sx={{ fontSize: 13, color: BRAND.muted, fontWeight: 600, mb: 1 }}>
        Step {activeStep + 1} of {steps.length}:
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <IconButton
            onClick={onPrev}
            disabled={isFirst}
            sx={{
              width: 40,
              height: 40,
              borderRadius: 999,
              border: `1px solid ${BRAND.border}`,
              bgcolor: BRAND.greenHover,
              '&:hover': { bgcolor: BRAND.greenHover },
              '&.Mui-disabled': { bgcolor: 'rgba(0,0,0,0.03)', borderColor: BRAND.border },
            }}
          >
            <ChevronLeftRoundedIcon />
          </IconButton>

          <Chip
            label={steps[activeStep].label}
            variant="outlined"
            sx={{
              height: 40,
              px: 1.25,
              borderRadius: 999,
              bgcolor: BRAND.bg,
              borderColor: BRAND.border,
              fontWeight: 700,
              color: BRAND.text,
            }}
          />

          <IconButton
            onClick={onNext}
            disabled={isLast}
            sx={{
              width: 40,
              height: 40,
              borderRadius: 999,
              border: `1px solid ${BRAND.border}`,
              bgcolor: BRAND.greenHover,
              '&:hover': { bgcolor: BRAND.greenHover },
              '&.Mui-disabled': { bgcolor: 'rgba(0,0,0,0.03)', borderColor: BRAND.border },
            }}
          >
            <ChevronRightRoundedIcon />
          </IconButton>
        </Box>

        <Button
          onClick={onSaveDraft}
          variant="contained"
          disableElevation
          sx={{
            textTransform: 'none',
            borderRadius: 999,
            px: 2.5,
            bgcolor: BRAND.green,
            '&:hover': { bgcolor: BRAND.green },
          }}
        >
          Save as Draft
        </Button>
      </Box>
    </Box>
  );
}
