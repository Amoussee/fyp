// tcc/src/components/survey-creation/questions/QuestionTypeRenderer.tsx
'use client';

import type { QuestionKind } from '@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/questionPalette';
import type { QuestionMode } from './types/QuestionTypeComponent';

import { ChoicesQuestion } from './question-types/choices';
import { RatingQuestion } from './question-types/rating';
// import { MultipleTextQuestion } from "./question-types/multipleText";
import { TextQuestion } from './question-types/text';
// import { AdvancedJsonQuestion } from "./question-types/advancedJson";

type Props = {
  kind: QuestionKind;
  mode: QuestionMode;
  element: any;
  onPatch: (patch: Partial<any>) => void;
};

export function QuestionTypeRenderer({ kind, mode, element, onPatch }: Props) {
  if (kind === 'single_choice' || kind === 'multi_select' || kind === 'ranking') {
    return <ChoicesQuestion kind={kind} mode={mode} element={element} onPatch={onPatch} />;
  }

  if (kind === 'scale') {
    return <RatingQuestion kind={kind} mode={mode} element={element} onPatch={onPatch} />;
  }

  if (kind === 'multiple_short_text' || kind === 'date_range') {
    // return <MultipleTextQuestion kind={kind} mode={mode} element={element} onPatch={onPatch} />;
    return null;
  }

  if (
    kind === 'short_text' ||
    kind === 'long_text' ||
    kind === 'number' ||
    kind === 'number_range' ||
    kind === 'single_date'
  ) {
    return <TextQuestion kind={kind} mode={mode} element={element} onPatch={onPatch} />;
  }

  // return <AdvancedJsonQuestion kind={kind} mode={mode} element={element} onPatch={onPatch} />;
  return null;
}
