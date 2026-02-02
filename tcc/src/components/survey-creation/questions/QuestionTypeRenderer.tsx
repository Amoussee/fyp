// tcc/src/components/survey-creation/questions/QuestionTypeRenderer.tsx
'use client';

import type { QuestionKind } from '@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/questionPalette';
import type { SurveyElement } from '@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/surveyJson';
import type { QuestionMode } from './types/QuestionTypeComponent';

import { ChoicesQuestion } from './question-types/choices';
import { RatingQuestion } from './question-types/rating';
// import { MultipleTextQuestion } from "./question-types/multipleText";
import { TextQuestion } from './question-types/text';
// import { AdvancedJsonQuestion } from "./question-types/advancedJson";

type Props = {
  kind: QuestionKind;
  mode: QuestionMode;
  element: SurveyElement;
  onPatch: (patch: Partial<SurveyElement>) => void;
};

export function QuestionTypeRenderer({ kind, mode, element, onPatch }: Props) {
  if (kind === 'single_choice' || kind === 'multi_select') {
    return <ChoicesQuestion kind={kind} mode={mode} element={element} onPatch={onPatch} />;
  }

  if (kind === 'scale') {
    return <RatingQuestion kind={kind} mode={mode} element={element} onPatch={onPatch} />;
  }

  if (
    kind === 'short_text' ||
    kind === 'long_text' ||
    kind === 'number' 
  ) {
    return <TextQuestion kind={kind} mode={mode} element={element} onPatch={onPatch} />;
  }

  // return <AdvancedJsonQuestion kind={kind} mode={mode} element={element} onPatch={onPatch} />;
  return null;
}
