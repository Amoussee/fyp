"use client";

import * as React from "react";
import { Box, TextField, Typography } from "@mui/material";
import type { QuestionTypeProps } from "../../types/QuestionTypeComponent";

const fieldSx = { "& .MuiOutlinedInput-root": { borderRadius: 2.5 } };

const MAX_LIMIT = 50;
const MAX_POINTS = 11;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

function buildScaleValues(min: number, max: number, step: number) {
  const values: number[] = [];
  for (let v = min; v <= max; v += step) values.push(v);
  return values;
}

function sanitizeScale(next: { rateMin?: number; rateMax?: number; rateStep?: number }) {
  let rateMin = typeof next.rateMin === "number" ? Math.trunc(next.rateMin) : 1;
  let rateMax = typeof next.rateMax === "number" ? Math.trunc(next.rateMax) : 5;
  let rateStep = typeof next.rateStep === "number" ? Math.trunc(next.rateStep) : 1;

  rateMax = clamp(rateMax, 1, MAX_LIMIT);
  rateMin = clamp(rateMin, 0, rateMax);
  rateStep = Math.max(1, rateStep);

  if (rateMin >= rateMax) rateMin = Math.max(0, rateMax - 1);

  const range = Math.max(1, rateMax - rateMin);
  rateStep = Math.min(rateStep, range);

  if (range % rateStep !== 0) {
    for (let s = rateStep; s >= 1; s--) {
      if (range % s === 0) {
        rateStep = s;
        break;
      }
    }
  }

  const currentValues = buildScaleValues(rateMin, rateMax, rateStep);
  if (currentValues.length > MAX_POINTS) {
    for (let s = rateStep + 1; s <= range; s++) {
      if (range % s === 0) {
        const vals = buildScaleValues(rateMin, rateMax, s);
        if (vals.length <= MAX_POINTS) {
          rateStep = s;
          break;
        }
      }
    }
  }

  return { rateMin, rateMax, rateStep };
}

function isIntString(s: string) {
  return s === "" || /^-?\d+$/.test(s); // allow empty while typing
}

function parseIntOrUndef(s: string) {
  if (s.trim() === "") return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? Math.trunc(n) : undefined;
}

export function ScaleEdit({ element, onPatch }: QuestionTypeProps) {
  // initialize defaults in data once
  React.useEffect(() => {
    const patch: any = {};
    if (element?.rateMin == null) patch.rateMin = 1;
    if (element?.rateMax == null) patch.rateMax = 5;
    if (element?.rateStep == null) patch.rateStep = 1;
    if (Object.keys(patch).length) onPatch(patch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rateMin = typeof element?.rateMin === "number" ? element.rateMin : 1;
  const rateMax = typeof element?.rateMax === "number" ? element.rateMax : 5;
  const rateStep = typeof element?.rateStep === "number" ? element.rateStep : 1;

  // local drafts so user can clear / type naturally
  const [draftMin, setDraftMin] = React.useState(String(rateMin));
  const [draftMax, setDraftMax] = React.useState(String(rateMax));
  const [draftStep, setDraftStep] = React.useState(String(rateStep));

  // keep drafts in sync when element changes externally (e.g. switching question, undo, etc.)
  React.useEffect(() => setDraftMin(String(rateMin)), [rateMin]);
  React.useEffect(() => setDraftMax(String(rateMax)), [rateMax]);
  React.useEffect(() => setDraftStep(String(rateStep)), [rateStep]);

  const commit = (next: { min?: string; max?: string; step?: string }) => {
    const nextMin = parseIntOrUndef(next.min ?? draftMin);
    const nextMax = parseIntOrUndef(next.max ?? draftMax);
    const nextStep = parseIntOrUndef(next.step ?? draftStep);

    const sanitized = sanitizeScale({
      rateMin: nextMin ?? rateMin,
      rateMax: nextMax ?? rateMax,
      rateStep: nextStep ?? rateStep,
    });

    onPatch(sanitized);

    // after commit, reflect sanitized values in UI
    setDraftMin(String(sanitized.rateMin));
    setDraftMax(String(sanitized.rateMax));
    setDraftStep(String(sanitized.rateStep));
  };

  const valuesPreview = buildScaleValues(rateMin, rateMax, Math.max(1, rateStep));
  const tooManyPoints = valuesPreview.length > MAX_POINTS;

  return (
    <Box>
      <Typography sx={{ color: "GrayText", fontSize: 14, fontWeight: 400, mb: 1, mx: 1 }}>
        Scale settings
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 2 }}>
        <TextField
          label="Min"
          value={draftMin}
          onChange={(e) => {
            const v = e.target.value;
            if (isIntString(v)) setDraftMin(v); // allow empty + integers only
          }}
          onBlur={() => commit({ min: draftMin })}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          sx={fieldSx}
        />

        <TextField
          label="Max"
          value={draftMax}
          onChange={(e) => {
            const v = e.target.value;
            if (isIntString(v)) setDraftMax(v);
          }}
          onBlur={() => commit({ max: draftMax })}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          sx={fieldSx}
        />

        <TextField
          label="Step"
          value={draftStep}
          onChange={(e) => {
            const v = e.target.value;
            if (isIntString(v)) setDraftStep(v);
          }}
          onBlur={() => commit({ step: draftStep })}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          sx={fieldSx}
        />
      </Box>

      <Box sx={{ mt: 2, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
        <TextField
          label="Min Label"
          value={element?.minRateDescription ?? ""}
          onChange={(e) => onPatch({ minRateDescription: e.target.value })}
          sx={fieldSx}
        />
        <TextField
          label="Max Label"
          value={element?.maxRateDescription ?? ""}
          onChange={(e) => onPatch({ maxRateDescription: e.target.value })}
          sx={fieldSx}
        />
      </Box>

      {tooManyPoints ? (
        <Typography sx={{ mt: 1, color: "warning.main", fontSize: 13 }}>
          Tip: Too many scale points. Consider increasing step or narrowing the range (recommended ≤ {MAX_POINTS}).
        </Typography>
      ) : null}
    </Box>
  );
}
