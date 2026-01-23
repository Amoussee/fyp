import React from 'react';
import { WidgetConfig } from '../../types/dashboard';
import DynamicSurveyPivot from '../pivotTable'; // Reroutes to your existing chart logic

interface DashboardCellProps {
  config?: WidgetConfig;
  onClick: () => void;
  surveySchema: any;
  surveyResponses: any[];
}

const DashboardCell = ({ config, onClick, surveySchema, surveyResponses }: DashboardCellProps) => {
  if (!config) {
    return (
      <div
        onClick={onClick}
        className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="text-center text-gray-500">
          <span className="text-4xl block mb-2">+</span>
          <span className="text-sm font-medium">Add Chart</span>
        </div>
      </div>
    );
  }

  // We need to adapt the config to what DynamicSurveyPivot expects unless we refactor it.
  // For now, let's wrap it or assume DynamicSurveyPivot can take overrides.
  // Actually, DynamicSurveyPivot manages its own state for selection. 
  // We should ideally pass props to it to controlled mode, OR refactor it.
  // Given the instruction to reuse it:
  
  // NOTE: PivotTable currently has internal state. We will need to refactor it or
  // pass an "initialConfig" or "controlledConfig" if we want it to display what we selected.
  // For this step, I'll pass the whole component, but strictly we might need to modify PivotTable 
  // to accept `preSelectedQuestion` etc.
  
  // Let's assume for this MVP step we are just mounting it. 
  // However, DynamicSurveyPivot as written is an interactive explorer.
  // To make it a "Display Widget", we likely need to pass props to lock it or preset it.
  
  return (
    <div className="bg-white p-4 shadow rounded-lg h-64 overflow-hidden relative group min-w-0 w-full">
       {/* 
         TODO: PivotTable needs to support "controlled" mode to show the specific chart 
         defined in `config`. I will need to edit PivotTable to accept `config` prop.
       */}
       <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button onClick={onClick} className="bg-gray-200 p-1 rounded text-xs">Edit</button>
       </div>
       
       <DynamicSurveyPivot 
            surveySchema={surveySchema} 
            surveyResponses={surveyResponses}
            // Passing these in creates a "preset" if generic pivot supports it.
            // I will need to update PivotTable to accept these.
            activeConfig={config} 
       />
    </div>
  );
};

export default DashboardCell;
