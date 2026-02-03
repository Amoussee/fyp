'use client';

import * as React from 'react';
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { BRAND } from '@/src/styles/brand';
import type { Question } from '@/src/components/survey-creation/parent-view/SurveySection'; // adjust import to your actual Question type
import type { JsonValue } from '@/src/lib/api/types';

type Props = {
  question: Question;
  value: JsonValue;
  onChange: (v: JsonValue) => void;
};

export function QuestionRenderer({ question, value, onChange }: Props) {
  return (
    <Card elevation={0} sx={{ border: `1px solid ${BRAND.border}`, borderRadius: 3 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography sx={{ fontWeight: 800, color: BRAND.text }}>
          {question.prompt}
          {question.required ? (
            <Box component="span" sx={{ color: 'error.main' }}>
              {' '}
              *
            </Box>
          ) : null}
        </Typography>

        {question.description ? (
          <Typography sx={{ fontSize: 13, color: BRAND.muted, mt: 0.5 }}>
            {question.description}
          </Typography>
        ) : null}

        <Box sx={{ mt: 1.5 }}>{renderParentInput(question, value, onChange)}</Box>
      </CardContent>
    </Card>
  );
}

function renderParentInput(q: Question, value: JsonValue, onChange: (v: JsonValue) => void) {
  switch (q.kind) {
    case 'short_text':
      return (
        <TextField
          fullWidth
          placeholder={q.config?.placeholder ?? 'Your answer'}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
        />
      );

    case 'long_text':
      return (
        <TextField
          fullWidth
          multiline
          minRows={q.config?.rows ?? 4}
          placeholder={q.config?.placeholder ?? 'Your answer'}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
        />
      );

    case 'single_choice':
      return (
        <RadioGroup value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
          {(q.config?.options ?? []).map((opt) => (
            <FormControlLabel key={opt.id} value={opt.id} control={<Radio />} label={opt.label} />
          ))}
        </RadioGroup>
      );

    case 'multi_select': {
      const arr = Array.isArray(value) ? value : [];
      const selected = arr.filter((v): v is string => typeof v === 'string');

      return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {(q.config?.options ?? []).map((opt) => {
            const checked = selected.includes(opt.id);
            return (
              <FormControlLabel
                key={opt.id}
                control={
                  <Checkbox
                    checked={checked}
                    onChange={(e) => {
                      if (e.target.checked) onChange([...selected, opt.id]);
                      else onChange(selected.filter((v) => v !== opt.id));
                    }}
                  />
                }
                label={opt.label}
              />
            );
          })}
        </Box>
      );
    }

    case 'single_date':
      return (
        <TextField
          type="date"
          fullWidth
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
        />
      );

    default:
      return null;
  }
}
