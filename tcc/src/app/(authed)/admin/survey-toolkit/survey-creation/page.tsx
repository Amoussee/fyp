"use client";

import * as React from "react";
import { Box, Card, CardContent, Divider, Typography, Button } from "@mui/material";
import { SurveyDetailsStep } from "@/src/components/survey-creation/SurveyDetailsStep";
import { SurveyCreationTopBar } from "@/src/components/survey-creation/SurveyCreationTopBar";
import { BRAND } from "@/src/styles/brand";
import { SURVEY_CREATION_DEFAULTS } from "@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/defaults";
import { validateSurveyDetails } from "@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/validation";
import { hasErrors } from "@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/helpers";
import type { SurveyCreationForm, SurveyCreationErrors } from "@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/types";
import { SurveyQuestionsStep } from "@/src/components/survey-creation/SurveyQuestionsStep";
import { surveyJsonToSections } from "@/src/app/(authed)/admin/survey-toolkit/survey-creation/model/transform";

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
      // generate sections at submit time
      sections: surveyJsonToSections(form.surveyJson),
    };

    console.log("submit payload:", payload);

    // TODO send payload to backend
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
          <Box sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Preview & Status (Placeholder)
            </Typography>
          </Box>
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
              Finish
            </Button>
          )}
        </Box>
      </div>
    </div>
  );
}
