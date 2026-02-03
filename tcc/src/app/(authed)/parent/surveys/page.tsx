'use client';

import * as React from 'react';
import { Box, Button, Card, CardContent } from '@mui/material';
import { BRAND } from '@/src/styles/brand';

import { SurveyDetails } from '@/src/components/survey-creation/parent-view/SurveyDetails';
import { SurveyProgress } from '@/src/components/survey-creation/parent-view/SurveyProgress';
import {
  SurveySection,
  type Section,
} from '@/src/components/survey-creation/parent-view/SurveySection';

// import your existing QuestionTypeRenderer from wherever you keep it
import { QuestionRenderer } from '@/src/components/survey-creation/parent-view/QuestionRenderer';
import type { JsonObject, JsonValue } from '@/src/lib/api/types';

// -----------------------------
// Types for page data
// -----------------------------
type SurveyPayload = {
  title: string;
  description?: string;
  sections: Section[];
};

export default function ParentSurveyPage() {
  // TODO: replace with API result
  const survey: SurveyPayload = {
    title: 'Placholder Page',
    description: "We would love to hear about your child's experience.",
    sections: [
      {
        id: 's1',
        title: "Your Child's Experience",
        description: 'Questions about learning and enjoyment.',
        questions: [
          { id: 'q1', kind: 'short_text', prompt: "What is your child's name?", required: true },
          {
            id: 'q2',
            kind: 'single_choice',
            prompt: 'How satisfied are you with the programme?',
            config: {
              options: [
                { id: 'a', label: 'Very satisfied' },
                { id: 'b', label: 'Satisfied' },
                { id: 'c', label: 'Neutral' },
                { id: 'd', label: 'Dissatisfied' },
              ],
            },
          },
          { id: 'q3', kind: 'long_text', prompt: 'Any additional comments?', config: { rows: 4 } },
        ],
      },
      {
        id: 's2',
        title: 'Carbon Tracking Page',
        description: 'Questions about learning and enjoyment.',
        questions: [
          { id: 'q1', kind: 'short_text', prompt: "What is your child's name?", required: true },
          {
            id: 'q2',
            kind: 'single_choice',
            prompt: 'How satisfied are you with the programme?',
            config: {
              options: [
                { id: 'a', label: 'Very satisfied' },
                { id: 'b', label: 'Satisfied' },
                { id: 'c', label: 'Neutral' },
                { id: 'd', label: 'Dissatisfied' },
              ],
            },
          },
          { id: 'q3', kind: 'long_text', prompt: 'Any additional comments?', config: { rows: 4 } },
        ],
      },
    ],
  };

  // 0 = details, 1..N = sections
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, JsonValue>>({});

  const sectionCount = survey.sections.length;
  const atDetails = step === 0;
  const sectionIndex = step - 1;
  const atLastSection = step === sectionCount;

  const currentSection = !atDetails ? survey.sections[sectionIndex] : null;

  const setAnswer = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f9fafb', py: 6 }}>
      <Box
        sx={{ maxWidth: 860, mx: 'auto', px: 2, display: 'flex', flexDirection: 'column', gap: 3 }}
      >
        <SurveyProgress
          step={step}
          sectionCount={sectionCount}
          sections={survey.sections.map((s) => ({ id: s.id, title: s.title }))}
          onSelectSection={(idx) => setStep(idx + 1)}
        />

        {atDetails ? (
          <SurveyDetails title={survey.title} description={survey.description} />
        ) : (
          <SurveySection
            section={currentSection!}
            answers={answers}
            onChangeAnswer={setAnswer}
            QuestionRenderer={QuestionRenderer}
          />
        )}

        <Card elevation={0} sx={{ border: `1px solid ${BRAND.border}`, borderRadius: 3 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Button
              variant="outlined"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
            >
              Back
            </Button>

            <Box sx={{ flex: 1 }} />

            {atLastSection ? (
              <Button
                variant="contained"
                onClick={() => console.log('Submit', answers)}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 800,
                  bgcolor: BRAND.green,
                  '&:hover': { bgcolor: BRAND.green },
                }}
              >
                Submit
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => setStep((s) => Math.min(sectionCount, s + 1))}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 800,
                  bgcolor: BRAND.green,
                  '&:hover': { bgcolor: BRAND.green },
                }}
              >
                Next
              </Button>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
