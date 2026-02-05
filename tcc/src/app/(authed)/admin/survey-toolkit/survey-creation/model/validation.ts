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

  const n = Number(form.minResponse);
  if (form.minResponse === '' || Number.isNaN(n))
    errors.minResponse = 'Minimum responses is required.';
  else if (!Number.isInteger(n)) errors.minResponse = 'Must be a whole number.';
  else if (n < 1) errors.minResponse = 'Must be at least 1.';

  return errors;
}
