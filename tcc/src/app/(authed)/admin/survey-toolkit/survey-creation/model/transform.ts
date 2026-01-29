import type { SurveySection, SurveyQuestion, QuestionOption } from './types';
import type { SurveyJson, SurveyPage, SurveyElement } from './surveyJson';

const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now() + Math.random());

type SurveyChoice =
  | string
  | { value?: unknown; text?: unknown }
  | Record<string, unknown>
  | null
  | undefined;

function normalizeChoices(choices: SurveyChoice[] | undefined): QuestionOption[] {
  if (!choices) return [];

  return choices.map((c) => {
    if (typeof c === 'string') return { id: uid(), label: c };

    if (c && typeof c === 'object') {
      const maybe = c as { value?: unknown; text?: unknown };
      const label = String(maybe.text ?? maybe.value ?? '');
      return { id: uid(), label };
    }

    return { id: uid(), label: String(c ?? '') };
  });
}

function mapElementToQuestion(el: SurveyElement): SurveyQuestion {
  const sjType = el.type;

  const type: SurveyQuestion['type'] =
    sjType === 'checkbox'
      ? 'multi-select'
      : sjType === 'radiogroup' || sjType === 'dropdown'
        ? 'single-select'
        : sjType === 'rating' || sjType === 'nouislider'
          ? 'nps-score'
          : sjType === 'text' || sjType === 'comment'
            ? 'short-text'
            : 'short-text';

  // el.choices is JsonValue in your SurveyElement type, so narrow safely
  const rawChoices = (el as Record<string, unknown>).choices;
  const choices = Array.isArray(rawChoices) ? (rawChoices as SurveyChoice[]) : undefined;

  const rawMin = (el as Record<string, unknown>).min;
  const rawMax = (el as Record<string, unknown>).max;

  return {
    id: el.name ?? uid(),
    title: el.title ?? '',
    description: el.description ?? '',
    type,
    options: type === 'multi-select' || type === 'single-select' ? normalizeChoices(choices) : [],
    required: Boolean(el.isRequired),
    min: typeof rawMin === 'number' ? rawMin : undefined,
    max: typeof rawMax === 'number' ? rawMax : undefined,
  };
}

export function surveyJsonToSections(surveyJson: SurveyJson): SurveySection[] {
  const pages: SurveyPage[] = Array.isArray(surveyJson.pages) ? surveyJson.pages : [];

  return pages.map((p, idx) => {
    const elements: SurveyElement[] = Array.isArray(p.elements) ? p.elements : [];

    return {
      id: p.name ?? `section_${idx + 1}`,
      title: p.title ?? `Section ${idx + 1}`,
      description: p.description ?? '',
      questions: elements.map(mapElementToQuestion),
    };
  });
}
