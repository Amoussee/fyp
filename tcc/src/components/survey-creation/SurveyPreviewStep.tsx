'use client';

import * as React from 'react';
import { Box, Card, CardContent, Chip, Divider, Typography } from '@mui/material';
import type { SurveyCreationForm } from '@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/types';
import { BRAND } from '@/src/styles/brand';
import type {
  SurveyPage,
  SurveyElement,
} from '@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/surveyJson';

type Props = {
  form: SurveyCreationForm;
};

function PreviewField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'grid', gap: 0.75 }}>
      <Typography sx={{ fontSize: 12, fontWeight: 800, color: BRAND.muted }}>{label}</Typography>
      <Box>{children}</Box>
    </Box>
  );
}

function PreviewText({ text }: { text?: string }) {
  const value = (text ?? '').trim();
  return (
    <Typography sx={{ fontSize: 14, color: value ? 'text.primary' : 'text.secondary' }}>
      {value || '—'}
    </Typography>
  );
}

function PreviewNumber({ value }: { value: number | '' }) {
  return <Typography sx={{ fontSize: 14 }}>{value === '' ? '—' : value}</Typography>;
}

function PreviewDetailsCard({ form }: Props) {
  return (
    <Card elevation={0} sx={{ border: `1px solid ${BRAND.border}`, borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography sx={{ fontWeight: 800, fontSize: 16, mb: 2 }}>Survey details</Typography>

        <Box sx={{ display: 'grid', gap: 2 }}>
          <PreviewField label="Title">
            <Typography sx={{ fontSize: 22, fontWeight: 800 }}>
              {form.title?.trim() || 'Untitled survey'}
            </Typography>
          </PreviewField>

          <PreviewField label="Type">
            <Chip
              label={form.isDirected ? 'Directed' : 'Open'}
              size="small"
              sx={{
                bgcolor: form.isDirected ? BRAND.greenSoft : 'rgba(0,0,0,0.06)',
                border: `1px solid ${BRAND.border}`,
                fontWeight: 700,
              }}
            />
          </PreviewField>

          <PreviewField label="Recipients">
            {form.isDirected ? (
              form.recipients?.length ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {form.recipients.map((r) => (
                    <Chip
                      key={r.id}
                      label={r.label}
                      size="small"
                      sx={{ border: `1px solid ${BRAND.border}` }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
                  No recipients selected.
                </Typography>
              )
            ) : (
              <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
                Not applicable for Open surveys.
              </Typography>
            )}
          </PreviewField>

          <PreviewField label="Minimum responses">
            <PreviewNumber value={form.minResponse} />
          </PreviewField>

          <PreviewField label="Description">
            <PreviewText text={form.description} />
          </PreviewField>
        </Box>
      </CardContent>
    </Card>
  );
}

function PreviewSectionCard({ section, index }: { section: SurveyPage; index: number }) {
  const elements: SurveyElement[] = section.elements ?? [];

  return (
    <Card elevation={0} sx={{ border: `1px solid ${BRAND.border}`, borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 2 }}
        >
          <Typography sx={{ fontWeight: 800, fontSize: 16 }}>
            Section {index + 1}: {section.title?.trim() || 'Untitled'}
          </Typography>
          <Typography sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 700 }}>
            {elements.length} question{elements.length === 1 ? '' : 's'}
          </Typography>
        </Box>

        {section.description?.trim() ? (
          <Typography sx={{ mt: 1, fontSize: 14, color: 'text.secondary' }}>
            {section.description}
          </Typography>
        ) : null}

        <Divider sx={{ my: 2, borderColor: BRAND.border }} />

        <Box sx={{ display: 'grid', gap: 1.5 }}>
          {elements.length === 0 ? (
            <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
              No questions in this section.
            </Typography>
          ) : (
            elements.map((el, qIdx) => {
              // choices is JsonValue in your type; safely narrow
              const rawChoices = (el as Record<string, unknown>).choices;
              const choices = Array.isArray(rawChoices) ? rawChoices : [];

              return (
                <Box
                  key={el.name ?? `${index}-${qIdx}`}
                  sx={{
                    border: `1px solid ${BRAND.border}`,
                    borderRadius: 2.5,
                    p: 2,
                    bgcolor: 'rgba(0,0,0,0.015)',
                  }}
                >
                  <Typography sx={{ fontWeight: 800, fontSize: 14 }}>
                    Q{qIdx + 1}. {el.title?.trim() || 'Untitled question'}
                  </Typography>

                  {el.description?.trim() ? (
                    <Typography sx={{ mt: 0.5, fontSize: 13, color: 'text.secondary' }}>
                      {el.description}
                    </Typography>
                  ) : null}

                  <Box sx={{ mt: 1 }}>
                    <Chip
                      size="small"
                      label={el.type ?? 'question'}
                      sx={{ border: `1px solid ${BRAND.border}`, fontWeight: 700 }}
                    />
                  </Box>

                  {choices.length > 0 ? (
                    <Box sx={{ mt: 1, display: 'grid', gap: 0.5 }}>
                      {choices.slice(0, 5).map((c, i) => (
                        <Typography key={i} sx={{ fontSize: 13, color: 'text.secondary' }}>
                          •{' '}
                          {typeof c === 'string'
                            ? c
                            : typeof c === 'object' && c !== null
                              ? String(
                                  (c as { text?: unknown; value?: unknown }).text ??
                                    (c as { value?: unknown }).value ??
                                    'Option',
                                )
                              : String(c ?? 'Option')}
                        </Typography>
                      ))}
                      {choices.length > 5 ? (
                        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                          +{choices.length - 5} more…
                        </Typography>
                      ) : null}
                    </Box>
                  ) : null}
                </Box>
              );
            })
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export function SurveyPreviewStep({ form }: Props) {
  const pages: SurveyPage[] = form.surveyJson?.pages ?? [];

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <PreviewDetailsCard form={form} />

      <Typography sx={{ fontWeight: 800, fontSize: 16, mt: 1 }}>Survey questions</Typography>

      {pages.length === 0 ? (
        <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>No sections yet.</Typography>
      ) : (
        <Box sx={{ display: 'grid', gap: 2 }}>
          {pages.map((p, i) => (
            <PreviewSectionCard key={p.name ?? String(i)} section={p} index={i} />
          ))}
        </Box>
      )}
    </Box>
  );
}
