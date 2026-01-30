'use client';

import * as React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  LinearProgress,
} from "@mui/material";

// -----------------------------
// Types (simplified)
// -----------------------------

type QuestionKind =
  | "short_text"
  | "long_text"
  | "single_select"
  | "multi_select"
  | "single_date";

interface Option {
  id: string;
  label: string;
}

interface Question {
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
}

interface Section {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

interface SurveyPayload {
  title: string;
  description?: string;
  sections: Section[];
}

// -----------------------------
// Page
// -----------------------------

export default function ParentSurveyPage() {
  // mock data (replace with API result)
  const survey: SurveyPayload = {
    title: "Placholder Page",
    description: "We would love to hear about your child's experience.",
    sections: [
      {
        id: "s1",
        title: "Your Child's Experience",
        description: "Questions about learning and enjoyment.",
        questions: [
          {
            id: "q1",
            kind: "short_text",
            prompt: "What is your child's name?",
            required: true,
          },
          {
            id: "q2",
            kind: "single_select",
            prompt: "How satisfied are you with the programme?",
            config: {
              options: [
                { id: "a", label: "Very satisfied" },
                { id: "b", label: "Satisfied" },
                { id: "c", label: "Neutral" },
                { id: "d", label: "Dissatisfied" },
              ],
            },
          },
          {
            id: "q3",
            kind: "long_text",
            prompt: "Any additional comments?",
            config: { rows: 4 },
          },
        ],
      },
    ],
  };

  const [answers, setAnswers] = React.useState<Record<string, any>>({});

  const handleChange = (id: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const totalQuestions = survey.sections.reduce(
    (acc, s) => acc + s.questions.length,
    0
  );

  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f9fafb",
        py: 6,
      }}
    >
      <Box
        sx={{
          maxWidth: 720,
          mx: "auto",
          px: 2,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Header */}
        <Box>
          <Typography sx={{ fontSize: 26, fontWeight: 700 }}>
            {survey.title}
          </Typography>

          {survey.description && (
            <Typography sx={{ mt: 1, color: "text.secondary" }}>
              {survey.description}
            </Typography>
          )}

          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 8, borderRadius: 999 }}
            />
            <Typography sx={{ fontSize: 12, mt: 0.5, color: "text.secondary" }}>
              {progress}% completed
            </Typography>
          </Box>
        </Box>

        {/* Sections */}
        {survey.sections.map((section) => (
          <Box key={section.id} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
              {section.title}
            </Typography>

            {section.description && (
              <Typography sx={{ color: "text.secondary" }}>
                {section.description}
              </Typography>
            )}

            {section.questions.map((q) => (
              <QuestionRenderer
                key={q.id}
                question={q}
                value={answers[q.id]}
                onChange={(val) => handleChange(q.id, val)}
              />
            ))}
          </Box>
        ))}

        {/* Submit */}
        <Card variant="outlined">
          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              sx={{ borderRadius: 2 }}
              onClick={() => console.log("Submit", answers)}
            >
              Submit
            </Button>

            <Typography sx={{ fontSize: 12, color: "text.secondary", textAlign: "center" }}>
              Your responses are confidential and will be used for improvement only.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

// -----------------------------
// Question Renderer
// -----------------------------

function QuestionRenderer({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: any;
  onChange: (v: any) => void;
}) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Typography sx={{ fontWeight: 600 }}>
          {question.prompt}
          {question.required && (
            <Box component="span" sx={{ color: "error.main" }}>
              {" "}*
            </Box>
          )}
        </Typography>

        {question.description && (
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
            {question.description}
          </Typography>
        )}

        {renderInput(question, value, onChange)}
      </CardContent>
    </Card>
  );
}

function renderInput(
  q: Question,
  value: any,
  onChange: (v: any) => void
) {
  switch (q.kind) {
    case "short_text":
      return (
        <TextField
          fullWidth
          placeholder={q.config?.placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "long_text":
      return (
        <TextField
          fullWidth
          multiline
          minRows={q.config?.rows ?? 4}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "single_select":
      return (
        <RadioGroup
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        >
          {q.config?.options?.map((opt) => (
            <FormControlLabel
              key={opt.id}
              value={opt.id}
              control={<Radio />}
              label={opt.label}
            />
          ))}
        </RadioGroup>
      );

    case "multi_select":
      return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {q.config?.options?.map((opt) => {
            const arr = Array.isArray(value) ? value : [];
            const checked = arr.includes(opt.id);

            return (
              <FormControlLabel
                key={opt.id}
                control={
                  <Checkbox
                    checked={checked}
                    onChange={(e) => {
                      if (e.target.checked) onChange([...arr, opt.id]);
                      else onChange(arr.filter((v: string) => v !== opt.id));
                    }}
                  />
                }
                label={opt.label}
              />
            );
          })}
        </Box>
      );

    case "single_date":
      return (
        <TextField
          type="date"
          fullWidth
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    default:
      return null;
  }
}
