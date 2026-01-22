"use client";

import { SurveyList, type Survey } from "../../../../../components/ui/surveyList";

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
  {
    id: "3",
    name: "Poi Ching School",
    creationDate: "2025-12-12",
    labels: ["Primary 4", "Primary 5", "Primary 6", "Secondary 2"],
    completedCount: 89,
    totalCount: 150,
    type: "Parent",
    status: "pending",
  },
  {
    id: "4",
    name: "Poi Ching School",
    creationDate: "2025-12-12",
    labels: ["All Students"],
    completedCount: 145,
    totalCount: 200,
    type: "Student",
    status: "ready",
  },
  {
    id: "5",
    name: "Poi Ching School",
    creationDate: "2025-12-12",
    labels: [],
    completedCount: 200,
    totalCount: 200,
    type: "Public - Parent",
    status: "closed",
  },
  {
    id: "6",
    name: "Poi Ching School",
    creationDate: "2025-12-12",
    labels: ["Primary 1", "Primary 2"],
    completedCount: 145,
    totalCount: 200,
    type: "Public - Student",
    status: "ready",
  },
  {
    id: "7",
    name: "Poi Ching School",
    creationDate: "2025-12-12",
    labels: ["Secondary 3", "Secondary 4"],
    completedCount: 50,
    totalCount: 100,
    type: "Parent",
    status: "pending",
  },
];

export default function SurveyListPage() {
  const handleNewSurvey = () => {
    console.log("Create new survey");
  };

  const handleUseTemplate = () => {
    console.log("Use template");
  };

  const handleDashboard = (survey: Survey) => {
    console.log("View dashboard for:", survey.name);
  };

  const handleEdit = (survey: Survey) => {
    console.log("Edit survey:", survey.name);
  };

  const handleDelete = (survey: Survey) => {
    console.log("Delete survey:", survey.id);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <SurveyList
          surveys={mockSurveys}
          maxLabelsToShow={2}
          onNewSurvey={handleNewSurvey}
          onUseTemplate={handleUseTemplate}
          onDashboard={handleDashboard}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </main>
  );
}
