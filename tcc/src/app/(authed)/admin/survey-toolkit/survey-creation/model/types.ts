// src/survey-creation/model/types.ts
export type RecipientOption = { id: string; label: string };

export type SurveyCreationForm = {
  title: string;
  description: string;
  isDirected: boolean;
  recipients: RecipientOption[];
  minResponses: number | "";
};

export type SurveyCreationErrors = Partial<Record<keyof SurveyCreationForm, string>>;
