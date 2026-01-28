"use client";

import { Box, Chip, Typography } from "@mui/material";
import type { QuestionTypeProps } from "../../types/QuestionTypeComponent";

export function ChoicesPreview({ element }: QuestionTypeProps) {
  const choices: any[] = Array.isArray(element?.choices) ? element.choices : [];

  return (
    <Box sx={{ mt: 1 }}>
      <Typography sx={{ fontWeight: 700, mb: 1 }}>Preview</Typography>

      {choices.length === 0 ? (
        <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
          No choices yet.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {choices.map((c, idx) => (
            <Chip
              key={idx}
              label={typeof c === "string" ? c : String(c?.text ?? c?.value ?? "")}
              variant="outlined"
              size="small"
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
