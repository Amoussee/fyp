"use client";

import type { QuestionTypeProps } from "../../types/QuestionTypeComponent";
import { TextEdit } from "./Edit";
import { TextPreview } from "./Preview";

export function TextQuestion(props: QuestionTypeProps) {
  return props.mode === "preview" ? <TextPreview {...props} /> : <TextEdit {...props} />;
}
