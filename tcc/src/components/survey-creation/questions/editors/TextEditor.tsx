"use client";

import * as React from "react";
import { Box, TextField, Typography } from "@mui/material";

type Props = {
  element: any; // SurveyJS element JSON
  onPatch: (patch: Partial<any>) => void;
};

function getNumericValidator(element: any) {
  const validators: any[] = Array.isArray(element?.validators) ? element.validators : [];
  const v = validators.find((x) => x?.type === "numeric");
  return v ?? null;
}

function upsertNumericValidator(element: any, patch: { minValue?: number; maxValue?: number }) {
  const validators: any[] = Array.isArray(element?.validators) ? [...element.validators] : [];
  const idx = validators.findIndex((x) => x?.type === "numeric");

  const current = idx >= 0 ? validators[idx] : { type: "numeric" };
  const next = { ...current, ...patch };

  // Remove empty validator (optional)
  const hasMin = typeof next.minValue === "number";
  const hasMax = typeof next.maxValue === "number";
  if (!hasMin && !hasMax) {
    if (idx >= 0) validators.splice(idx, 1);
    return { validators };
  }

  if (idx >= 0) validators[idx] = next;
  else validators.push(next);

  return { validators };
}

const toNumOrUndef = (v: string) => (v === "" ? undefined : Number(v));

export function TextEditor({ element, onPatch }: Props) {
  const kind = String(element?.kind ?? "short_text");

  // enforce “base” settings for each kind (without being too aggressive)
  React.useEffect(() => {
    if (kind === "short_text") {
      if (element.type !== "text" || element.inputType !== "text") {
        onPatch({ type: "text", inputType: "text" });
      }
    }

    if (kind === "single_number") {
      if (element.type !== "text" || element.inputType !== "number") {
        onPatch({ type: "text", inputType: "number" });
      }
    }

    if (kind === "number_range") {
      if (element.type !== "text" || element.inputType !== "number") {
        onPatch({ type: "text", inputType: "number" });
      }
    }

    if (kind === "single_date") {
      if (element.type !== "text" || element.inputType !== "date") {
        onPatch({ type: "text", inputType: "date" });
      }
    }

    if (kind === "long_text") {
      if (element.type !== "comment") {
        onPatch({ type: "comment", rows: element.rows ?? 4 });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  // --- UI per kind ---
  if (kind === "long_text") {
    return (
      <Box>
        <Typography sx={{ fontWeight: 700, mb: 1 }}>Long text settings</Typography>

        <TextField
          label="Rows"
          type="number"
          value={element.rows ?? 4}
          onChange={(e) => onPatch({ rows: Number(e.target.value || 4) })}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 }, width: 200 }}
        />

        <Typography sx={{ mt: 1, color: "text.secondary", fontSize: 13 }}>
          Uses SurveyJS <code>comment</code> question.
        </Typography>
      </Box>
    );
  }

  if (kind === "number_range") {
    const numeric = getNumericValidator(element);
    const minValue = numeric?.minValue ?? "";
    const maxValue = numeric?.maxValue ?? "";

    return (
      <Box>
        <Typography sx={{ fontWeight: 700, mb: 1 }}>Number range</Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
          <TextField
            label="Min"
            type="number"
            value={minValue}
            onChange={(e) => {
              const min = toNumOrUndef(e.target.value);
              onPatch(upsertNumericValidator(element, { minValue: min }));
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
          />
          <TextField
            label="Max"
            type="number"
            value={maxValue}
            onChange={(e) => {
              const max = toNumOrUndef(e.target.value);
              onPatch(upsertNumericValidator(element, { maxValue: max }));
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
          />
        </Box>

        <Typography sx={{ mt: 1, color: "text.secondary", fontSize: 13 }}>
          Stored as SurveyJS numeric validator (minValue / maxValue).
        </Typography>
      </Box>
    );
  }

  if (kind === "single_number") {
    return (
      <Box>
        <Typography sx={{ fontWeight: 700, mb: 1 }}>Number settings</Typography>
        <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
          Uses SurveyJS <code>text</code> with <code>inputType: "number"</code>.
        </Typography>
      </Box>
    );
  }

  if (kind === "single_date") {
    return (
      <Box>
        <Typography sx={{ fontWeight: 700, mb: 1 }}>Date settings</Typography>
        <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
          Uses SurveyJS <code>text</code> with <code>inputType: "date"</code>.
        </Typography>
      </Box>
    );
  }

  // short_text default
  return (
    <Box>
      <Typography sx={{ fontWeight: 700, mb: 1 }}>Short text settings</Typography>

      <TextField
        label="Max length"
        type="number"
        value={element.maxLength ?? ""}
        onChange={(e) => {
          const v = e.target.value;
          onPatch({ maxLength: v === "" ? undefined : Number(v) });
        }}
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 }, width: 220 }}
      />

      <Typography sx={{ mt: 1, color: "text.secondary", fontSize: 13 }}>
        Uses SurveyJS <code>text</code> question.
      </Typography>
    </Box>
  );
}
