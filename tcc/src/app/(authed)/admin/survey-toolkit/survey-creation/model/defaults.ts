// src/survey-creation/model/defaults.ts
import type { SurveyCreationForm } from './types';

export const SURVEY_CREATION_DEFAULTS: SurveyCreationForm = {
  title: '',
  description: '',
  isDirected: true,
  recipients: [],
  minResponses: 30,

  surveyJson: {
    pages: [{ name: crypto.randomUUID(), title: 'Section 1', description: '', elements: [] }],
  },

  sections: [],
} as const;
