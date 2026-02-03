// src/survey-creation/model/questionPalette.ts
import type { SvgIconComponent } from '@mui/icons-material';
import ShortTextIcon from '@mui/icons-material/ShortText';
import NotesIcon from '@mui/icons-material/Notes';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import NumbersIcon from '@mui/icons-material/Numbers';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import type { JsonObject } from './surveyJson';

/**
 * 1) Full list of question kinds you support in your system (ALL 11).
 * This is what your surveyJson element.kind should be.
 */
export type QuestionKind =
  | 'short_text'
  | 'long_text'
  | 'multi_select'
  | 'single_choice'
  | 'number'
  | 'scale'
  | 'multiple_short_text'
  | 'number_range'
  | 'single_date'
  | 'date_range'
  | 'ranking';

/**
 * 2) Subset shown in the right-side icon rail (keep it compact).
 * (It can be expanded later without breaking the model.)
 */
export type QuestionRailKind =
  | 'short_text'
  | 'long_text'
  | 'multi_select'
  | 'single_choice'
  | 'number'
  | 'scale';

export type QuestionKindMeta<K extends QuestionKind = QuestionKind> = {
  kind: K;
  label: string;
  icon: SvgIconComponent;
};

/**
 * Right rail list (only 6)
 */
export const QUESTION_KINDS: QuestionKindMeta<QuestionRailKind>[] = [
  { kind: 'short_text', label: 'Short text', icon: ShortTextIcon },
  { kind: 'long_text', label: 'Long text', icon: NotesIcon },
  { kind: 'multi_select', label: 'Multi-select', icon: CheckBoxIcon },
  { kind: 'single_choice', label: 'Single choice', icon: RadioButtonCheckedIcon },
  { kind: 'number', label: 'Number', icon: NumbersIcon },
  { kind: 'scale', label: 'Scale', icon: LeaderboardIcon },
];

export type PaletteItem = {
  kind: QuestionKind;
  label: string;
  sjType: string;
  defaults?: JsonObject;
};

/**
 * Full palette (ALL 11)
 */
export const QUESTION_PALETTE: PaletteItem[] = [
  // Multi-select
  {
    kind: 'multi_select',
    label: 'Multiple choice (multi select)',
    sjType: 'checkbox',
    defaults: { choices: ['Option 1', 'Option 2'] },
  },

  // Single choice
  {
    kind: 'single_choice',
    label: 'Multiple choice (single select)',
    sjType: 'radiogroup',
    defaults: { choices: ['Option 1', 'Option 2'] },
  },

  // Multiple short text
  {
    kind: 'multiple_short_text',
    label: 'Multiple short text',
    sjType: 'multipletext',
    defaults: {
      items: [
        { name: 'item1', title: 'Item 1' },
        { name: 'item2', title: 'Item 2' },
      ],
    },
  },

  // Short text
  {
    kind: 'short_text',
    label: 'Short text',
    sjType: 'text',
    defaults: { inputType: 'text', maxLength: 100 },
  },

  // Long text
  {
    kind: 'long_text',
    label: 'Long text',
    sjType: 'comment',
    defaults: { rows: 4 },
  },

  // Scale
  {
    kind: 'scale',
    label: 'Scale',
    sjType: 'rating',
    defaults: { rateMin: 1, rateMax: 5, rateStep: 1 },
  },

  // Number
  {
    kind: 'number',
    label: 'Number',
    sjType: 'text',
    defaults: { inputType: 'number' },
  },

  // Number range
  {
    kind: 'number_range',
    label: 'Number range',
    sjType: 'text',
    defaults: {
      inputType: 'number',
      validators: [{ type: 'numeric', minValue: 0, maxValue: 100 }],
    },
  },

  // Single date
  {
    kind: 'single_date',
    label: 'Single date',
    sjType: 'text',
    defaults: { inputType: 'date' },
  },

  // Date range
  {
    kind: 'date_range',
    label: 'Date range',
    sjType: 'multipletext',
    defaults: {
      items: [
        { name: 'startDate', title: 'Start date', inputType: 'date' },
        { name: 'endDate', title: 'End date', inputType: 'date' },
      ],
    },
  },

  // Ranking
  {
    kind: 'ranking',
    label: 'Ranking',
    sjType: 'ranking',
    defaults: { choices: ['Option 1', 'Option 2', 'Option 3'] },
  },
];

export function kindToPaletteItem(kind: QuestionKind) {
  const item = QUESTION_PALETTE.find((x) => x.kind === kind);
  if (!item) throw new Error(`Unknown QuestionKind: ${kind}`);
  return item;
}
