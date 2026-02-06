'use client';

import * as React from 'react';
import { Box, Button, Card, CardContent, LinearProgress, Typography } from '@mui/material';
import { BRAND } from '@/src/styles/brand';

type SectionNavItem = { id: string; title: string };

type Props = {
  step: number; // 0=details, 1..N=sections
  sectionCount: number;
  sections: SectionNavItem[];
  onSelectSection: (sectionIndex: number) => void; // 0..N-1
};

export function SurveyProgress({ step, sectionCount, sections, onSelectSection }: Props) {
  const atDetails = step === 0;
  const sectionIndex = step - 1;

  const totalSteps = 1 + sectionCount;
  const progress = Math.round((step / (totalSteps - 1)) * 100);

  return (
    <Card 
      elevation={0} 
      sx={{ 
        border: `1px solid ${BRAND.border}`, 
        borderRadius: 3,
        backgroundColor: BRAND.bg,
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: 800, color: BRAND.text }}>
            {atDetails ? 'Survey Details' : `Section ${sectionIndex + 1} of ${sectionCount}`}
          </Typography>

          <Typography sx={{ fontSize: 12, color: BRAND.muted, fontWeight: 700 }}>
            {progress}% completed
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ 
            mt: 1.5, 
            height: 8, 
            borderRadius: 999,
            backgroundColor: BRAND.surface,
            '& .MuiLinearProgress-bar': {
              backgroundColor: BRAND.green,
              borderRadius: 999,
            }
          }}
        />

        {!atDetails && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {sections.map((s, idx) => {
              const active = idx === sectionIndex;
              return (
                <Button
                  key={s.id}
                  size="small"
                  onClick={() => onSelectSection(idx)}
                  variant={active ? 'contained' : 'outlined'}
                  sx={{
                    borderRadius: 999,
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    ...(active
                      ? { 
                          bgcolor: BRAND.green, 
                          color: '#FFFFFF',
                          '&:hover': { 
                            bgcolor: BRAND.green,
                            opacity: 0.9,
                          } 
                        }
                      : { 
                          borderColor: BRAND.border, 
                          color: BRAND.text,
                          '&:hover': {
                            borderColor: BRAND.muted,
                            backgroundColor: BRAND.surface,
                          }
                        }),
                  }}
                >
                  {s.title}
                </Button>
              );
            })}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}