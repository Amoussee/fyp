// tcc/src/types/QuestionTypeComponent.ts

import type { QuestionKind } from "@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/questionPalette";

export type QuestionMode = "edit" | "preview";

export type QuestionTypeProps = {
  kind: QuestionKind;
  mode: QuestionMode;
  element: any;
  onPatch: (patch: Partial<any>) => void;
};
