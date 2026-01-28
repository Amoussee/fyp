import type { SurveySection, SurveyQuestion, QuestionOption } from "./types";

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now() + Math.random());

function normalizeChoices(choices: any[] | undefined): QuestionOption[] {
  if (!choices) return [];
  return choices.map((c) => {
    // SurveyJS choices can be string | {value,text} | {value}
    if (typeof c === "string") return { id: uid(), label: c };
    if (c && typeof c === "object") {
      const label = String(c.text ?? c.value ?? "");
      return { id: uid(), label };
    }
    return { id: uid(), label: String(c ?? "") };
  });
}

function mapElementToQuestion(el: any): SurveyQuestion {
  // You have a limited QuestionType union now; we can:
  // - map common SurveyJS types into your union
  // - fallback to "short-text"
  const type =
    el.type === "checkbox"
      ? "multi-select"
      : el.type === "radiogroup" || el.type === "dropdown"
      ? "single-select"
      : el.type === "rating" || el.type === "nouislider"
      ? "nps-score"
      : el.type === "text" || el.type === "comment"
      ? "short-text"
      : el.type === "expression"
      ? "short-text"
      : "short-text";

  return {
    id: el.name ?? uid(),
    title: el.title ?? "",
    description: el.description ?? "",
    type,
    options:
      type === "multi-select" || type === "single-select"
        ? normalizeChoices(el.choices)
        : [],
    required: !!el.isRequired,

    // number range if you ever map to number questions
    min: typeof el.min === "number" ? el.min : undefined,
    max: typeof el.max === "number" ? el.max : undefined,
  };
}

export function surveyJsonToSections(surveyJson: any): SurveySection[] {
  const pages = Array.isArray(surveyJson?.pages) ? surveyJson.pages : [];

  return pages.map((p: any, idx: number) => {
    const elements = Array.isArray(p.elements) ? p.elements : [];
    return {
      id: p.name ?? `section_${idx + 1}`,
      title: p.title ?? `Section ${idx + 1}`,
      description: p.description ?? "",
      questions: elements.map(mapElementToQuestion),
    };
  });
}
