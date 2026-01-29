// tcc/src/types/QuestionTypeComponent.ts

import type { QuestionKind } from '@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/questionPalette';
import type { SurveyElement } from '@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/surveyJson';
export type QuestionMode = 'edit' | 'preview';

export type QuestionTypeProps = {
  kind: QuestionKind;
  mode: QuestionMode;
  element: SurveyElement;
  onPatch: (patch: Partial<SurveyElement>) => void;
};
