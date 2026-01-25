"use client";

import * as React from "react";
import { MenuItem, Select } from "@mui/material";
import { BRAND } from "@/src/styles/brand";
import { QUESTION_PALETTE, type QuestionKind } from "@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/questionPalette";

type Props = {
  value: QuestionKind;
  onChange: (next: QuestionKind) => void;
  minWidth?: number;
};

export function QuestionTypeSelect({ value, onChange, minWidth = 260 }: Props) {
  return (
    <Select
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value as QuestionKind)}
      sx={{
        borderRadius: 999,
        bgcolor: "rgba(21, 128, 61, 0.10)",
        "& fieldset": { borderColor: BRAND.border },
        minWidth,
      }}
    >
      {QUESTION_PALETTE.map((t) => (
        <MenuItem key={t.kind} value={t.kind}>
          {t.label}
        </MenuItem>
      ))}
    </Select>
  );
}
