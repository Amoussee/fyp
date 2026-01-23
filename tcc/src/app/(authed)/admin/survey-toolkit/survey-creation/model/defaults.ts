// src/survey-creation/model/defaults.ts
import type { SurveyCreationForm } from "./types";

export const SURVEY_CREATION_DEFAULTS: SurveyCreationForm = {
  title: "",
  description: "",
  isDirected: true,
  recipients: [],
  minResponses: 30,
};
