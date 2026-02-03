'use client';

import type { QuestionTypeProps } from '../../types/QuestionTypeComponent';
import { ScaleEdit } from './Edit';
import { ScalePreview } from './Preview';

export function RatingQuestion(props: QuestionTypeProps) {
  return props.mode === 'preview' ? <ScalePreview {...props} /> : <ScaleEdit {...props} />;
}
