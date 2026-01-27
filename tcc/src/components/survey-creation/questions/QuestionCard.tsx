"use client";

import * as React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Divider,
  IconButton,
  Switch,
  TextField,
  Tooltip,
  Typography,
  FormControlLabel,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { BRAND } from "@/src/styles/brand";
import { QuestionTypeEditor } from "@/src/components/survey-creation/questions/QuestionTypeEditor";
import { QuestionSettingsBar } from "@/src/components/survey-creation/questions/QuestionSettingsBar";
import type {
  QuestionKind,
  QuestionRailKind,
} from "@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/questionPalette";

type Props = {
  index: number;
  pageName: string;
  element: any;
  onPatch: (elementName: string, patch: Partial<any>) => void;
  onRemove: (elementName: string) => void;
  onChangeKind: (elementName: string, nextKind: QuestionKind) => void;
};

const isRailKind = (k: any): k is QuestionRailKind =>
  k === "short_text" ||
  k === "long_text" ||
  k === "multi_select" ||
  k === "single_choice" ||
  k === "number" ||
  k === "scale";

function QuestionPreviewCard({ element, index }: { element: any; index: number }) {
  const title = String(element?.title ?? "").trim();
  const desc = String(element?.description ?? "").trim();

  return (
    <Box
      sx={{
        mt: 1,
        p: 2,
        borderRadius: 2.5,
        border: `1px solid ${BRAND.border}`,
        bgcolor: "rgba(0,0,0,0.02)",
      }}
    >
      <Typography sx={{ fontWeight: 800, mb: 0.5 }}>
        {title || `Question ${index + 1}`}
      </Typography>

      {desc ? (
        <Typography sx={{ color: "text.secondary", fontSize: 13, mb: 1 }}>
          {desc}
        </Typography>
      ) : null}

      <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
        Preview placeholder (next: render SurveyJS question here)
      </Typography>
    </Box>
  );
}

export function QuestionCard({ index, pageName, element, onPatch, onRemove, onChangeKind }: Props) {
  const elementName = element?.name;
  const [mode, setMode] = React.useState<"edit" | "preview">("edit");
  const [railOpen, setRailOpen] = React.useState(false);

  const ModeToggle = (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 700,
          color: mode === "edit" ? "text.primary" : "text.secondary",
        }}
      >
        Edit
      </Typography>

      <Switch
        checked={mode === "preview"}
        onChange={(e) => setMode(e.target.checked ? "preview" : "edit")}
        inputProps={{ "aria-label": "Toggle preview mode" }}
        sx={{
          "& .MuiSwitch-switchBase.Mui-checked": { color: BRAND.green },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            backgroundColor: BRAND.green,
          },
        }}
      />

      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 700,
          color: mode === "preview" ? "text.primary" : "text.secondary",
        }}
      >
        Preview
      </Typography>
    </Box>
  );

  if (!elementName) return null;

  const kind: QuestionKind = (element.kind ?? "short_text") as QuestionKind;
  const railValue: QuestionRailKind = isRailKind(kind) ? kind : "short_text";

  return (
    <Card elevation={0} sx={{ border: `1px solid ${BRAND.border}`, borderRadius: 3 }}>
      {/* pr adds room so the rail doesn't overlap content */}
      <CardContent sx={{
          p: 3,
        }}>
        <Box
          sx={{
            position: "relative",
            height: 48,
            mb: 1,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
            }}
          >
            <QuestionSettingsBar
              value={railValue}
              onChange={(nextRailKind) => onChangeKind(elementName, nextRailKind)}
              open={railOpen}
              onOpenChange={setRailOpen}
            />
          </Box>
          <Box
            sx={{
              position: "absolute",
              right: 0,
              top: 0,
              height: 44,
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            {ModeToggle}

            <Tooltip title="Delete question" placement="left" arrow>
              <IconButton
                onClick={() => onRemove(elementName)}
                aria-label="Delete question"
                sx={{
                  borderRadius: 2.5,
                  border: `1px solid rgba(211, 47, 47, 0.2)`,
                  bgcolor: "rgba(211, 47, 47, 0.08)",
                  color: "error.main",
                  "&:hover": { bgcolor: "rgba(211, 47, 47, 0.12)" },
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        {mode === "edit" ? (
        <Box>
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 , mt: 2}}>
            <Box sx={{ flex: 1 }}>
              <TextField
                label={`Question ${index + 1}`}
                placeholder="Enter your question"
                value={element.title ?? ""}
                onChange={(e) => onPatch(elementName, { title: e.target.value })}
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5, fontWeight: 600, } }}
              />
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Description"
              value={element.description ?? ""}
              onChange={(e) => onPatch(elementName, { description: e.target.value })}
              fullWidth
              multiline
              minRows={1}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <QuestionTypeEditor element={element} onPatch={(patch) => onPatch(elementName, patch)} />

                <Divider sx={{ my: 2 }} />

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
                  label="Required question"
                />
          </Box>
        </Box>
        ) : (
          <QuestionPreviewCard element={element} index={index} />
        )}
      </CardContent>
    </Card>
  );
}
