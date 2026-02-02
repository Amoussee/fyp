'use client';

import * as React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { BRAND } from '@/src/styles/brand';

type Props = {
  title: string;
  description: string | undefined;
};

export function SurveyDetails({ title, description }: Props) {
  return (
    <Card elevation={0} sx={{ border: `1px solid ${BRAND.border}`, borderRadius: 3 }}>
      <CardContent sx={{ p: 3, m: 3 }}>
        <Typography
          sx={{
            fontSize: '1.75rem',
            fontWeight: 800,
            lineHeight: 1.2,
            color: BRAND.text,
          }}
        >
          {title}
        </Typography>

        {description ? (
          <Typography
            sx={{
              mt: 1.25,
              color: BRAND.muted,
              whiteSpace: 'pre-wrap', // keeps line breaks if admin typed them
              lineHeight: 1.6,
            }}
          >
            {description}
          </Typography>
        ) : (
          <Typography sx={{ mt: 1.25, color: BRAND.muted }}>
            {/* optional placeholder spacing to keep layout stable */}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
