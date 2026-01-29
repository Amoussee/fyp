// src/survey-creation/model/validation.ts
import type { SurveyCreationForm, SurveyCreationErrors } from './types';

export function validateSurveyDetails(form: SurveyCreationForm): SurveyCreationErrors {
  const errors: SurveyCreationErrors = {};

  const title = form.title.trim();
  if (!title) errors.title = 'Survey title is required.';

  const desc = form.description.trim();
  if (!desc) errors.description = 'Description is required.';

  if (form.isDirected && form.recipients.length === 0) {
    errors.recipients = 'Please select at least 1 school.';
  }

  const n = Number(form.minResponses);
  if (form.minResponses === '' || Number.isNaN(n))
    errors.minResponses = 'Minimum responses is required.';
  else if (!Number.isInteger(n)) errors.minResponses = 'Must be a whole number.';
  else if (n < 1) errors.minResponses = 'Must be at least 1.';

  return errors;
}
