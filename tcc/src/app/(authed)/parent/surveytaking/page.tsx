'use client';

import * as React from 'react';
import { useState } from 'react';
import { Box, Container, Button, Stack } from '@mui/material';
import { BRAND } from '@/src/styles/brand';
import { SurveyDetails } from '@/src/components/survey-creation/parent-view/SurveyDetails';
import { SurveyProgress } from '@/src/components/survey-creation/parent-view/SurveyProgress';
import {
  SurveySection,
  Section,
  Question,
} from '@/src/components/survey-creation/parent-view/SurveySection';
import type { JsonValue } from '@/src/lib/api/types';

// Mock question renderer component
function QuestionRenderer({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: JsonValue;
  onChange: (v: JsonValue) => void;
}) {
  return (
    <Box
      sx={{
        p: 2.5,
        border: `1px solid ${BRAND.border}`,
        borderRadius: 2,
        backgroundColor: BRAND.bg,
      }}
    >
      <Box sx={{ mb: 1.5 }}>
        <Box component="span" sx={{ color: BRAND.text, fontWeight: 600 }}>
          {question.prompt}
        </Box>
        {question.required && (
          <Box component="span" sx={{ color: '#ef4444', ml: 0.5 }}>
            *
          </Box>
        )}
      </Box>

      {question.description && (
        <Box sx={{ mb: 1.5, fontSize: '0.875rem', color: BRAND.muted }}>{question.description}</Box>
      )}

      {/* Simple text input example */}
      <input
        type="text"
        value={(value as string) || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.config?.placeholder || 'Enter your answer...'}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: '8px',
          border: `1px solid ${BRAND.border}`,
          fontSize: '14px',
          fontFamily: 'inherit',
          color: BRAND.text,
          backgroundColor: BRAND.bg,
        }}
      />
    </Box>
  );
}

// Mock data
const mockSections: Section[] = [
  {
    id: 'section-1',
    title: 'Personal Information',
    description: 'Please provide your basic information',
    questions: [
      {
        id: 'q1',
        kind: 'short_text',
        prompt: 'What is your full name?',
        required: true,
        config: { placeholder: 'Enter your name' },
      },
      {
        id: 'q2',
        kind: 'short_text',
        prompt: 'What is your email address?',
        description: 'We will use this to send you updates',
        required: true,
        config: { placeholder: 'email@example.com' },
      },
    ],
  },
  {
    id: 'section-2',
    title: 'Feedback',
    description: 'Share your thoughts with us',
    questions: [
      {
        id: 'q3',
        kind: 'long_text',
        prompt: 'How would you rate your experience?',
        required: false,
        config: { placeholder: 'Share your feedback...', rows: 4 },
      },
    ],
  },
];

export default function SurveyTakingPage() {
  const [step, setStep] = useState(0); // 0 = details, 1+ = sections
  const [answers, setAnswers] = useState<Record<string, JsonValue>>({});

  const sectionNavItems = mockSections.map((s) => ({ id: s.id, title: s.title }));

  const handleChangeAnswer = (questionId: string, value: JsonValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (step < mockSections.length) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSelectSection = (sectionIndex: number) => {
    setStep(sectionIndex + 1);
  };

  const handleSubmit = () => {
    console.log('Survey submitted with answers:', answers);
    alert('Survey submitted successfully!');
  };

  const currentSection = step > 0 ? mockSections[step - 1] : null;
  const isLastSection = step === mockSections.length;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: BRAND.surface,
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={3}>
          {/* Progress Card */}
          <SurveyProgress
            step={step}
            sectionCount={mockSections.length}
            sections={sectionNavItems}
            onSelectSection={handleSelectSection}
          />

          {/* Survey Details or Section */}
          {step === 0 ? (
            <SurveyDetails
              title="Student Wellbeing Survey 2024"
              description="This survey aims to understand student wellbeing and mental health. Your responses will help us improve our support services."
              createdDate="January 15, 2024"
              responseCount={145}
              totalResponses={200}
            />
          ) : currentSection ? (
            <SurveySection
              section={currentSection}
              answers={answers}
              onChangeAnswer={handleChangeAnswer}
              QuestionRenderer={QuestionRenderer}
            />
          ) : null}

          {/* Navigation Buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 2,
              pt: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={handlePrevious}
              disabled={step === 0}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                borderColor: BRAND.border,
                color: BRAND.text,
                '&:hover': {
                  borderColor: BRAND.muted,
                  backgroundColor: BRAND.surface,
                },
                '&:disabled': {
                  borderColor: BRAND.border,
                  color: BRAND.muted,
                },
              }}
            >
              Previous
            </Button>

            {isLastSection ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  backgroundColor: BRAND.green,
                  '&:hover': {
                    backgroundColor: BRAND.green,
                    opacity: 0.9,
                  },
                }}
              >
                Submit Survey
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  backgroundColor: BRAND.green,
                  '&:hover': {
                    backgroundColor: BRAND.green,
                    opacity: 0.9,
                  },
                }}
              >
                {step === 0 ? 'Start Survey' : 'Next Section'}
              </Button>
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
