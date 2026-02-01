import React from 'react';
import { WidgetConfig } from '../../types/dashboard';
import DashboardCell from './DashboardCell';

interface DashboardGridProps {
  widgets: WidgetConfig[];
  onAddWidget: (index: number) => void;
  onEditWidget: (config: WidgetConfig) => void;
  surveySchema: any;
  surveyResponses: any[];
}

const GRID_SIZE = 6; // Fixed 6 slots for MVP

const DashboardGrid = ({ widgets, onAddWidget, onEditWidget, surveySchema, surveyResponses }: DashboardGridProps) => {
  // Create an array of length GRID_SIZE
  const slots = Array.from({ length: GRID_SIZE });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {slots.map((_, index) => {
        // Find if we have a widget for this slot (assuming widgets are just pushed linearly or have position)
        // For simple MVP: Widgets array maps to slots? Or we store index?
        // Let's assume we map by index or use `widgets[index]` for simplicity if sequential.
        // Better: `widgets` has an `id` or position. 
        // Let's assume the parent manages the array size or we just match by index.
        
        const widget = widgets[index]; // Simple index mapping for now

        return (
          <DashboardCell
            key={index}
            config={widget}
            onClick={() => widget ? onEditWidget(widget) : onAddWidget(index)}
            surveySchema={surveySchema}
            surveyResponses={surveyResponses}
          />
        );
      })}
    </div>
  );
};

export default DashboardGrid;
