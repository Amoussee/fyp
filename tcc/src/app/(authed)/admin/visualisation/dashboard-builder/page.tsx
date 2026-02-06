'use client';
import React, { useState, useEffect } from 'react';
import { me } from '@/src/lib/api/auth';
import { listDashboards, mapDashboards, saveDashboard } from '@/src/lib/api/dashboards';
import { ApiError } from '@/src/lib/api/client';
import DashboardGrid from '../../../../../components/Dashboard/DashboardGrid';
import DashboardTabs from '../../../../../components/Dashboard/DashboardTabs';
import CreateDashboardModal from '../../../../../components/Dashboard/CreateDashboardModal';
import { WidgetConfig, Dashboard, DashboardLayoutType } from '../../../../../types/dashboard';
import dynamic from 'next/dynamic';

const PivotTableV2 = dynamic(() => import('../../../../../components/pivotTableV2'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
      <p className="text-gray-500 font-medium">Initializing Visualization Engine...</p>
    </div>
  ),
});

const MOCK_SCHEMA = {
  fields: [
    { id: 'q1', label: 'Distance' },
    { id: 'q2', label: 'Mode of Transport' },
    { id: 'q3', label: 'Travel Time' },
    { id: 'q4', label: 'Grade' },
    { id: 'q5', label: 'Satisfaction' },
    { id: 'q6', label: 'Survey Month' },
  ],
};

const MOCK_RESPONSES = [
  { responses: { q1: 2, q2: 'Walking', q3: 15, q4: 'P1', q5: 5, q6: 'Jan' } },
  { responses: { q1: 1.5, q2: 'Walking', q3: 10, q4: 'P1', q5: 4, q6: 'Jan' } },
  { responses: { q1: 5, q2: 'School Bus', q3: 25, q4: 'P1', q5: 3, q6: 'Feb' } },
  { responses: { q1: 3, q2: 'Car', q3: 10, q4: 'P1', q5: 5, q6: 'Feb' } },
  { responses: { q1: 4, q2: 'Bicycle', q3: 15, q4: 'P3', q5: 4, q6: 'Mar' } },
  { responses: { q1: 6, q2: 'School Bus', q3: 35, q4: 'P3', q5: 2, q6: 'Mar' } },
  { responses: { q1: 10, q2: 'Public Transport', q3: 40, q4: 'P3', q5: 3, q6: 'Apr' } },
  { responses: { q1: 12, q2: 'Public Transport', q3: 50, q4: 'S2', q5: 4, q6: 'May' } },
  { responses: { q1: 15, q2: 'Public Transport', q3: 65, q4: 'S4', q5: 2, q6: 'Jun' } },
  { responses: { q1: 20, q2: 'Car', q3: 30, q4: 'S4', q5: 5, q6: 'Jun' } },
  { responses: { q1: 2, q2: 'Walking', q3: 12, q4: 'P2', q5: 4, q6: 'Jan' } },
  { responses: { q1: 8, q2: 'School Bus', q3: 45, q4: 'P5', q5: 1, q6: 'Feb' } },
  { responses: { q1: 3, q2: 'Bicycle', q3: 10, q4: 'S1', q5: 5, q6: 'Mar' } },
  { responses: { q1: 7, q2: 'Public Transport', q3: 35, q4: 'S3', q5: 3, q6: 'Apr' } },
  { responses: { q1: 1, q2: 'Walking', q3: 8, q4: 'P4', q5: 5, q6: 'May' } },
  { responses: { q1: 5, q2: 'Car', q3: 15, q4: 'P6', q5: 4, q6: 'Jun' } },
  { responses: { q1: 11, q2: 'School Bus', q3: 50, q4: 'S2', q5: 3, q6: 'Jul' } },
  { responses: { q1: 9, q2: 'Public Transport', q3: 40, q4: 'S4', q5: 4, q6: 'Aug' } },
  { responses: { q1: 2, q2: 'Bicycle', q3: 10, q4: 'P1', q5: 4, q6: 'Sep' } },
  { responses: { q1: 18, q2: 'Car', q3: 25, q4: 'S3', q5: 5, q6: 'Oct' } },
  { responses: { q1: 4, q2: 'School Bus', q3: 20, q4: 'P3', q5: 3, q6: 'Nov' } },
  { responses: { q1: 6, q2: 'Public Transport', q3: 30, q4: 'S1', q5: 2, q6: 'Dec' } },
];

export default function VisualisationPage() {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [activeDashboardId, setActiveDashboardId] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isExploring, setIsExploring] = useState(false);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [liveData, setLiveData] = useState<Record<string, unknown>[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [liveSchema, setLiveSchema] = useState<Record<string, unknown> | null>(null);

  // Fetch User Session and then Dashboards (COMMENTED OUT BECAUSE RESPONSES AND SCHEMA NOT DONE)
  // useEffect(() => {
  //     const initData = async () => {
  //         try {
  //             // 1. Existing Auth logic...
  //             const meRes = await fetch('/api/auth/me');
  //             const { user } = await meRes.json();
  //             setUserEmail(user.email);

  //             // 2. NEW: Fetch Actual Survey Data & Schema
  //             const [surveyRes, schemaRes] = await Promise.all([
  //                 fetch('/api/surveys/responses'),
  //                 fetch('/api/surveys/schema')
  //             ]);

  //             if (surveyRes.ok && schemaRes.ok) {
  //                 setLiveData(await surveyRes.json());
  //                 setLiveSchema(await schemaRes.json());
  //             }

  //             // 3. Existing Dashboard fetch logic...
  //             const dashRes = await fetch(`/api/dashboards?email=${user.email}`);
  //             // ... (rest of your mappedDashboards logic)
  //         } catch (error) {
  //             console.error('Initialization failed:', error);
  //         }
  //     };
  //     initData();
  // }, []);

  // PLACEHOLDER FUNCTION FOR DASHBOARD FETCHING
  useEffect(() => {
    const initData = async () => {
      try {
        const user = await me(); // uses /api/auth/me
        setUserEmail(user.email);

        const rows = await listDashboards(user.email);
        const mapped = mapDashboards(rows);

        setDashboards(mapped);
        if (mapped.length > 0) setActiveDashboardId(mapped[0].id);
      } catch (err) {
        console.error('Initialization failed:', err);
      }
    };

    initData();
  }, []);

  // Dynamic Data derivation
  const flatData = React.useMemo(() => {
    // Check if we actually have responses to process
    const hasLiveResponses = liveData && Array.isArray(liveData) && liveData.length > 0;
    const dataToProcess = hasLiveResponses ? liveData : MOCK_RESPONSES;

    // Check if we have a schema
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasValidSchema = liveSchema && Array.isArray((liveSchema as any).fields);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const schemaToUse = hasValidSchema ? (liveSchema as any) : MOCK_SCHEMA;

    // Safety check: if somehow we still have no data, return empty array
    if (!dataToProcess || dataToProcess.length === 0) return [];

    return dataToProcess.map((r) => {
      const row: Record<string, unknown> = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      schemaToUse.fields.forEach((f: any) => {
        // The key access is the most common point of failure
        // We use optional chaining and a fallback to 'N/A' to prevent crashes
        const val = (r.responses as Record<string, unknown>)?.[f.id];
        row[f.label] = val !== undefined ? val : null;
      });
      return row;
    });
  }, [liveData, liveSchema]);

  // Get Active Dashboard
  const activeDashboard = dashboards.find((d) => d.id === activeDashboardId);
  const widgets = activeDashboard?.widgets || [];

  // --- Actions ---

  const handleCreateDashboard = (name: string, layout: DashboardLayoutType) => {
    const newDashboard: Dashboard = {
      id: `dash-${Date.now()}`,
      name,
      layoutType: layout,
      widgets: [],
    };
    setDashboards((prev) => {
      const newDashboards = [...prev, newDashboard];
      // If this is the first dashboard, make it active
      if (prev.length === 0) {
        setActiveDashboardId(newDashboard.id);
      }
      return newDashboards;
    });
    setActiveDashboardId(newDashboard.id);

    setIsCreateModalOpen(false);
  };

  const handleAddWidget = (index: number) => {
    setActiveSlot(index);
    setIsExploring(true);
  };

  const handleEditWidget = (config: WidgetConfig) => {
    const index = widgets.findIndex((w) => w.id === config.id);
    if (index !== -1) {
      setActiveSlot(index);
      setIsExploring(true);
    }
  };
  const getCleanPivotState = (state: Record<string, unknown>) => {
    return {
      rows: (state.rows as string[]) || [],
      cols: (state.cols as string[]) || [],
      vals: (state.vals as string[]) || [],
      aggregatorName: (state.aggregatorName as string) || 'Count',
      rendererName: (state.rendererName as string) || 'Grouped Column Chart',
      valueFilter: (state.valueFilter as Record<string, boolean>) || {},
      // We explicitly exclude: aggregators, rendererOptions (Plotly layout),
      // and internal library metadata to keep the database small.
    };
  };
  const handleSaveFromPivot = (pivotState: unknown) => {
    if (activeSlot === null || !activeDashboardId) return;

    const cleanedPivotState = getCleanPivotState(pivotState as Record<string, unknown>); // <--- Clean it here

    setDashboards((prev) =>
      prev.map((d) => {
        if (d.id !== activeDashboardId) return d;

        const newWidgets = [...d.widgets];
        newWidgets[activeSlot] = {
          id: `widget-${Date.now()}`,
          questionId: 'q1',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          chartType: cleanedPivotState.rendererName as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          aggregation: cleanedPivotState.aggregatorName as any,
          pivotState: cleanedPivotState,
        };

        return { ...d, widgets: newWidgets };
      }),
    );


    setIsExploring(false);
    setActiveSlot(null);
  };

  const handleSaveDashboard = async () => {
    if (!activeDashboard || !userEmail) return;

    setIsSaving(true);
    try {
      const isNew = activeDashboard.id.startsWith('dash-');

      const payload = {
        dashboard_id: isNew ? undefined : Number(activeDashboard.id),
        email: userEmail,
        name: activeDashboard.name,
        layoutType: activeDashboard.layoutType,
        widgets: activeDashboard.widgets,
      };

      const updated = await saveDashboard(payload);

      // update id if newly created
      if (isNew) {
        setDashboards((prev) =>
          prev.map((d) =>
            d.id === activeDashboard.id ? { ...d, id: String(updated.dashboard_id) } : d,
          ),
        );
        setActiveDashboardId(String(updated.dashboard_id));
      }

      showNotification('success', 'Changes saved successfully!');
    } catch (err) {
      if (err instanceof ApiError) {
        showNotification('error', err.message);
      } else {
        showNotification('error', 'A network error occurred while saving.');
      }
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Dashboard Builder
            </h1>
            <p className="text-gray-500 mt-2">
              Design your insights by adding and configuring widgets.
            </p>
          </div>
          {activeDashboard && (
            <button
              onClick={handleSaveDashboard}
              disabled={isSaving}
              className={`px-6 py-2.5 rounded-lg font-semibold shadow-md transition-all flex items-center gap-2 ${
                isSaving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white transform hover:-translate-y-0.5'
              }`}
            >
              {isSaving ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Saving...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l6-6a1 1 0 00-1.414-1.414L11 12.586l-2.293-2.293z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          )}
        </div>

        {/* Dashboard Tabs Navigation */}
        <DashboardTabs
          dashboards={dashboards}
          activeDashboardId={activeDashboardId}
          onSwitchDashboard={setActiveDashboardId}
          onAddDashboard={() => setIsCreateModalOpen(true)}
        />

        {dashboards.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <span className="text-3xl text-indigo-600">+</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Dashboards Yet</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Create your first dashboard to start visualizing your data with customizable layouts
              and charts.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              Create Dashboard
            </button>
          </div>
        ) : (
          <>
            {isExploring ? (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-h-[95vh] overflow-y-auto w-fit animate-in zoom-in-95 duration-300">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Configure Widget for Slot {activeSlot! + 1}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Drag and drop attributes to build your visualization.
                    </p>
                  </div>
                  <PivotTableV2
                    data={flatData}
                    onSave={handleSaveFromPivot}
                    onCancel={() => setIsExploring(false)}
                    initialState={activeSlot !== null ? widgets[activeSlot]?.pivotState : undefined}
                  />
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-700">
                {activeDashboard && (
                  <DashboardGrid
                    widgets={widgets}
                    onAddWidget={handleAddWidget}
                    onEditWidget={handleEditWidget}
                    surveySchema={MOCK_SCHEMA}
                    // Pass flatData if the grid handles the final rendering
                    surveyResponses={MOCK_RESPONSES}
                    layoutType={activeDashboard.layoutType}
                  />
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Dashboard Modal */}
      <CreateDashboardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateDashboard}
      />

      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed bottom-8 right-8 z-[100] animate-in fade-in slide-in-from-right-8 duration-300`}
        >
          <div
            className={`${
              notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            } text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 min-w-[320px]`}
          >
            {notification.type === 'success' ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            <div>
              <p className="font-bold">{notification.type === 'success' ? 'Success' : 'Error'}</p>
              <p className="text-sm opacity-90">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="ml-auto opacity-70 hover:opacity-100"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}