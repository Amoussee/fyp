'use client';

import React, { useState } from 'react';
import DashboardGrid from '../../../../components/Dashboard/DashboardGrid';
import ChartConfigModal from '../../../../components/Dashboard/ChartConfigModal';
import { WidgetConfig } from '../../../../types/dashboard';

// Mock Data for MVP Verification
const MOCK_SCHEMA = {
    fields: [
        { id: 'q1', label: 'What is your department?' },
        { id: 'q2', label: 'How satisfied are you?' },
        { id: 'q3', label: 'Years of Experience' }
    ]
};

const MOCK_RESPONSES = [
    { responses: { q1: 'Engineering', q2: '5', q3: '2' } },
    { responses: { q1: 'Engineering', q2: '4', q3: '3' } },
    { responses: { q1: 'HR', q2: '5', q3: '5' } },
    { responses: { q1: 'Sales', q2: '3', q3: '1' } },
    { responses: { q1: 'Sales', q2: '4', q3: '4' } },
    { responses: { q1: 'Engineering', q2: '5', q3: '2' } },
];

export default function VisualisationPage() {
    const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeSlot, setActiveSlot] = useState<number | null>(null);

    const handleAddWidget = (index: number) => {
        setActiveSlot(index);
        setIsModalOpen(true);
    };

    const handleEditWidget = (config: WidgetConfig) => {
        // Find index of this widget
        const index = widgets.findIndex(w => w.id === config.id);
        if (index !== -1) {
            setActiveSlot(index); // This assumes widgets array aligns with slots or we use ID. 
            // Current Grid logic uses array index. Let's stick to that for MVP.
            // If widgets is sparse, we need to know the slot index.
            // But wait, the Grid component maps `slots.map` and looks up `widgets[index]`.
            // So widgets array must be sparse or we store a map?
            // Let's change state to be a map or sparse array to support "slot 5" without "slot 4".
            // For now, let's use a sparse array approach or an object keyed by index.
            // To keep it simple with the Grid implementation I wrote:
            // "const widget = widgets[index]" -> implies widgets is an array where index corresponds to slot.
            setIsModalOpen(true);
        }
    };

    const handleSaveConfig = (configData: Omit<WidgetConfig, 'id'>) => {
        if (activeSlot === null) return;

        setWidgets(prev => {
            const newWidgets = [...prev];
            // Ensure array is long enough if we pick a far slot (though grid limits to 6)
            // Ideally we use an object { [slotIndex]: config } but array is fine if we fill gaps with undefined.
            newWidgets[activeSlot] = {
                ...configData,
                id: `widget-${Date.now()}`
            };
            return newWidgets;
        });
        
        setIsModalOpen(false);
        setActiveSlot(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard Builder</h1>
            
            <DashboardGrid 
                widgets={widgets} 
                onAddWidget={handleAddWidget}
                onEditWidget={handleEditWidget} // Edit logic basically re-opens modal for that slot
                surveySchema={MOCK_SCHEMA}
                surveyResponses={MOCK_RESPONSES}
            />

            <ChartConfigModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveConfig}
                surveySchema={MOCK_SCHEMA}
            />
        </div>
    );
}