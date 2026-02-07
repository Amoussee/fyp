'use client';

import { Card, CardContent, Box, Typography, Chip, Button } from '@mui/material';
import { BRAND } from '@/src/styles/brand';
import type { ParentSurvey } from '@/src/types/parentSurveyTypes';

interface ParentSurveyCardProps {
  survey: ParentSurvey;
  onStartSurvey: (surveyId: string) => void;
}

export function ParentSurveyCard({ survey, onStartSurvey }: ParentSurveyCardProps) {
  const isCompleted = survey.status === 'completed';

  return (
    <Card
      elevation={0}
      sx={{
        border: `1px solid ${BRAND.border}`,
        borderRadius: 2,
        backgroundColor: BRAND.bg,
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: BRAND.green,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontSize: '1.125rem',
                fontWeight: 700,
                color: BRAND.text,
                mb: 0.5,
              }}
            >
              {survey.name}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <Chip
                label={survey.schoolName}
                size="small"
                sx={{
                  backgroundColor: BRAND.surface,
                  color: BRAND.muted,
                  fontSize: '0.75rem',
                  height: '24px',
                }}
              />
              
              {survey.childName && (
                <Chip
                  label={`For: ${survey.childName}`}
                  size="small"
                  sx={{
                    backgroundColor: BRAND.greenSoft,
                    color: BRAND.green,
                    fontSize: '0.75rem',
                    height: '24px',
                  }}
                />
              )}
            </Box>
          </Box>

          <Chip
            label={isCompleted ? 'Completed' : 'To Do'}
            size="small"
            sx={{
              backgroundColor: isCompleted ? BRAND.greenSoft : 'rgba(251, 191, 36, 0.2)',
              color: isCompleted ? BRAND.green : '#d97706',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        </Box>

        {survey.description && (
          <Typography
            sx={{
              fontSize: '0.875rem',
              color: BRAND.muted,
              mb: 2,
              lineHeight: 1.5,
            }}
          >
            {survey.description}
          </Typography>
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pt: 2,
            borderTop: `1px solid ${BRAND.border}`,
          }}
        >
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box>
              <Typography sx={{ fontSize: '0.75rem', color: BRAND.muted, mb: 0.5 }}>
                Est. Time
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: BRAND.text, fontWeight: 600 }}>
                {survey.estimatedTime}
              </Typography>
            </Box>

            {isCompleted ? (
              <Box>
                <Typography sx={{ fontSize: '0.75rem', color: BRAND.muted, mb: 0.5 }}>
                  Completed
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: BRAND.text, fontWeight: 600 }}>
                  {survey.completedDate}
                </Typography>
              </Box>
            ) : survey.dueDate ? (
              <Box>
                <Typography sx={{ fontSize: '0.75rem', color: BRAND.muted, mb: 0.5 }}>
                  Due Date
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: BRAND.text, fontWeight: 600 }}>
                  {survey.dueDate}
                </Typography>
              </Box>
            ) : null}
          </Box>

          <Button
            variant={isCompleted ? 'outlined' : 'contained'}
            onClick={() => onStartSurvey(survey.id)}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              ...(isCompleted
                ? {
                    borderColor: BRAND.border,
                    color: BRAND.muted,
                    '&:hover': {
                      borderColor: BRAND.green,
                      backgroundColor: BRAND.greenHover,
                      color: BRAND.green,
                    },
                  }
                : {
                    backgroundColor: BRAND.green,
                    color: '#FFFFFF',
                    '&:hover': {
                      backgroundColor: BRAND.green,
                      opacity: 0.9,
                    },
                  }),
            }}
          >
            {isCompleted ? 'View Results' : 'Start Survey'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}