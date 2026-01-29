import type { QuestionKind } from '@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/questionPalette';
import type { SurveyElement } from '@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/surveyJson';

import { ChoicesEditor } from './editors/ChoicesEditor';
import { RatingEditor } from './editors/RatingEditor';
import { MultipleTextEditor } from './editors/MultipleTextEditor';
import { TextEditor } from './editors/TextEditor';
import { AdvancedJsonEditor } from './editors/AdvancedJsonEditor';

type Props = {
  element: SurveyElement;
  onPatch: (patch: Partial<SurveyElement>) => void;
  onChangeKind?: (next: QuestionKind) => void;
};

export function QuestionTypeEditor({ element, onPatch, onChangeKind }: Props) {
  const kindRaw = (element as Record<string, unknown>).kind;
  const kind = (typeof kindRaw === 'string' ? kindRaw : 'short_text') as QuestionKind;

  if (kind === 'single_choice' || kind === 'multi_select' || kind === 'ranking') {
    return <ChoicesEditor element={element} onPatch={onPatch} onChangeKind={onChangeKind} />;
  }

  if (kind === 'scale') {
    return <RatingEditor element={element} onPatch={onPatch} />;
  }

  if (kind === 'multiple_short_text' || kind === 'date_range') {
    return <MultipleTextEditor element={element} onPatch={onPatch} />;
  }

  if (
    kind === 'short_text' ||
    kind === 'long_text' ||
    kind === 'number' ||
    kind === 'number_range' ||
    kind === 'single_date'
  ) {
    return <TextEditor element={element} onPatch={onPatch} />;
  }

  return <AdvancedJsonEditor element={element} onPatch={onPatch} />;
}
