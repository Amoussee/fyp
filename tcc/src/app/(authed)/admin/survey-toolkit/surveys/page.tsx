"use client";

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
      { value: "pending", label: "Pending" },
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
        />
      </div>
    </main>
  );
}
