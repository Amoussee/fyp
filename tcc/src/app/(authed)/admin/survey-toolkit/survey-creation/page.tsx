"use client";

import * as React from "react";
import { Box, Card, CardContent, Divider, Typography, Button } from "@mui/material";
import { SurveyDetailsStep } from "@/src/components/survey-creation/SurveyDetailsStep";
import { SurveyCreationTopBar } from "@/src/components/survey-creation/SurveyCreationTopBar";
import { SURVEY_CREATION_DEFAULTS } from "@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/defaults";
import { validateSurveyDetails } from "@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/validation";
import { hasErrors } from "@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/helpers";
import type { SurveyCreationForm, SurveyCreationErrors } from "@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/types";
import { SurveyQuestionsStep } from "@/src/components/survey-creation/SurveyQuestionsStep";
import { SurveyPreviewStep } from "@/src/components/survey-creation/SurveyPreviewStep";
import { surveyJsonToSections } from "@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/transform";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Chip,
  IconButton,
  TextField,
} from "@mui/material";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { BRAND } from "@/src/styles/brand";

type StepId = 0 | 1 | 2;

const steps = [
  { label: "Survey Details", helper: "Set up the basics" },
  { label: "Survey Questions", helper: "Add your survey questions" },
  { label: "Preview & Status", helper: "Review and manage publishing" },
] as const;


export default function SurveyCreationPage() {
  const [activeStep, setActiveStep] = React.useState<StepId>(0);

  const [form, setForm] = React.useState<SurveyCreationForm>(SURVEY_CREATION_DEFAULTS);
  const [errors, setErrors] = React.useState<SurveyCreationErrors>({});

  const [publishOpen, setPublishOpen] = React.useState(false);
  const [shareLink, setShareLink] = React.useState<string>("");

  const recipientLabels = React.useMemo(
    () => (form.recipients ?? []).map((r) => r.label),
    [form.recipients]
  );

  const router = useRouter();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      // optional: show a snackbar if you have one
    } catch {
      // fallback: do nothing (user can manually copy from the field)
    }
  };


  const handleNext = () => {
    if (activeStep === 0) {
      const nextErrors = validateSurveyDetails(form);
      setErrors(nextErrors);
      if (hasErrors(nextErrors)) return;
    }
    if (activeStep < 2) setActiveStep((activeStep + 1) as StepId);
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep((activeStep - 1) as StepId);
  };

  const handleFinish = () => {
    const nextErrors = validateSurveyDetails(form);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    const payload = {
      ...form,
      sections: surveyJsonToSections(form.surveyJson),
    };

    console.log("submit payload:", payload);

    // TODO: backend publish call should return the share URL + survey id.
    // For now we generate a placeholder.
    const fakeSurveyId = crypto.randomUUID();
    const link = `${window.location.origin}/surveys/${fakeSurveyId}`;

    setShareLink(link);
    setPublishOpen(true);
  };



  const clearError = (key: keyof SurveyCreationForm) => {
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-neutral-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <SurveyCreationTopBar
          activeStep={activeStep}
          steps={steps}
          onPrev={handleBack}
          onNext={handleNext}
          onSaveDraft={() => {
            const draftPayload = {
              ...form,
              sections: surveyJsonToSections(form.surveyJson),
            };
            console.log("Saving draft:", draftPayload);
          }}
          onSaveTemplate={() => { /* template logic */ }}
        />

        {activeStep === 0 && 
          <SurveyDetailsStep
            form={form}
            setForm={setForm}
            errors={errors}
            clearError={clearError}
          />
        }

        {activeStep === 1 && (
          <SurveyQuestionsStep
            form={form}
            setForm={setForm}
          />
        )}


        {activeStep === 2 && (
          <SurveyPreviewStep form={form} />
        )}

        <Divider sx={{ mt: 3 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="text" onClick={handleBack} disabled={activeStep === 0} sx={{ borderRadius: 999 }}>
            Back
          </Button>

          {activeStep < 2 ? (
            <Button variant="contained" onClick={handleNext} sx={{ borderRadius: 999, px: 3, boxShadow: "none" }}>
              Next
            </Button>
          ) : (
            <Button variant="contained" onClick={handleFinish} sx={{ borderRadius: 999, px: 3, boxShadow: "none" }}>
              Publish
            </Button>
          )}
        </Box>
      </div>
      <Dialog
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: `1px solid ${BRAND.border}`,
            boxShadow: "0 18px 60px rgba(0,0,0,0.20)",
            minWidth: { xs: "92vw", sm: 560 },
          },
        }}
      >
        <DialogTitle sx={{ px: 3, pt: 2.5, pb: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <CheckCircleRoundedIcon sx={{ color: BRAND.green }} />
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 18, lineHeight: 1.1 }}>
                  Survey is now Open
                </Typography>
                <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
                  Your link is ready to share with respondents.
                </Typography>
              </Box>
            </Box>

            {/* optional close X */}
            {/* <IconButton onClick={() => setPublishOpen(false)} size="small" aria-label="Close">
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton> */}
          </Box>
        </DialogTitle>

        <Divider sx={{ borderColor: BRAND.border, mx: 2 }} />

        <DialogContent sx={{ px: 3, py: 2 }}>
          <Box sx={{ display: "grid", gap: 2 }}>
            {/* Share link */}
            <Box sx={{ display: "grid", gap: 1 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 800, color: BRAND.muted }}>
                Share link
              </Typography>

              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <TextField
                  value={shareLink}
                  fullWidth
                  size="small"
                  InputProps={{ readOnly: true }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
                />
                <IconButton
                  onClick={handleCopyLink}
                  sx={{
                    borderRadius: 2,
                    border: `1px solid ${BRAND.border}`,
                    bgcolor: "rgba(21, 128, 61, 0.08)",
                    "&:hover": { bgcolor: "rgba(21, 128, 61, 0.12)" },
                  }}
                  aria-label="Copy link"
                >
                  <ContentCopyRoundedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            </Box>

            {/* Recipients */}
            <Box sx={{ display: "grid", gap: 1 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 800, color: BRAND.muted }}>
                Recipients
              </Typography>

              {form.isDirected ? (
                recipientLabels.length ? (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {recipientLabels.map((label) => (
                      <Chip
                        key={label}
                        label={label}
                        size="small"
                        sx={{ border: `1px solid ${BRAND.border}`, fontWeight: 600 }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                    No recipients selected.
                  </Typography>
                )
              ) : (
                <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                  Open survey — anyone with the link can respond.
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>

        <Divider sx={{ borderColor: BRAND.border, mx: 2 }} />

        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button
            onClick={handleCopyLink}
            variant="outlined"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              borderColor: BRAND.border,
              color: "text.primary",
              "&:hover": { borderColor: BRAND.border, bgcolor: "rgba(0,0,0,0.04)" },
            }}
          >
            Copy link
          </Button>

          <Button
            onClick={() => router.push("/admin/survey-toolkit/surveys")}
            
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              boxShadow: "none",
              px: 2.5,
              bgcolor: BRAND.green,
              "&:hover": { bgcolor: BRAND.green, boxShadow: "none" },
            }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}
