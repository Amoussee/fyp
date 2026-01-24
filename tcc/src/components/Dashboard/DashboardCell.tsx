import React from 'react';
import { WidgetConfig } from '../../types/dashboard';
import PivotTableV2 from '../pivotTableV2';

interface DashboardCellProps {
  config?: WidgetConfig;
  onClick: () => void;
  surveySchema: any;
  surveyResponses: any[];
}

const DashboardCell = ({ config, onClick, surveySchema, surveyResponses }: DashboardCellProps) => {
  // Flatten data for PivotTable
  const flatData = React.useMemo(() => {
    return surveyResponses.map(r => {
        const row: any = {};
        surveySchema.fields.forEach((f: any) => {
            row[f.label] = (r.responses as Record<string, any>)[f.id];
        });
        return row;
    });
  }, [surveyResponses, surveySchema]);

  if (!config) {
    return (
      <div
        onClick={onClick}
        className="flex items-center justify-center h-[500px] border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-indigo-300 transition-all duration-300 group"
      >
        <div className="text-center text-gray-400 group-hover:text-indigo-500">

          <span className="text-5xl block mb-3 font-light">+</span>
          <span className="text-sm font-semibold tracking-wide uppercase">Add Chart</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-2 shadow-xl rounded-2xl h-[500px] overflow-hidden relative group border border-gray-100 hover:shadow-2xl transition-all duration-300">

       <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-2">

          <button onClick={onClick} className="bg-white/80 backdrop-blur-sm shadow-sm p-1.5 rounded-md text-xs hover:bg-indigo-50 hover:text-indigo-600 transition-all font-semibold">
            Edit
          </button>
       </div>
       
       <div className="h-full w-full">
         <PivotTableV2 
              data={flatData}
              readOnly={true}
              initialState={config.pivotState}
         />
       </div>
    </div>
  );
};


export default DashboardCell;
