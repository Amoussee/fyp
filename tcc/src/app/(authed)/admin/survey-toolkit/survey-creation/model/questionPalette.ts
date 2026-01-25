// src/survey-creation/model/questionPalette.ts
export type QuestionKind =
  | "multiple_choice_single"
  | "multiple_choice_multi"
  | "multiple_short_text"
  | "short_text"
  | "long_text"
  | "scale"
  | "single_number"
  | "number_range"
  | "single_date"
  | "date_range"
  | "ranking";

export type PaletteItem = {
  kind: QuestionKind;
  label: string;
  // Which SurveyJS base type we use
  sjType: string;
  // Default element JSON fields (beyond type/name/title)
  defaults?: Record<string, any>;
};

export const QUESTION_PALETTE: PaletteItem[] = [
  // 1) Multiple choice (single)
  {
    kind: "multiple_choice_single",
    label: "Multiple choice (single select)",
    sjType: "radiogroup",
    defaults: { choices: ["Option 1", "Option 2"] },
  },

  // 2) Multiple choice (multi)
  {
    kind: "multiple_choice_multi",
    label: "Multiple choice (multi select)",
    sjType: "checkbox",
    defaults: { choices: ["Option 1", "Option 2"] },
  },

  // 3) Multiple short text
  {
    kind: "multiple_short_text",
    label: "Multiple short text",
    sjType: "multipletext",
    defaults: {
      items: [
        { name: "item1", title: "Item 1" },
        { name: "item2", title: "Item 2" },
      ],
    },
  },

  // 4) Short text
  {
    kind: "short_text",
    label: "Short text",
    sjType: "text",
    defaults: { inputType: "text" },
  },

  // 5) Long text
  {
    kind: "long_text",
    label: "Long text",
    sjType: "comment",
    defaults: { rows: 4 },
  },

  // 6) Scale
  {
    kind: "scale",
    label: "Scale",
    sjType: "rating",
    defaults: { rateMin: 1, rateMax: 5, rateStep: 1 },
  },

  // 7) Single number
  {
    kind: "single_number",
    label: "Single number",
    sjType: "text",
    defaults: {
      inputType: "number",
      // you can also use validators if you prefer
      // validators: [{ type: "numeric" }]
    },
  },

  // 8) Number range
  {
    kind: "number_range",
    label: "Number range",
    sjType: "text",
    defaults: {
      inputType: "number",
      validators: [{ type: "numeric", minValue: 0, maxValue: 100 }],
    },
  },

  // 9) Single date
  {
    kind: "single_date",
    label: "Single date",
    sjType: "text",
    defaults: { inputType: "date" },
  },

  // 10) Date range (best done as multipletext with 2 date inputs)
  {
    kind: "date_range",
    label: "Date range",
    sjType: "multipletext",
    defaults: {
      items: [
        { name: "startDate", title: "Start date", inputType: "date" },
        { name: "endDate", title: "End date", inputType: "date" },
      ],
    },
  },

  // 11) Ranking
  {
    kind: "ranking",
    label: "Ranking",
    sjType: "ranking",
    defaults: { choices: ["Option 1", "Option 2", "Option 3"] },
  },
];

// Helpers
export function kindToPaletteItem(kind: QuestionKind) {
  const item = QUESTION_PALETTE.find((x) => x.kind === kind);
  if (!item) throw new Error(`Unknown QuestionKind: ${kind}`);
  return item;
}
