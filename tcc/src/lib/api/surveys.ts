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

export type Survey = {
  form_id: number;
  title: string;
  description: string;
  status: 'draft' | 'open' | 'closed';
  minResponse: number;
  recipients: number[];
  schema_json: SurveyJson;
  metadata: {
    isDirected: boolean;
  };
  created_at?: string;
  updated_at?: string;
};

// Create a new survey
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
export function createSurveyFromForm(form: SurveyCreationForm, status: 'draft' | 'open') {
  const payload: CreateSurveyPayload = {
    title: form.title.trim(),
    description: form.description.trim(),
    status,
    minResponse: form.minResponse === '' ? 0 : Number(form.minResponse),
    recipients: form.isDirected ? form.recipients.map((r) => Number(r.id)) : [],
    schema_json: form.surveyJson,
    metadata: {
      isDirected: form.isDirected,
    },
  };

  return createSurvey(payload);
}

// Get all surveys
export async function getAllSurveys() {
  return apiFetch<{ surveys: Survey[] }>('/api/surveys', {
    method: 'GET',
  });
}

// Get a specific survey by ID
export async function getSurveyById(id: number) {
  return apiFetch<{ survey: Survey }>(`/api/surveys/${id}`, {
    method: 'GET',
  });
}

// Update a survey (used when drafts are updated)
export async function updateSurvey(id: number, payload: Partial<CreateSurveyPayload>) {
  return apiFetch<{ survey: { form_id: number }; link?: string }>(`/api/surveys/${id}`, {
    method: 'PUT',
    body: payload,
  });
}

// Delete a survey
export async function deleteSurvey(id: number) {
  return apiFetch<{ message: string }>(`/api/surveys/${id}`, {
    method: 'DELETE',
  });
}

// Update survey status (publish draft or force close)
export async function updateSurveyStatus(
  id: number,
  status: 'open' | 'closed'
) {
  return apiFetch<{ survey: Survey; message: string }>(`/api/surveys/${id}/status`, {
    method: 'PATCH',
    body: { status },
  });
}

// Optional: Get surveys by status (if you uncomment the backend route)
// export async function getSurveysByStatus(status: 'draft' | 'open' | 'closed') {
//   return apiFetch<{ surveys: Survey[] }>(`/api/surveys/status/${status}`, {
//     method: 'GET',
//   });
// }