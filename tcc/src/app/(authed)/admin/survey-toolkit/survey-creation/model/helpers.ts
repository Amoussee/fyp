// src/features/surveyCreation/model/helpers.ts
import type { SurveyCreationErrors, SurveyCreationForm } from './types';
import { Model } from 'survey-core';
import { QUESTION_PALETTE } from './questionPalette';

export function hasErrors(errors: SurveyCreationErrors) {
  return Object.values(errors).some(Boolean);
}

export function clearError<K extends keyof SurveyCreationForm>(
  errors: SurveyCreationErrors,
  key: K,
): SurveyCreationErrors {
  return { ...errors, [key]: undefined };
}

export function getAllSurveyJsQuestionTypes() {
  // ✅ now returns your curated list (not SurveyJS registry)
  return QUESTION_PALETTE.map((x) => ({ value: x.kind, label: x.label }));
}

export function createElementJson(type: string, name?: string) {
  const id = crypto.randomUUID();
  return {
    type,
    name: name ?? `${type}_${id.slice(0, 8)}`,
    title: '',
  };
}

export function buildSurveyModel(surveyJson: any) {
  const model = new Model(surveyJson);
  // optional: model.locale = "en";
  return model;
}
