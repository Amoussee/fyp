'use client';

import * as React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { BRAND } from '@/src/styles/brand';

type Props = {
  title: string;
  description: string | undefined;
  createdDate?: string;
  responseCount?: number;
  totalResponses?: number;
};

export function SurveyDetails({
  title,
  description,
  createdDate,
  responseCount,
  totalResponses,
}: Props) {
  return (
    <Card
      elevation={0}
      sx={{
        border: `1px solid ${BRAND.border}`,
        borderRadius: 3,
        backgroundColor: BRAND.bg,
      }}
    >
      <CardContent sx={{ p: 3 }}>
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

        {description && (
          <Typography
            sx={{
              mt: 1.25,
              color: BRAND.muted,
              whiteSpace: 'pre-wrap',
              lineHeight: 1.6,
            }}
          >
            {description}
          </Typography>
        )}

        {/* Optional metadata section */}
        {(createdDate || (responseCount !== undefined && totalResponses !== undefined)) && (
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: `1px solid ${BRAND.border}`,
              display: 'flex',
              gap: 3,
              flexWrap: 'wrap',
            }}
          >
            {createdDate && (
              <Box>
                <Typography sx={{ fontSize: '0.75rem', color: BRAND.muted, mb: 0.5 }}>
                  Created
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: BRAND.text, fontWeight: 600 }}>
                  {createdDate}
                </Typography>
              </Box>
            )}
            {responseCount !== undefined && totalResponses !== undefined && (
              <Box>
                <Typography sx={{ fontSize: '0.75rem', color: BRAND.muted, mb: 0.5 }}>
                  Responses
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: BRAND.text, fontWeight: 600 }}>
                  {responseCount} / {totalResponses}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
