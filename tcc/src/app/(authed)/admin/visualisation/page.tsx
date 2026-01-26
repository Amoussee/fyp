'use client';
import React, { useState, useEffect } from 'react';
import DashboardGrid from '../../../../components/Dashboard/DashboardGrid';
import DashboardTabs from '../../../../components/Dashboard/DashboardTabs';
import CreateDashboardModal from '../../../../components/Dashboard/CreateDashboardModal';
import PivotTableV2 from '../../../../components/pivotTableV2';
import { WidgetConfig, Dashboard, DashboardLayoutType } from '../../../../types/dashboard';

// Mock Data for MVP Verification (Moved outside for cleaner re-renders)
const MOCK_SCHEMA = {
    fields: [
        { id: 'q1', label: 'Distance' },
        { id: 'q2', label: 'Mode of Transport' },
        { id: 'q3', label: 'Travel Time' },
        { id: 'q4', label: 'Grade' },
        { id: 'q5', label: 'Satisfaction' },
        { id: 'q6', label: 'Survey Month' }
    ]
};

const MOCK_RESPONSES = [
    // Primary 1
    { responses: { q1: 2, q2: 'Walking', q3: 15, q4: 'P1', q5: 5, q6: 'Jan' } },
    { responses: { q1: 1.5, q2: 'Walking', q3: 10, q4: 'P1', q5: 4, q6: 'Jan' } },
    { responses: { q1: 5, q2: 'School Bus', q3: 25, q4: 'P1', q5: 3, q6: 'Feb' } },
    { responses: { q1: 3, q2: 'Car', q3: 10, q4: 'P1', q5: 5, q6: 'Feb' } },
    // Primary 3
    { responses: { q1: 4, q2: 'Bicycle', q3: 15, q4: 'P3', q5: 4, q6: 'Mar' } },
    { responses: { q1: 6, q2: 'School Bus', q3: 35, q4: 'P3', q5: 2, q6: 'Mar' } },
    { responses: { q1: 10, q2: 'Public Transport', q3: 40, q4: 'P3', q5: 3, q6: 'Apr' } },
    // Secondarys
    { responses: { q1: 12, q2: 'Public Transport', q3: 50, q4: 'S2', q5: 4, q6: 'May' } },
    { responses: { q1: 15, q2: 'Public Transport', q3: 65, q4: 'S4', q5: 2, q6: 'Jun' } },
    { responses: { q1: 20, q2: 'Car', q3: 30, q4: 'S4', q5: 5, q6: 'Jun' } },
    // More mixed
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
    // Initial State: No Dashboards
    const [dashboards, setDashboards] = useState<Dashboard[]>([]);
    const [activeDashboardId, setActiveDashboardId] = useState<string>('');

    // UI State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isExploring, setIsExploring] = useState(false);
    const [activeSlot, setActiveSlot] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 5000);
    };

    // Fetch User Session and then Dashboards
    useEffect(() => {
        const initData = async () => {
            try {
                // 1. Get current user session
                const meRes = await fetch('/api/auth/me');
                if (!meRes.ok) {
                    console.error('Failed to fetch auth session');
                    return;
                }
                const { user } = await meRes.json();
                console.log('User session loaded:', user); // DEBUG LOG
                setUserEmail(user.email);

                // 2. Fetch dashboards for this user using email
                const dashRes = await fetch(`/api/dashboards?email=${user.email}`);
                if (dashRes.ok) {
                    const rawData = await dashRes.json();
                    // Map Postgres schema to Dashboard interface
                    const mappedDashboards: Dashboard[] = rawData.map((d: any) => ({
                        id: d.dashboard_id.toString(),
                        name: d.name,
                        layoutType: d.config.layoutType,
                        widgets: d.config.widgets || []
                    }));
                    setDashboards(mappedDashboards);
                    if (mappedDashboards.length > 0) {
                        setActiveDashboardId(mappedDashboards[0].id);
                    }
                }
            } catch (error) {
                console.error('Initialization failed:', error);
            }
        };
        initData();
    }, []);

    // Dynamic Data derivation
    const flatData = React.useMemo(() => {
        return MOCK_RESPONSES.map(r => {
            const row: any = {};
            MOCK_SCHEMA.fields.forEach(f => {
                row[f.label] = (r.responses as Record<string, any>)[f.id];
            });
            return row;
        });
    }, []);

    // Get Active Dashboard
    const activeDashboard = dashboards.find(d => d.id === activeDashboardId);
    const widgets = activeDashboard?.widgets || [];

    // --- Actions ---

    const handleCreateDashboard = (name: string, layout: DashboardLayoutType) => {
        const newDashboard: Dashboard = {
            id: `dash-${Date.now()}`,
            name,
            layoutType: layout,
            widgets: []
        };
        setDashboards(prev => {
            const newDashboards = [...prev, newDashboard];
            // If this is the first dashboard, make it active
            if (prev.length === 0) {
                setActiveDashboardId(newDashboard.id);
            }
            return newDashboards;
        });

        // Also set active explicitly if logic above needs it immediately, 
        // but setState is async. The length check above inside setter is safer for ordering 
        // but activeId uses separte state.
        // Actually, better to just set it active always if we want to jump to it?
        // Or only if it's the first one? Let's jump to new dashboard always for better UX.
        setActiveDashboardId(newDashboard.id);

        setIsCreateModalOpen(false);
    };

    const handleAddWidget = (index: number) => {
        setActiveSlot(index);
        setIsExploring(true);
    };

    const handleEditWidget = (config: WidgetConfig) => {
        const index = widgets.findIndex(w => w.id === config.id);
        if (index !== -1) {
            setActiveSlot(index);
            setIsExploring(true);
        }
    };

    const handleSaveFromPivot = (pivotState: any) => {
        if (activeSlot === null || !activeDashboardId) return;

        // Map label back to ID for reference (though pivotState is the primary driver now)
        const rowLabel = pivotState.rows?.[0];
        const question = MOCK_SCHEMA.fields.find(f => f.label === rowLabel);
        const questionId = question ? question.id : 'q1';

        setDashboards(prev => prev.map(d => {
            if (d.id !== activeDashboardId) return d;

            const newWidgets = [...d.widgets];
            newWidgets[activeSlot] = {
                id: `widget-${Date.now()}`,
                questionId: questionId,
                chartType: pivotState.rendererName,
                aggregation: pivotState.aggregatorName || 'count',
                pivotState: pivotState // Save the full state for rendering in the grid
            };

            return { ...d, widgets: newWidgets };
        }));

        setIsExploring(false);
        setActiveSlot(null);
    };

    const handleSaveDashboard = async () => {
        console.log("save button pressed");
        console.log("State check:", { activeDashboard, userEmail });

        if (!activeDashboard || !userEmail) {
            console.error("Missing activeDashboard or userEmail", {
                hasDashboard: !!activeDashboard,
                hasEmail: !!userEmail
            });
            return;
        }

        setIsSaving(true);
        try {
            // Check if it's a new dashboard (temp ID starting with 'dash-')
            const isNew = activeDashboard.id.startsWith('dash-');

            const payload = {
                dashboard_id: isNew ? undefined : parseInt(activeDashboard.id),
                email: userEmail,
                name: activeDashboard.name,
                layoutType: activeDashboard.layoutType,
                widgets: activeDashboard.widgets
            };

            const response = await fetch('/api/dashboards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const updatedDash = await response.json();
                console.log('Dashboard saved successfully:', updatedDash);

                // Update local state with the real ID from database
                setDashboards(prev => prev.map(d => {
                    if (d.id === activeDashboard.id) {
                        return {
                            ...d,
                            id: updatedDash.dashboard_id.toString()
                        };
                    }
                    return d;
                }));

                if (isNew) {
                    setActiveDashboardId(updatedDash.dashboard_id.toString());
                }

                showNotification('success', 'Changes saved successfully!');
            } else {
                const errorData = await response.json();
                console.error('Save failed:', errorData);
                showNotification('error', `Failed to save: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error saving dashboard:', error);
            showNotification('error', 'A network error occurred while saving.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="w-full">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard Builder</h1>
                        <p className="text-gray-500 mt-2">Design your insights by adding and configuring widgets.</p>
                    </div>
                    {activeDashboard && (
                        <button
                            onClick={handleSaveDashboard}
                            disabled={isSaving}
                            className={`px-6 py-2.5 rounded-lg font-semibold shadow-md transition-all flex items-center gap-2 ${isSaving
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
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l6-6a1 1 0 00-1.414-1.414L11 12.586l-2.293-2.293z" />
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
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
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">Create your first dashboard to start visualizing your data with customizable layouts and charts.</p>
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
                            <div className="inline-block bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500 w-fit">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">Configure Widget for Slot {activeSlot! + 1}</h2>
                                    <p className="text-sm text-gray-500">Drag and drop attributes to build your visualization.</p>
                                </div>
                                <PivotTableV2
                                    data={flatData}
                                    onSave={handleSaveFromPivot}
                                    onCancel={() => setIsExploring(false)}
                                    initialState={activeSlot !== null ? widgets[activeSlot]?.pivotState : undefined}
                                />
                            </div>
                        ) : (
                            <div className="animate-in fade-in duration-700">
                                {activeDashboard && (
                                    <DashboardGrid
                                        widgets={widgets}
                                        onAddWidget={handleAddWidget}
                                        onEditWidget={handleEditWidget}
                                        surveySchema={MOCK_SCHEMA}
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
                <div className={`fixed bottom-8 right-8 z-[100] animate-in fade-in slide-in-from-right-8 duration-300`}>
                    <div className={`${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                        } text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 min-w-[320px]`}>
                        {notification.type === 'success' ? (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                        <div>
                            <p className="font-bold">{notification.type === 'success' ? 'Success' : 'Error'}</p>
                            <p className="text-sm opacity-90">{notification.message}</p>
                        </div>
                        <button onClick={() => setNotification(null)} className="ml-auto opacity-70 hover:opacity-100">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}