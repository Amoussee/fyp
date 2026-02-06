'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SurveyList, type Survey } from '../../../../../components/ui/surveyList';
import { SurveyTemplateList } from '../../../../../components/ui/surveyTemplateList';
import type { Dayjs } from 'dayjs';
import {
  UniversalFilter,
  type FilterConfig,
  type FilterValues,
} from '../../../../../components/UniversalFilter';
import { getAllSurveys, deleteSurvey } from '@/src/lib/api/surveys';

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
      { value: 'draft', label: 'Draft' },
      { value: 'ready', label: 'Ready' },
      { value: 'closed', label: 'Closed' },
      { value: 'open', label: 'Open' }
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

// Helper function to map API status to UI status
function mapAPIStatusToUIStatus(apiStatus: 'draft' | 'open' | 'closed' | 'ready'): Survey['status'] {
  const statusMap: Record<'draft' | 'open' | 'closed' | 'ready', Survey['status']> = {
    draft: 'draft',
    open: 'open',  // API 'open' maps to UI 'ready'
    ready: 'ready', // API also has 'ready' status
    closed: 'closed',
  };
  return statusMap[apiStatus];
}

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
  
  // API integration state
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch surveys from API
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getAllSurveys();
        
        console.log('API Response:', response);
        
        // The API returns an array directly, not wrapped in { surveys: [...] }
        const apiSurveys = Array.isArray(response) ? response : [];
        
        if (apiSurveys.length === 0) {
          console.log('No surveys found');
          setSurveys([]);
          return;
        }
        
        // Transform API data to match UI Survey type
        const transformedSurveys: Survey[] = apiSurveys.map((apiSurvey: any) => ({
          id: apiSurvey.form_id.toString(),
          name: apiSurvey.title,
          creationDate: apiSurvey.created_at || new Date().toISOString(),
          labels: [], // ⚠️ NOT PROVIDED BY API
          completedCount: 0, // ⚠️ NOT PROVIDED BY API
          totalCount: apiSurvey.recipients?.length || 0,
          type: 'Student', // ⚠️ NOT PROVIDED BY API
          status: mapAPIStatusToUIStatus(apiSurvey.status),
        }));
        
        console.log('Transformed surveys:', transformedSurveys);
        setSurveys(transformedSurveys);
      } catch (err) {
        console.error('Error fetching surveys:', err);
        setError('Failed to load surveys. Please try again.');
        setSurveys([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  // Separate surveys into published and drafts
  const publishedSurveys = useMemo(
    () => surveys.filter((survey) => survey.status !== 'draft'),
    [surveys]
  );

  const draftSurveys = useMemo(
    () => surveys.filter((survey) => survey.status === 'draft'),
    [surveys]
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

  // Handle delete
  const handleDelete = async (survey: Survey) => {
    if (!confirm(`Are you sure you want to delete "${survey.name}"?`)) {
      return;
    }

    try {
      await deleteSurvey(Number(survey.id));
      setSurveys((prev) => prev.filter((s) => s.id !== survey.id));
    } catch (err) {
      console.error('Error deleting survey:', err);
      alert('Failed to delete survey. Please try again.');
    }
  };

  // Handle edit
  const handleEdit = (survey: Survey) => {
    router.push(`/admin/survey-toolkit/survey-creation?id=${survey.id}`);
  };

  // Handle dashboard
  const handleDashboard = (survey: Survey) => {
    router.push(`/admin/survey-toolkit/dashboard/${survey.id}`);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="text-center">Loading surveys...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
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
          onDashboard={handleDashboard}
          onEdit={handleEdit}
          onDelete={handleDelete}
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
          }}
        />
      </div>
    </main>
  );
}