// src/app/(authed)/admin/survey-toolkit/survey-creation/model/types.ts
import type { SurveyJson } from './surveyJson';

// Survey Details
export type RecipientOption = { id: string; label: string };

export type SurveyCreationForm = {
  // step 1
  title: string;
  description: string;
  isDirected: boolean;
  recipients: { id: string; label: string }[];
  minResponse: number | '';

  // step 2
  sections: SurveySection[];
  surveyJson: SurveyJson; // ✅ no any
};

export type SurveyCreationErrors = Partial<Record<keyof SurveyCreationForm, string>>;

// Survey Questions
export type QuestionType = 'multi-select' | 'single-select' | 'short-text' | 'number' | 'nps-score';

export type QuestionOption = {
  id: string;
  label: string;
};

export type SurveyQuestion = {
  id: string;
  title: string;
  description: string;
  type: QuestionType;

  // for select questions
  options: QuestionOption[];

  // for number question
  min?: number;
  max?: number;

  required?: boolean;
};

export type SurveySection = {
  id: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
};
