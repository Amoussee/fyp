'use client';
import React, { useState } from 'react';
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

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="w-full">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard Builder</h1>
                        <p className="text-gray-500 mt-2">Design your insights by adding and configuring widgets.</p>
                    </div>
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
        </div>
    );
}