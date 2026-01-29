'use client';

import * as React from 'react';
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Divider,
  IconButton,
  Switch,
  Tooltip,
  Typography,
  FormControlLabel,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { BRAND } from '@/src/styles/brand';
import { QuestionTypeRenderer } from '@/src/components/survey-creation/questions/QuestionTypeRenderer';
import { QuestionHeader } from '@/src/components/survey-creation/questions/QuestionHeader';
import { QuestionSettingsBar } from '@/src/components/survey-creation/questions/QuestionSettingsBar';
import type {
  QuestionKind,
  QuestionRailKind,
} from '@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/questionPalette';
import type { SurveyElement } from '@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/surveyJson';

type Props = {
  index: number;
  pageName: string;
  element: SurveyElement;
  onPatch: (elementName: string, patch: Partial<SurveyElement>) => void;
  onRemove: (elementName: string) => void;
  onChangeKind: (elementName: string, nextKind: QuestionKind) => void;
};

const isRailKind = (k: string): k is QuestionRailKind =>
  k === 'short_text' ||
  k === 'long_text' ||
  k === 'multi_select' ||
  k === 'single_choice' ||
  k === 'number' ||
  k === 'scale';

export function QuestionCard({ index, element, onPatch, onRemove, onChangeKind }: Props) {
  const elementName = element?.name;
  const [mode, setMode] = React.useState<'edit' | 'preview'>('edit');
  const [railOpen, setRailOpen] = React.useState(false);

  if (!elementName) return null;

  const kind: QuestionKind = (element.kind ?? 'short_text') as QuestionKind;
  const railValue: QuestionRailKind = isRailKind(kind) ? kind : 'short_text';
  const isPreview = mode === 'preview';

  return (
    <Card elevation={0} sx={{ border: `1px solid ${BRAND.border}`, borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header row */}
        <Box sx={{ position: 'relative', height: 48, mb: 1 }}>
          <Box sx={{ position: 'absolute', left: 0, top: 0 }}>
            <QuestionSettingsBar
              value={railValue}
              onChange={(nextRailKind) => onChangeKind(elementName, nextRailKind)}
              open={railOpen}
              onOpenChange={setRailOpen}
            />
          </Box>

          <Box
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            {/* Mode toggle */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: !isPreview ? 'text.primary' : 'text.secondary',
                }}
              >
                Edit
              </Typography>

              <Switch
                checked={isPreview}
                onChange={(e) => setMode(e.target.checked ? 'preview' : 'edit')}
                inputProps={{ 'aria-label': 'Toggle preview mode' }}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: BRAND.green },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: BRAND.green,
                  },
                }}
              />

              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: isPreview ? 'text.primary' : 'text.secondary',
                }}
              >
                Preview
              </Typography>
            </Box>

            {/* Delete */}
            <Tooltip title="Delete question" placement="left" arrow>
              <IconButton
                onClick={() => onRemove(elementName)}
                aria-label="Delete question"
                sx={{
                  borderRadius: 2.5,
                  border: `1px solid rgba(211, 47, 47, 0.2)`,
                  bgcolor: 'rgba(211, 47, 47, 0.08)',
                  color: 'error.main',
                  '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.12)' },
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Common fields (option A: disable in preview) */}
        {mode === 'preview' ? (
          <QuestionHeader
            mode="preview"
            index={index}
            title={element.title ?? ''}
            description={element.description ?? ''}
            isRequired={!!element.isRequired}
          />
        ) : (
          <QuestionHeader
            mode="edit"
            index={index}
            title={element.title ?? ''}
            description={element.description ?? ''}
            isRequired={!!element.isRequired}
            onTitleChange={(v) => onPatch(elementName, { title: v })}
            onDescriptionChange={(v) => onPatch(elementName, { description: v })}
          />
        )}

        {/* Type-specific UI (handles BOTH edit + preview now) */}
        <Box sx={{ mt: 2 }}>
          <QuestionTypeRenderer
            kind={kind}
            mode={mode}
            element={element}
            onPatch={(patch) => onPatch(elementName, patch)}
          />

          {!isPreview && <Divider sx={{ my: 2 }} />}

          {!isPreview && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!element.isRequired}
                  onChange={(e) => onPatch(elementName, { isRequired: e.target.checked })}
                  sx={{ color: BRAND.border, '&.Mui-checked': { color: BRAND.green } }}
                />
              }
              label="Required question"
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
