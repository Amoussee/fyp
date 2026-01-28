"use client";

import * as React from "react";
import {
  Box,
  Button,
  ButtonBase,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { QuestionCard } from "@/src/components/survey-creation/questions/QuestionCard";
import { removePage } from "@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/surveyJson";
import type { SurveyCreationForm } from "@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/types";
import { BRAND } from "@/src/styles/brand";

import {
  addPage,
  updatePage,
  addElementByKind,
  updateElement,
  removeElement,
  changeElementKind,
} from "@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/surveyJson";

import { QUESTION_PALETTE, type QuestionKind } from "@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/questionPalette";

type Props = {
  form: SurveyCreationForm;
  setForm: React.Dispatch<React.SetStateAction<SurveyCreationForm>>;
};

function ensureSurveyJson(form: SurveyCreationForm) {
  // safety in case older drafts didn't have surveyJson yet
  if (form.surveyJson?.pages?.length) return form.surveyJson;
  return {
    pages: [
      {
        name: crypto.randomUUID(),
        title: "Section 1",
        description: "",
        elements: [],
      },
    ],
  };
}

export function SurveyQuestionsStep({ form, setForm }: Props) {
  const surveyJson = ensureSurveyJson(form);
  const pages = surveyJson.pages ?? [];

  const [activePageName, setActivePageName] = React.useState<string>(() => pages[0]?.name ?? "");

  const [deleteSectionName, setDeleteSectionName] = React.useState<string | null>(null);

  const sectionToDelete = React.useMemo(
    () => pages.find((p) => p.name === deleteSectionName) ?? null,
    [pages, deleteSectionName]
  );

  const onConfirmDeleteSection = () => {
    if (!deleteSectionName) return;

    setForm((prev) => {
      const sj = ensureSurveyJson(prev);
      const nextSj = removePage(sj, deleteSectionName);
      return { ...prev, surveyJson: nextSj };
    });

    // pick a safe next active page
    const remaining = pages.filter((p) => p.name !== deleteSectionName);
    const nextActive = remaining[0]?.name ?? "";
    setActivePageName(nextActive);

    setDeleteSectionName(null);
  };


  // keep activePageName valid
  React.useEffect(() => {
    if (!pages.length) return;
    if (!pages.some((p) => p.name === activePageName)) {
      setActivePageName(pages[0].name);
    }
  }, [pages, activePageName]);

  const activePage = pages.find((p) => p.name === activePageName);
  const elements = activePage?.elements ?? [];

  const onAddSection = () => {
    setForm((prev) => {
      const sj = ensureSurveyJson(prev);
      const nextSj = addPage(sj, `Section ${(sj.pages?.length ?? 0) + 1}`);
      return { ...prev, surveyJson: nextSj };
    });

    // after state updates, set active to last page
    queueMicrotask(() => {
      setForm((prev) => {
        const sj = ensureSurveyJson(prev);
        const last = sj.pages?.[sj.pages.length - 1];
        if (last) setActivePageName(last.name);
        return prev;
      });
    });
  };

  const onUpdateSection = (patch: Partial<any>) => {
    setForm((prev) => {
      const sj = ensureSurveyJson(prev);
      const nextSj = updatePage(sj, activePageName, patch);
      return { ...prev, surveyJson: nextSj };
    });
  };

  const onAddQuestion = (type: QuestionKind) => {
    setForm((prev) => {
      const sj = ensureSurveyJson(prev);
      const nextSj = addElementByKind(sj, activePageName, type);
      return { ...prev, surveyJson: nextSj };
    });
  };

  const onUpdateQuestion = (elementName: string, patch: Partial<any>) => {
    setForm((prev) => {
      const sj = ensureSurveyJson(prev);
      const nextSj = updateElement(sj, activePageName, elementName, patch);
      return { ...prev, surveyJson: nextSj };
    });
  };

  const onRemoveQuestion = (elementName: string) => {
    setForm((prev) => {
      const sj = ensureSurveyJson(prev);
      const nextSj = removeElement(sj, activePageName, elementName);
      return { ...prev, surveyJson: nextSj };
    });
  };

  if (!activePage) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="text.secondary">No sections yet.</Typography>
        <Button startIcon={<AddIcon />} onClick={onAddSection} sx={{ mt: 2 }}>
          Add section
        </Button>
      </Box>
    );
  }

  return (
    <div>
      {/* Section tabs */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {pages.map((p) => {
            const active = p.name === activePageName;
            const isOnlyOne = pages.length === 1;

            return (
              <Box
                key={p.name}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 2,
                  border: `1px solid ${BRAND.border}`,
                  bgcolor: active ? BRAND.greenSoft : "transparent",
                  overflow: "hidden",
                  justifyContent: "space-around", 
                  // gap: 1,
                  px: 0.5
                }}
              >
                {/* Clickable tab area (NOT a <button> inside a <button>) */}
                <ButtonBase
                  onClick={() => setActivePageName(p.name)}
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    textAlign: "left",
                    borderRadius: 0,
                  }}
                >
                  <Typography sx={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>
                    {p.title || "Untitled"}
                  </Typography>
                </ButtonBase>

                {/* Separate delete button */}
                {!isOnlyOne && (
                  <IconButton
                    size="small"
                    onClick={() => setDeleteSectionName(p.name)}
                    sx={{ borderRadius: "50%", p: 0.5 }}
                  >
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                )}
              </Box>
            );
          })}
        </Box>


        <IconButton
          onClick={onAddSection}
          sx={{
            border: `1px solid ${BRAND.border}`,
            borderRadius: 2,
            bgcolor: "rgba(21, 128, 61, 0.08)",
            height: 36,
            width: 36
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      {/* Section meta */}
      <Card elevation={0} sx={{ border: `1px solid ${BRAND.border}`, borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <TextField
            label="Section Title"
            placeholder='Enter a Title'
            value={activePage.title ?? ""}
            onChange={(e) => onUpdateSection({ title: e.target.value })}
            fullWidth
            InputLabelProps={{
              sx: {
                transform: 'translate(14px, 10px) scale(2)', 
                '&.MuiInputLabel-shrink': {
                  transform: 'translate(14px, -9px) scale(0.75)',
                },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2.5,
              },
            }}
            slotProps={{
              input: {
                sx: {
                  '& .MuiInputBase-input': {
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    py: 1.4,
                  },
                },
              },
            }}
          />

          <Box sx={{ mt: 2 }}>
            <TextField
              label="Description"
              value={activePage.description ?? ""}
              onChange={(e) => onUpdateSection({ description: e.target.value })}
              fullWidth
              multiline
              minRows={3}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Questions */}
      <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        {elements.map((el: any, idx: number) => (
          <QuestionCard
            key={el.name}
            index={idx}
            pageName={activePageName}
            element={el}
            onPatch={(elementName, patch) => {
              setForm((prev) => ({
                ...prev,
                surveyJson: updateElement(prev.surveyJson, activePageName, elementName, patch),
              }));
            }}
            onRemove={(elementName) => {
              setForm((prev) => ({
                ...prev,
                surveyJson: removeElement(prev.surveyJson, activePageName, elementName),
              }));
            }}
            onChangeKind={(elementName, nextKind) => {
              setForm((prev) => ({
                ...prev,
                surveyJson: changeElementKind(prev.surveyJson, activePageName, elementName, nextKind),
              }));
            }}
          />
        ))}

        {/* Add new question */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button
            onClick={() => onAddQuestion("short_text")}
            startIcon={<AddIcon />}
            fullWidth
            sx={{
              mt: 1,
              textTransform: "none",
              borderRadius: 2,
              py: 1.5,
              border: `1px solid ${BRAND.border}`,
              bgcolor: "rgba(21, 128, 61, 0.10)",
              "&:hover": { bgcolor: "rgba(21, 128, 61, 0.15)" },
            }}
          >
            Add a new question
          </Button>
        </Box>
      </Box>
      <Dialog
        open={!!deleteSectionName}
        onClose={() => setDeleteSectionName(null)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: `1px solid ${BRAND.border}`,
            boxShadow: "0 18px 60px rgba(0,0,0,0.20)",
            minWidth: { xs: "92vw", sm: 520 },
          },
        }}
      >
        <DialogTitle sx={{ px: 3, pt: 2.5, pb: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: 18, lineHeight: 1.1 }}>
                  Delete section?
                </Typography>
                <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
                  This action cannot be undone.
                </Typography>
              </Box>
            </Box>

            {/* optional close X */}
            {/* <IconButton
              onClick={() => setDeleteSectionName(null)}
              size="small"
              aria-label="Close"
              sx={{
                borderRadius: "50%",
                color: "text.secondary",
                "&:hover": { bgcolor: "rgba(0,0,0,0.06)" },
              }}
            >
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton> */}
          </Box>
        </DialogTitle>

        <Divider sx={{ borderColor: BRAND.border, mx: 2 }} />

        {/* Content */}
        <DialogContent sx={{ px: 3, py: 2 }}>
          <Typography sx={{ fontSize: 14, lineHeight: 1.6 }}>
            This will permanently delete{" "}
            <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
              {sectionToDelete?.title || "Untitled"}
            </Box>{" "}
            and all questions inside it.
          </Typography>
        </DialogContent>

        <Divider sx={{ borderColor: BRAND.border, mx: 2 }} />

        {/* Actions */}
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteSectionName(null)}
            variant="outlined"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              borderColor: BRAND.border,
              color: "text.primary",
              "&:hover": { borderColor: BRAND.border, bgcolor: "rgba(0,0,0,0.04)" },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={onConfirmDeleteSection}
            variant="contained"
            color="error"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              boxShadow: "none",
              px: 2.5,
              "&:hover": { boxShadow: "none" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
