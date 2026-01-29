'use client';

import * as React from 'react';
import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { BRAND } from '@/src/styles/brand';
import {
  QUESTION_KINDS,
  type QuestionRailKind,
} from '@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/questionPalette';

type Props = {
  value: QuestionRailKind;
  onChange: (next: QuestionRailKind) => void;

  // NEW: optional controlled "expanded" state
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function QuestionSettingsBar({ value, onChange, open: openProp, onOpenChange }: Props) {
  const [openLocal, setOpenLocal] = React.useState(false);
  const [hoverOpen, setHoverOpen] = React.useState(false);

  const setOpen = (v: boolean) => {
    onOpenChange?.(v);
    if (!onOpenChange) setOpenLocal(v);
  };

  const pinnedOpen = openProp ?? openLocal;
  const expanded = pinnedOpen || hoverOpen;

  const selectedLabel = QUESTION_KINDS.find((k) => k.kind === value)?.label ?? 'Question type';

  return (
    <Box
      onMouseEnter={() => {
        if (!pinnedOpen) setHoverOpen(true);
      }}
      onMouseLeave={() => {
        if (!pinnedOpen) setHoverOpen(false);
      }}
      onFocusCapture={() => {
        if (!pinnedOpen) setHoverOpen(true);
      }}
      onBlurCapture={(e: React.FocusEvent) => {
        if (pinnedOpen) return;
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setHoverOpen(false);
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: 44,
        justifyContent: 'space-between',
        width: '100%',
        // px: 1,
        borderRadius: 2.5,
        // border: `1px solid ${BRAND.border}`,
        // bgcolor: open ? BRAND.surface : "rgba(21, 128, 61, 0.06)",
        overflow: 'hidden',
      }}
    >
      {/* LEFT GROUP: gear + icons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        {/* Gear */}
        <IconButton
          size="small"
          onClick={() => setOpen(!pinnedOpen)}
          aria-pressed={pinnedOpen}
          aria-label={
            pinnedOpen ? 'Collapse question type options' : 'Expand question type options'
          }
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            border: `1px solid ${BRAND.border}`,
            bgcolor: expanded ? BRAND.greenHover : 'rgba(21, 128, 61, 0.06)',
          }}
        >
          <SettingsOutlinedIcon
            sx={{
              fontSize: 18,
              color: 'rgba(0,0,0,0.65)',
              transition: 'transform 180ms ease',
              transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          />
        </IconButton>

        {/* Icons container (exists always, but animates open/closed) */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,

            // key: animate width instead of pushing layout weirdly
            maxWidth: expanded ? 420 : 0,
            opacity: expanded ? 1 : 0,
            transform: expanded ? 'translateX(0)' : 'translateX(-6px)',
            overflow: 'hidden',
            transition: 'max-width 180ms ease, opacity 140ms ease, transform 300ms ease',
            pointerEvents: expanded ? 'auto' : 'none',
          }}
        >
          {QUESTION_KINDS.map((k, idx) => {
            const Icon = k.icon;
            const active = k.kind === value;

            return (
              <Tooltip key={k.kind} title={k.label} placement="bottom" arrow>
                <IconButton
                  onClick={() => onChange(k.kind)}
                  size="small"
                  aria-label={k.label}
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    border: `1px solid ${BRAND.border}`,
                    color: active ? BRAND.green : 'rgba(0,0,0,0.65)',
                    bgcolor: active ? BRAND.greenSoft : 'transparent',
                    '&:hover': { bgcolor: BRAND.greenHover },

                    // sequential pop
                    opacity: expanded ? 1 : 0,
                    transform: expanded ? 'scale(1)' : 'scale(0.9)',
                    transition: 'opacity 380ms ease, transform 380ms ease',
                    transitionDelay: expanded ? `${idx * 50}ms` : '0ms',
                  }}
                >
                  <Icon fontSize="small" />
                </IconButton>
              </Tooltip>
            );
          })}
        </Box>
      </Box>

      {/* RIGHT: selected label, always at the end */}
      <Box
        display="flex"
        sx={{
          gap: 0.5,
        }}
      >
        <Typography
          sx={{
            ml: 'auto',
            my: 'auto',
            fontSize: 12,
            fontWeight: 700,
            color: BRAND.muted,
            whiteSpace: 'nowrap',
            pl: 1,
          }}
        >
          Selected Question Type:
        </Typography>
        <Chip
          label={selectedLabel}
          sx={{
            bgcolor: BRAND.greenSoft,
            fontWeight: 400,
          }}
        />
      </Box>
    </Box>
  );
}
