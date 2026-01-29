import { createElementJson } from './helpers';
import { kindToPaletteItem, type QuestionKind } from './questionPalette';

export function createElementFromKind(kind: QuestionKind) {
  const item = kindToPaletteItem(kind);
  const base = createElementJson(item.sjType);

  return {
    ...base,
    // store the chosen kind so your UI can show the curated type consistently
    kind,
    ...item.defaults,
  };
}
