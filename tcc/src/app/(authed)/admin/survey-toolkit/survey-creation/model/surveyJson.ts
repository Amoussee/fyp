// src/survey-creation/model/surveyJson.ts
import { createElementFromKind } from './surveyElementFactory';
import type { QuestionKind } from './questionPalette';

export function updateSurveyJson<T extends object>(prev: T, recipe: (draft: T) => void): T {
  // Node/modern browsers support structuredClone; Next.js client does too in modern environments
  const next = structuredClone(prev);
  recipe(next);
  return next;
}

type SurveyJson = any;

const uid = () => crypto.randomUUID();

export function addPage(prev: SurveyJson, title?: string) {
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

export function updatePage(prev: SurveyJson, pageName: string, patch: Partial<any>) {
  return updateSurveyJson(prev, (draft) => {
    const page = (draft.pages ?? []).find((p: any) => p.name === pageName);
    if (!page) return;
    Object.assign(page, patch);
  });
}

export function addElementByKind(prev: any, pageName: string, kind: QuestionKind) {
  return updateSurveyJson(prev, (draft) => {
    const page = (draft.pages ?? []).find((p: any) => p.name === pageName);
    if (!page) return;
    page.elements ??= [];
    page.elements.push(createElementFromKind(kind));
  });
}

export function updateElement(
  prev: SurveyJson,
  pageName: string,
  elementName: string,
  patch: Partial<any>,
) {
  return updateSurveyJson(prev, (draft) => {
    const page = (draft.pages ?? []).find((p: any) => p.name === pageName);
    const el = (page?.elements ?? []).find((e: any) => e.name === elementName);
    if (!el) return;
    Object.assign(el, patch);
  });
}

export function removeElement(prev: SurveyJson, pageName: string, elementName: string) {
  return updateSurveyJson(prev, (draft) => {
    const page = (draft.pages ?? []).find((p: any) => p.name === pageName);
    if (!page?.elements) return;
    page.elements = page.elements.filter((e: any) => e.name !== elementName);
  });
}

export function changeElementKind(
  prev: any,
  pageName: string,
  elementName: string,
  nextKind: QuestionKind,
) {
  return updateSurveyJson(prev, (draft) => {
    const page = (draft.pages ?? []).find((p: any) => p.name === pageName);
    if (!page?.elements) return;

    const idx = page.elements.findIndex((e: any) => e.name === elementName);
    if (idx < 0) return;

    const old = page.elements[idx];
    const replacement = createElementFromKind(nextKind);

    // preserve stable identity + common fields
    replacement.name = old.name; // keep stable key
    replacement.title = old.title ?? replacement.title;
    replacement.description = old.description ?? replacement.description;
    replacement.isRequired = !!old.isRequired;

    page.elements[idx] = replacement;
  });
}

export function removePage(surveyJson: any, pageName: string) {
  const pages = Array.isArray(surveyJson?.pages) ? surveyJson.pages : [];
  const nextPages = pages.filter((p: any) => p?.name !== pageName);
  return { ...surveyJson, pages: nextPages };
}
