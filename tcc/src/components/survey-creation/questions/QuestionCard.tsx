"use client";

import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Divider,
  IconButton,
  Switch,
  TextField,
  Typography,
  FormControlLabel,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { BRAND } from "@/src/styles/brand";
import { QuestionTypeSelect } from "@/src/components/survey-creation/questions/QuestionTypeSelect";
import { QuestionTypeEditor } from "@/src/components/survey-creation/questions/QuestionTypeEditor";
import type { QuestionKind } from "@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/questionPalette";

type Props = {
  index: number;                 // for "Question 1"
  pageName: string;              // surveyJson.pages[].name (active section)
  element: any;                  // SurveyJS element JSON (question)
  onPatch: (elementName: string, patch: Partial<any>) => void;
  onRemove: (elementName: string) => void;
  onChangeKind: (elementName: string, nextKind: QuestionKind) => void;
};

export function QuestionCard({ index, pageName, element, onPatch, onRemove, onChangeKind }: Props) {
  const elementName = element?.name;

  if (!elementName) {
    return null;
  }

  return (
    <Card elevation={0} sx={{ border: `1px solid ${BRAND.border}`, borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <TextField
            label={`Question ${index + 1}`}
            placeholder="Enter survey question"
            value={element.title ?? ""}
            onChange={(e) => onPatch(elementName, { title: e.target.value })}
            fullWidth
            sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
          />

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <QuestionTypeSelect
              value={(element.kind ?? "short_text") as any}
              onChange={(nextKind) => onChangeKind(element.name, nextKind)}
            />

            <IconButton onClick={() => onRemove(elementName)}>
              <DeleteOutlineIcon />
            </IconButton>
          </Box>
        </Box>
        
        <TextField
          label="Description"
          value={element.description ?? ""}
          onChange={(e) => onPatch(elementName, { description: e.target.value })}
          fullWidth
          multiline
          minRows={3}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
        />

        <Box sx={{ mt: 2 }}>
          <QuestionTypeEditor element={element} onPatch={(patch) => onPatch(elementName, patch)} />
        </Box>

        <Divider sx={{ my: 2 }} />
        <Box sx={{ mt: 1.5 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!element.isRequired}
                onChange={(e) => onPatch(elementName, { isRequired: e.target.checked })}
                sx={{
                  color: BRAND.border,
                  "&.Mui-checked": { color: BRAND.green },
                }}
              />
            }
            label="Required Question"
          />
        </Box>
      </CardContent>
    </Card>
  );
}
