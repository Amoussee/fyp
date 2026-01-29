'use client';

import * as React from 'react';
import { Box, TextField, Typography } from '@mui/material';

type Props = {
  element: any;
  onPatch: (patch: Partial<any>) => void;
};

export function RatingEditor({ element, onPatch }: Props) {
  // SurveyJS rating supports rateMin/rateMax/rateStep.
  // NPS usually has rateMin=0 rateMax=10.
  const rateMin = element.rateMin ?? '';
  const rateMax = element.rateMax ?? '';
  const rateStep = element.rateStep ?? '';

  const toNumOrUndef = (v: string) => (v === '' ? undefined : Number(v));

  return (
    <Box>
      <Typography sx={{ fontWeight: 700, mb: 1 }}>Scale settings</Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
        <TextField
          label="Min"
          type="number"
          value={rateMin}
          onChange={(e) => onPatch({ rateMin: toNumOrUndef(e.target.value) })}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
        />
        <TextField
          label="Max"
          type="number"
          value={rateMax}
          onChange={(e) => onPatch({ rateMax: toNumOrUndef(e.target.value) })}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
        />
        <TextField
          label="Step"
          type="number"
          value={rateStep}
          onChange={(e) => onPatch({ rateStep: toNumOrUndef(e.target.value) })}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
        />
      </Box>

      <Box
        sx={{ mt: 1.5, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}
      >
        <TextField
          label="Min label"
          value={element.minRateDescription ?? ''}
          onChange={(e) => onPatch({ minRateDescription: e.target.value })}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
        />
        <TextField
          label="Max label"
          value={element.maxRateDescription ?? ''}
          onChange={(e) => onPatch({ maxRateDescription: e.target.value })}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
        />
      </Box>
    </Box>
  );
}
