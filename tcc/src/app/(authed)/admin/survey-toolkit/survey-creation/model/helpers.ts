// src/features/surveyCreation/model/helpers.ts
import type { SurveyCreationErrors, SurveyCreationForm } from "./types";

export function hasErrors(errors: SurveyCreationErrors) {
  return Object.values(errors).some(Boolean);
}

export function clearError<K extends keyof SurveyCreationForm>(
  errors: SurveyCreationErrors,
  key: K
): SurveyCreationErrors {
  return { ...errors, [key]: undefined };
}
