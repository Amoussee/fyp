"use client";

import type { QuestionTypeProps } from "../../types/QuestionTypeComponent";
import { ChoicesEdit } from "./Edit";
import { ChoicesPreview } from "./Preview";

export function ChoicesQuestion(props: QuestionTypeProps) {
  return props.mode === "preview" ? <ChoicesPreview {...props} /> : <ChoicesEdit {...props} />;
}
