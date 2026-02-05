// src/app/(authed)/admin/survey-toolkit/survey-creation/model/surveyJson.ts
import { createElementFromKind } from './surveyElementFactory';
import type { QuestionKind } from './questionPalette';

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export type JsonObject = { [k: string]: JsonValue };

export type ChoiceItem =
  | string
  | {
      value: string;
      text?: string;
    };

export type NumericValidator = {
  type: 'numeric';
  minValue?: number;
  maxValue?: number;
} & JsonObject;

export type SurveyValidator = NumericValidator | (JsonObject & { type?: string });

export type SurveyElement = {
  name: string;
  type?: string;
  kind?: string;

  title?: string;
  description?: string;
  isRequired?: boolean;

  // choices questions
  choices?: ChoiceItem[];

  // rating questions
  rateMin?: number;
  rateMax?: number;
  rateStep?: number;
  minRateDescription?: string;
  maxRateDescription?: string;

  // multiple text / date range
  items?: Array<{ name: string; title: string; inputType?: string }>;

  // IMPORTANT: validators is an ARRAY
  validators?: SurveyValidator[];

  // allow any other SurveyJS props (typed, not `any`)
  [k: string]: JsonValue | undefined;
};

export type SurveyElementPatch = Partial<SurveyElement>;

export type SurveyPage = {
  name: string;
  title?: string;
  description?: string;
  elements?: SurveyElement[];
} & JsonObject;

export type SurveyJson = {
  pages?: SurveyPage[];
} & JsonObject;

const uid = () => crypto.randomUUID();

export function updateSurveyJson<T extends object>(prev: T, recipe: (draft: T) => void): T {
  // Node/modern browsers support structuredClone; Next.js client does too in modern environments
  const next = structuredClone(prev);
  recipe(next);
  return next;
}

export function addPage(prev: SurveyJson, title?: string): SurveyJson {
  return updateSurveyJson(prev, (draft) => {
    draft.pages ??= [];
    const n = draft.pages.length + 1;
    draft.pages.push({
      name: uid(),
      title: title ?? `Section ${n}`,
      description: '',
      elements: [],
    });
  });
}

export function updatePage(
  prev: SurveyJson,
  pageName: string,
  patch: Partial<SurveyPage>,
): SurveyJson {
  return updateSurveyJson(prev, (draft) => {
    const page = (draft.pages ?? []).find((p) => p.name === pageName);
    if (!page) return;
    Object.assign(page, patch);
  });
}

export function addElementByKind(
  prev: SurveyJson,
  pageName: string,
  kind: QuestionKind,
): SurveyJson {
  return updateSurveyJson(prev, (draft) => {
    const page = (draft.pages ?? []).find((p) => p.name === pageName);
    if (!page) return;
    page.elements ??= [];
    page.elements.push(createElementFromKind(kind) as SurveyElement);
  });
}

export function updateElement(
  prev: SurveyJson,
  pageName: string,
  elementName: string,
  patch: Partial<SurveyElement>,
): SurveyJson {
  return updateSurveyJson(prev, (draft) => {
    const page = (draft.pages ?? []).find((p) => p.name === pageName);
    const el = (page?.elements ?? []).find((e) => e.name === elementName);
    if (!el) return;
    Object.assign(el, patch);
  });
}

export function removeElement(prev: SurveyJson, pageName: string, elementName: string): SurveyJson {
  return updateSurveyJson(prev, (draft) => {
    const page = (draft.pages ?? []).find((p) => p.name === pageName);
    if (!page?.elements) return;
    page.elements = page.elements.filter((e) => e.name !== elementName);
  });
}

export function changeElementKind(
  prev: SurveyJson,
  pageName: string,
  elementName: string,
  nextKind: QuestionKind,
): SurveyJson {
  return updateSurveyJson(prev, (draft) => {
    const page = (draft.pages ?? []).find((p) => p.name === pageName);
    if (!page?.elements) return;

    const idx = page.elements.findIndex((e) => e.name === elementName);
    if (idx < 0) return;

    const old = page.elements[idx];
    const replacement = createElementFromKind(nextKind) as SurveyElement;

    // preserve stable identity + common fields
    replacement.name = old.name;
    replacement.title = old.title ?? replacement.title;
    replacement.description = old.description ?? replacement.description;
    replacement.isRequired = Boolean(old.isRequired);

    page.elements[idx] = replacement;
  });
}

export function removePage(surveyJson: SurveyJson, pageName: string): SurveyJson {
  const pages = Array.isArray(surveyJson.pages) ? surveyJson.pages : [];
  const nextPages = pages.filter((p) => p.name !== pageName);
  return { ...surveyJson, pages: nextPages };
}
