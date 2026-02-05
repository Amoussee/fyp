'use client';

import * as React from 'react';
import type { QuestionTypeProps } from '../../types/QuestionTypeComponent';
import type { SurveyElement } from '@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/surveyJson';

const SHORT_TEXT_MAX = 1000;
const LONG_TEXT_MAX = 3000;
const LONG_TEXT_ROWS = 3;

function enforceIfDifferent(
  element: SurveyElement,
  desired: Partial<SurveyElement>,
): Partial<SurveyElement> {
  const patch: Partial<SurveyElement> = {};
  for (const [k, v] of Object.entries(desired)) {
    if (element?.[k] !== v) patch[k] = v;
  }
  return patch;
}

export function TextEdit({ kind, element, onPatch }: QuestionTypeProps) {
  React.useEffect(() => {
    if (kind === 'short_text') {
      const patch = enforceIfDifferent(element, {
        type: 'text',
        inputType: 'text',
        maxLength: SHORT_TEXT_MAX,
      });
      if (Object.keys(patch).length) onPatch(patch);
    }

    if (kind === 'long_text') {
      const patch = enforceIfDifferent(element, {
        type: 'comment',
        rows: LONG_TEXT_ROWS,
        maxLength: LONG_TEXT_MAX,
        autoGrow: true,
      });
      if (Object.keys(patch).length) onPatch(patch);
    }

    if (kind === 'number') {
      const patch = enforceIfDifferent(element, {
        type: 'text',
        inputType: 'number',
      });
      if (Object.keys(patch).length) onPatch(patch);
    }
  }, [kind, element, onPatch]);
}
