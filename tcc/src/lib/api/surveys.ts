import { apiFetch } from './client';
import type { SurveyCreationForm } from '@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/types';
import type { SurveyJson } from '@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/surveyJson';

export type CreateSurveyPayload = {
  title: string;
  description: string;
  status: 'draft' | 'open';
  minResponse: number;
  recipients: number[];
  schema_json: SurveyJson;
  metadata: {
    isDirected: boolean;
  };
};

export async function createSurvey(payload: CreateSurveyPayload) {
  return apiFetch<{
    newSurvey: { form_id: number };
    link: string;
  }>('/api/surveys', {
    method: 'POST',
    body: payload,
  });
}

/**
 * Converts SurveyCreationForm → backend payload
 */
export function createSurveyFromForm(
  form: SurveyCreationForm,
  status: 'draft' | 'open',
) {
  const payload: CreateSurveyPayload = {
    title: form.title.trim(),
    description: form.description.trim(),

    status,

    minResponse:
      form.minResponse === '' ? 0 : Number(form.minResponse),

    recipients: form.isDirected
      ? form.recipients.map((r) => Number(r.id))
      : [],

    schema_json: form.surveyJson,

    metadata: {
      isDirected: form.isDirected,
    },
  };

  return createSurvey(payload);
}
