"use client";

import { SurveyTemplateList } from "../../../../../components/ui/surveyTemplateList"; // Add this
import { useState, useMemo } from "react";
import { SurveyList, type Survey } from "../../../../../components/ui/surveyList";
import {
  UniversalFilter,
  type FilterConfig,
  type FilterValues,
} from "../../../../../components/UniversalFilter";

const surveyFilters: FilterConfig[] = [
  {
    field: "name",
    label: "School Name",
    type: "text",
    placeholder: "Search by school name",
  },
  {
    field: "status",
    label: "Status",
    type: "radio",
    options: [
      { value: "open", label: "Open" },
      { value: "ready", label: "Ready" },
      { value: "closed", label: "Closed" },
    ],
  },
  {
    field: "type",
    label: "Survey Type",
    type: "checkbox",
    options: [
      { value: "Public - Parent", label: "Public - Parent" },
      { value: "Public - Student", label: "Public - Student" },
      { value: "Parent", label: "Parent" },
      { value: "Student", label: "Student" },
    ],
  },
];

const mockSurveys: Survey[] = [
  {
    id: "1",
    name: "Poi Ching School",
    creationDate: "2025-12-12",
    labels: ["Primary 1", "Primary 2", "Primary 3"],
    completedCount: 145,
    totalCount: 200,
    type: "Public - Parent",
    status: "ready",
  },
  {
    id: "2",
    name: "Poi Ching School",
    creationDate: "2025-12-12",
    labels: ["Secondary 1"],
    completedCount: 145,
    totalCount: 200,
    type: "Public - Student",
    status: "ready",
  },
  // ...
];


export default function SurveyListPage() {
  // ✅ hooks live here
  const [filterValues, setFilterValues] = useState<FilterValues>({
    name: "",
    status: "",
    type: [],
  });

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false); // Add this

  const filteredSurveys = useMemo(() => {
    return mockSurveys.filter((survey) => {
      if (
        filterValues.name &&
        !survey.name
          .toLowerCase()
          .includes((filterValues.name as string).toLowerCase())
      ) {
        return false;
      }

      if (filterValues.status && survey.status !== filterValues.status) {
        return false;
      }

      if (
        (filterValues.type as string[])?.length > 0 &&
        !(filterValues.type as string[]).includes(survey.type)
      ) {
        return false;
      }

      return true;
    });
  }, [filterValues]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex justify-end mb-4">
          <UniversalFilter
            filters={surveyFilters}
            values={filterValues}
            onChange={setFilterValues}
            onClear={() =>
              setFilterValues({
                name: "",
                status: "",
                type: [],
              })
            }
          />
        </div>

        <SurveyList
            surveys={filteredSurveys}
            maxLabelsToShow={2}
            onUseTemplate={() => setIsTemplateModalOpen(true)} // Add this
            onNewSurvey={() => console.log("New survey")}
            onDashboard={(survey) => console.log("Dashboard", survey)}
            onEdit={(survey) => console.log("Edit", survey)}
            onDelete={(survey) => console.log("Delete", survey)}
          />

        {/* Add the modal */}
        <SurveyTemplateList
          isOpen={isTemplateModalOpen}
          onClose={() => setIsTemplateModalOpen(false)}
          onSelectTemplate={(template) => {
            console.log("Selected template:", template);
            // Handle template selection (e.g., navigate to create survey page)
          }}
        />
      </div>
    </main>
  );
}
