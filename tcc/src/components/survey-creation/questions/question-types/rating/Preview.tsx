'use client';

import * as React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import type { QuestionTypeProps } from '../../types/QuestionTypeComponent';
import { BRAND } from '@/src/styles/brand';

function buildScaleValues(min: number, max: number, step: number) {
  const safeStep = step > 0 ? step : 1;
  const values: number[] = [];
  for (let v = min; v <= max; v += safeStep) values.push(v);
  return values;
}

export function ScalePreview({ element }: QuestionTypeProps) {
  const min = Number(element?.rateMin ?? 1);
  const max = Number(element?.rateMax ?? 5);
  const step = Number(element?.rateStep ?? 1);
  const values = buildScaleValues(min, max, step);

  const minLabel = String(element?.minRateDescription ?? '').trim();
  const maxLabel = String(element?.maxRateDescription ?? '').trim();

  // purely for preview interaction (doesn't patch element)
  const [selected, setSelected] = React.useState<number | null>(null);

  const onSelect = (v: number) => setSelected(v);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (values.length === 0) return;

    const idx = selected == null ? 0 : Math.max(0, values.indexOf(selected));
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = values[Math.min(values.length - 1, idx + 1)];
      setSelected(next);
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = values[Math.max(0, idx - 1)];
      setSelected(prev);
    }
    if (e.key === 'Home') {
      e.preventDefault();
      setSelected(values[0]);
    }
    if (e.key === 'End') {
      e.preventDefault();
      setSelected(values[values.length - 1]);
    }
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Box sx={{ borderRadius: 2.5, px: 2, py: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* left label */}
          <Typography sx={{ fontSize: 16, color: 'text.secondary', whiteSpace: 'nowrap' }}>
            {minLabel || min}
          </Typography>

          {/* track + dots */}
          <Box
            role="radiogroup"
            aria-label="Scale"
            tabIndex={0}
            onKeyDown={onKeyDown}
            sx={{
              position: 'relative',
              flex: 1,
              minWidth: 0,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              outline: 'none',
              borderRadius: 2,
              '&:focus-visible': {
                boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.25)', // optional focus ring
              },
            }}
          >
            {/* connecting line */}
            <Box
              aria-hidden
              sx={{
                position: 'absolute',
                left: 6,
                right: 6,
                top: '50%',
                height: 3,
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0,0,0,0.18)',
                borderRadius: 999,
              }}
            />

            {/* dots laid out evenly */}
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {values.map((v) => {
                const isSelected = selected === v;
                return (
                  <Box
                    key={v}
                    component="button"
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => onSelect(v)}
                    sx={{
                      width: 18,
                      height: 18,
                      borderRadius: '999px',
                      border: '3px solid',
                      borderColor: isSelected ? BRAND.green : BRAND.border,
                      bgcolor: isSelected ? BRAND.green : 'white',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'grid',
                      placeItems: 'center',
                      transition:
                        'transform 120ms ease, background-color 120ms ease, border-color 120ms ease',
                      transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                      boxShadow: isSelected ? '0 4px 10px rgba(0,0,0,0.10)' : 'none',
                      '&:hover': {
                        transform: isSelected ? 'scale(1.12)' : 'scale(1.06)',
                      },
                      '&:focus-visible': {
                        outline: 'none',
                        boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.25)',
                      },
                    }}
                  >
                    {/* inner dot (optional) */}
                    <Box
                      aria-hidden
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '999px',
                        bgcolor: isSelected ? 'white' : 'transparent',
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* right label */}
          <Typography sx={{ fontSize: 16, color: 'text.secondary', whiteSpace: 'nowrap' }}>
            {maxLabel || max}
          </Typography>
        </Box>

        {/* optional: show current selection */}
        {selected != null ? (
          <Chip
            sx={{
              mt: 2,
              fontSize: 14,
              color: 'text.secondary',
              border: `1px solid`,
              bgcolor: 'white',
            }}
            label={`Selected: ${selected}`}
          />
        ) : null}
      </Box>
    </Box>
  );
}
