import React from 'react';
import { WidgetConfig, DashboardLayoutType } from '../../types/dashboard';
import DashboardCell from './DashboardCell';

interface DashboardGridProps {
  widgets: WidgetConfig[];
  onAddWidget: (index: number) => void;
  onEditWidget: (config: WidgetConfig) => void;
  surveySchema: { fields: { label: string; id: string }[] };
  surveyResponses: { responses: Record<string, unknown> }[];
  layoutType?: DashboardLayoutType;
}

const DashboardGrid = ({
  widgets,
  onAddWidget,
  onEditWidget,
  surveySchema,
  surveyResponses,
  layoutType = 'layout-2',
}: DashboardGridProps) => {
  // Determine grid configuration based on layout type
  let gridSize = 2;
  let gridClass = 'grid-cols-1 lg:grid-cols-2';

  switch (layoutType) {
    case 'layout-1':
      gridSize = 1;
      gridClass = 'grid-cols-1';
      break;
    case 'layout-2':
      gridSize = 2;
      gridClass = 'grid-cols-1 lg:grid-cols-2';
      break;
    case 'layout-3':
      gridSize = 3;
      gridClass = 'grid-cols-1 lg:grid-cols-3';
      break;
    case 'layout-4':
      gridSize = 4;
      gridClass = 'grid-cols-1 md:grid-cols-2'; // 2x2
      break;
  }

  // Create an array of length based on layout
  const slots = Array.from({ length: gridSize });

  return (
    <div className={`grid gap-6 p-6 w-full transition-all duration-300 ${gridClass}`}>
      {slots.map((_, index) => {
        const widget = widgets[index];

        return (
          <DashboardCell
            key={widget ? widget.id : `empty-${index}`}
            config={widget}
            onClick={() => (widget ? onEditWidget(widget) : onAddWidget(index))}
            surveySchema={surveySchema}
            surveyResponses={surveyResponses}
          />
        );
      })}
    </div>
  );
};

export default DashboardGrid;
