'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { SurveyList, type Survey } from '../../../../../components/ui/surveyList';
import { SurveyTemplateList } from '../../../../../components/ui/surveyTemplateList';
import type { Dayjs } from 'dayjs';
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
  // Draft surveys
  {
    id: '5',
    name: 'School Facilities Survey',
    creationDate: '2025-01-25',
    labels: ['Secondary 2', 'Secondary 3'],
    completedCount: 0,
    totalCount: 0,
    type: 'Public - Student',
    status: 'draft',
  },
  {
    id: '6',
    name: 'Parent-Teacher Conference Feedback',
    creationDate: '2025-01-28',
    labels: ['All Grades'],
    completedCount: 0,
    totalCount: 0,
    type: 'Parent',
    status: 'draft',
  },
  {
    id: '7',
    name: 'Extra-Curricular Activities Interest',
    creationDate: '2025-01-30',
    labels: ['Primary 1', 'Primary 2'],
    completedCount: 0,
    totalCount: 0,
    type: 'Student',
    status: 'draft',
  },
];

export default function SurveyListPage() {
  const router = useRouter();

  const [filterValues, setFilterValues] = useState<FilterValues>({
    name: '',
    status: '',
    type: [],
    creationDate: { start: null, end: null },
  });

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'published' | 'drafts'>('published');

  // Separate surveys into published and drafts
  const publishedSurveys = useMemo(
    () => mockSurveys.filter((survey) => survey.status !== 'draft'),
    []
  );

  const draftSurveys = useMemo(
    () => mockSurveys.filter((survey) => survey.status === 'draft'),
    []
  );

  // Apply filters to the appropriate list
  const filteredSurveys = useMemo(() => {
    const surveysToFilter = activeView === 'published' ? publishedSurveys : draftSurveys;

    return surveysToFilter.filter((survey) => {
      // Name filter
      if (
        filterValues.name &&
        !survey.name.toLowerCase().includes((filterValues.name as string).toLowerCase())
      ) {
        return false;
      }

      // Status filter (only apply to published surveys)
      if (activeView === 'published' && filterValues.status && survey.status !== filterValues.status) {
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
  }, [filterValues, activeView, publishedSurveys, draftSurveys]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Filter in top-right corner */}
        <div className="flex justify-end mb-6">
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
          onNewSurvey={() => router.push('/admin/survey-toolkit/survey-creation')}
          onDashboard={(survey) => console.log('Dashboard', survey)}
          onEdit={(survey) => console.log('Edit', survey)}
          onDelete={(survey) => console.log('Delete', survey)}
          activeView={activeView}
          onViewChange={setActiveView}
          publishedCount={publishedSurveys.length}
          draftsCount={draftSurveys.length}
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