'use client';

import * as React from 'react';
import { Box, Card, CardContent, Divider, Typography } from '@mui/material';
import { BRAND } from '@/src/styles/brand';

type QuestionKind =
  | 'short_text'
  | 'long_text'
  | 'single_choice'
  | 'multi_select'
  | 'single_date';

type Option = { id: string; label: string };

export type Question = {
  id: string;
  kind: QuestionKind;
  prompt: string;
  description?: string;
  required?: boolean;
  config?: {
    options?: Option[];
    placeholder?: string;
    rows?: number;
  };
};

export type Section = {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
};

type Props = {
  section: Section;
  answers: Record<string, any>;
  onChangeAnswer: (questionId: string, value: any) => void;
  QuestionRenderer: React.ComponentType<{
    question: Question;
    value: any;
    onChange: (v: any) => void;
  }>;
};

export function SurveySection({
  section,
  answers,
  onChangeAnswer,
  QuestionRenderer,
}: Props) {
  return (
    <Card elevation={0} sx={{ border: `1px solid ${BRAND.border}`, borderRadius: 3 }}>
      <CardContent sx={{ p: 3, m: 3 }}>
        <Typography sx={{ fontSize: 22, fontWeight: 800, color: BRAND.text }}>
          {section.title}
        </Typography>

        {section.description && (
          <Typography sx={{ mt: 0.75, color: BRAND.muted }}>
            {section.description}
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {section.questions.map((q) => (
            <QuestionRenderer
              key={q.id}
              question={q}
              value={answers[q.id]}
              onChange={(val) => onChangeAnswer(q.id, val)}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
