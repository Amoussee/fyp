'use client';

import { useState, useMemo } from 'react';
import { SurveyList, type Survey } from '../../../../../components/ui/surveyList';
import { SurveyTemplateList } from '../../../../../components/ui/surveyTemplateList';
import type { Dayjs } from 'dayjs'; // Add this import at the top
import {
  UniversalFilter,
  type FilterConfig,
  type FilterValues,
} from '../../../../../components/UniversalFilter';

const surveyFilters: FilterConfig[] = [
  {
    field: 'name',
    label: 'Survey Name',
    type: 'text',
    placeholder: 'Search by survey name',
  },
  {
    field: 'status',
    label: 'Status',
    type: 'radio',
    options: [
      { value: 'pending', label: 'Pending' },
      { value: 'ready', label: 'Ready' },
      { value: 'closed', label: 'Closed' },
    ],
  },
  {
    field: 'type',
    label: 'Survey Type',
    type: 'checkbox',
    options: [
      { value: 'Public - Parent', label: 'Public - Parent' },
      { value: 'Public - Student', label: 'Public - Student' },
      { value: 'Parent', label: 'Parent' },
      { value: 'Student', label: 'Student' },
    ],
  },
  {
    field: 'creationDate',
    label: 'Creation Date',
    type: 'dateRange',
  },
];

const mockSurveys: Survey[] = [
  {
    id: '1',
    name: 'Poi Ching School Carbon Emissions',
    creationDate: '2025-12-12',
    labels: ['Primary 1', 'Primary 2', 'Primary 3'],
    completedCount: 145,
    totalCount: 200,
    type: 'Public - Parent',
    status: 'ready',
  },
  {
    id: '2',
    name: 'East Side Best Routes',
    creationDate: '2025-12-12',
    labels: ['Secondary 1'],
    completedCount: 145,
    totalCount: 200,
    type: 'Public - Student',
    status: 'ready',
  },
  {
    id: '3',
    name: 'Student Wellbeing Survey 2025',
    creationDate: '2025-01-15',
    labels: ['Primary 4', 'Primary 5', 'Primary 6'],
    completedCount: 89,
    totalCount: 150,
    type: 'Student',
    status: 'pending',
  },
  {
    id: '4',
    name: 'Parent Feedback Q1 2025',
    creationDate: '2025-01-20',
    labels: ['All Grades'],
    completedCount: 200,
    totalCount: 200,
    type: 'Parent',
    status: 'closed',
  },
];

export default function SurveyListPage() {
  const [filterValues, setFilterValues] = useState<FilterValues>({
    name: '',
    status: '',
    type: [],
    creationDate: { start: null, end: null },
  });

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const filteredSurveys = useMemo(() => {
    return mockSurveys.filter((survey) => {
      // Name filter
      if (
        filterValues.name &&
        !survey.name.toLowerCase().includes((filterValues.name as string).toLowerCase())
      ) {
        return false;
      }

      // Status filter
      if (filterValues.status && survey.status !== filterValues.status) {
        return false;
      }

      // Type filter
      if (
        (filterValues.type as string[])?.length > 0 &&
        !(filterValues.type as string[]).includes(survey.type)
      ) {
        return false;
      }

      // Date range filter
      if (filterValues.creationDate) {
        const dateRange = filterValues.creationDate as { start: Dayjs | null; end: Dayjs };
        if (dateRange.start || dateRange.end) {
          const surveyDate = new Date(survey.creationDate);

          if (dateRange.start) {
            const startDate = new Date(dateRange.start.format('YYYY-MM-DD'));
            if (surveyDate < startDate) {
              return false;
            }
          }

          if (dateRange.end) {
            const endDate = new Date(dateRange.end.format('YYYY-MM-DD'));
            endDate.setHours(23, 59, 59, 999);
            if (surveyDate > endDate) {
              return false;
            }
          }
        }
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
                name: '',
                status: '',
                type: [],
                creationDate: { start: null, end: null },
              })
            }
          />
        </div>

        <SurveyList
          surveys={filteredSurveys}
          maxLabelsToShow={2}
          onUseTemplate={() => setIsTemplateModalOpen(true)}
          onNewSurvey={() => console.log('New survey')}
          onDashboard={(survey) => console.log('Dashboard', survey)}
          onEdit={(survey) => console.log('Edit', survey)}
          onDelete={(survey) => console.log('Delete', survey)}
        />

        <SurveyTemplateList
          isOpen={isTemplateModalOpen}
          onClose={() => setIsTemplateModalOpen(false)}
          onSelectTemplate={(template) => {
            console.log('Selected template:', template);
            // Handle template selection (e.g., navigate to create survey page)
          }}
        />
      </div>
    </main>
  );
}
