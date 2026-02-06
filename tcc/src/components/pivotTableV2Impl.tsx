'use client';

import React, { useState, useEffect } from 'react';
import PivotTableUI from './react-pivottable/PivotTableUI';
import PivotTable from './react-pivottable/PivotTable'; // <-- Import PivotTable for read-only mode
import * as PivotUtils from './react-pivottable/Utilities';
import createPlotlyRenderers from './react-pivottable/PlotlyRenderers';
// import { aggregators } from './react-pivottable/Utilities'; // hi amos it's here
import TableRenderers from './react-pivottable/TableRenderers';
import Plot from 'react-plotly.js';
import './react-pivottable/pivottable.css';

const PlotlyRenderers = createPlotlyRenderers(Plot);
export const allRenderers = Object.assign({}, TableRenderers, PlotlyRenderers);
const fetchedAggregators = PivotUtils.aggregators; // Correctly access exported aggregators

// Helper to remove non-serializable/dangerous props from state
interface PivotState {
  cols?: string[];
  rows?: string[];
  aggregatorName?: string;
  rendererName?: string;
  [key: string]: unknown;
}

const cleanState = (state: unknown): PivotState | unknown => {
  if (!state || typeof state !== 'object') return state;
  const { ...rest } = state as Record<string, unknown>;
  delete rest.data;
  delete rest.renderers;
  delete rest.onChange;
  delete rest.aggregators;
  return rest;
};

interface PivotTableV2Props {
  data?: unknown[]; // or any valid type for data
  onSave?: (state: unknown) => void;
  onCancel?: () => void;
  readOnly?: boolean; // <-- Re-added readOnly prop
  initialState?: unknown;
}

// ... unchanged code ...

export default function PivotTableV2({
  data = [
    ['attribute', 'attribute2'],
    ['value1', 'value2'],
  ],
  onSave,
  onCancel,
  readOnly = false, // <-- Set default value for readOnly
  initialState,
}: PivotTableV2Props) {
  const cleanedInitial = cleanState(initialState) as PivotState;

  const [pivotState, setPivotState] = useState<PivotState>(
    cleanedInitial || {
      rendererName: 'Grouped Column Chart', // Start with a chart
    },
  );

  console.log('DEBUG: ReadOnly?', readOnly);
  console.log('DEBUG: pivotState keys:', Object.keys(pivotState));
  console.log('DEBUG: cols:', pivotState.cols);
  console.log('DEBUG: rows:', pivotState.rows);
  console.log('DEBUG: rendererName:', pivotState.rendererName);

  // Sanitize aggregatorName to prevent crashes
  const safePivotState = { ...pivotState };

  // IMPORTANT: Remove aggregators from the state object we pass down.
  // The saved state often has { aggregators: {} }, which overrides the valid aggregators prop.
  delete safePivotState.aggregators;

  // If aggregatorName is missing OR strictly invalid
  if (
    !safePivotState.aggregatorName ||
    (fetchedAggregators && !(safePivotState.aggregatorName in fetchedAggregators))
  ) {
    console.warn(
      `Invalid aggregatorName: "${safePivotState.aggregatorName}". Falling back to "Count".`,
    );
    safePivotState.aggregatorName = 'Count';
  }

  // Helper function to get a dynamic chart title
  const getChartTitle = () => {
    const rows = safePivotState.rows || [];
    const cols = safePivotState.cols || [];

    if (rows.length && cols.length) return `${rows.join(', ')} vs ${cols.join(', ')}`;
    if (cols.length) return `Distribution by ${cols.join(', ')}`;
    if (rows.length) return `Distribution by ${rows.join(', ')}`;
    return 'Survey Data Visualization';
  };

  // Define common Plotly layout and config settings for reusability
  const commonPlotlyLayout = {
    // Title validation removed from chart
    xaxis: {
      title: {
        text: safePivotState.cols?.join(', ') || 'Attributes',
        font: { size: 12 },
      },
      automargin: true,
      tickfont: { size: 11 },
    },
    yaxis: {
      title: {
        text: safePivotState.rows?.join(', ') || 'Values',
        font: { size: 12 },
      },
      automargin: true,
      tickfont: { size: 11 },
    },
    // IMPORTANT: Ensure sufficient margins for titles and legends
    margin: { t: 80, b: 100, l: 80, r: 40 }, // Increased bottom margin for legend
    showlegend: true, // Make sure legend is shown
    legend: {
      orientation: 'h', // Horizontal legend
      y: -0.25, // Position below x-axis
      x: 0.5,
      xanchor: 'center',
      font: { size: 10 },
    },
    hovermode: 'closest', // Ensure tooltips are enabled on hover
  };

  const commonPlotlyConfig = {
    responsive: true,
    displayModeBar: true, // Show mode bar in edit mode
    displaylogo: false,
  };

  useEffect(() => {
    if (initialState) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPivotState(cleanState(initialState) as PivotState);
    }
  }, [initialState]);

  // --- READ ONLY MODE (Dashboard View) ---
  if (readOnly) {
    return (
      <div className="flex flex-col h-full w-full overflow-hidden dashboard-modebar-left">
        <h2 className="flex-none font-bold text-gray-700 text-sm text-ellipsis overflow-hidden whitespace-nowrap px-2 mb-2 text-center">
          {getChartTitle()}
        </h2>
        <div className="flex-grow min-h-0 w-full relative">
          <PivotTable // Renders the final chart without UI controls
            data={data}
            renderers={allRenderers}
            {...safePivotState}
            aggregators={fetchedAggregators}
            aggregatorName={safePivotState.aggregatorName || 'Count'}
            rendererOptions={{
              plotly: {
                layout: {
                  ...commonPlotlyLayout, // Apply common layout
                  autosize: true, // IMPORTANT: Let Plotly autosize to the container
                  // For read-only, you might want smaller font sizes or less interactivity
                  xaxis: { ...commonPlotlyLayout.xaxis, tickfont: { size: 10 } },
                  yaxis: { ...commonPlotlyLayout.yaxis, tickfont: { size: 10 } },
                  legend: { ...commonPlotlyLayout.legend, font: { size: 10 }, y: -0.2 },
                  margin: { t: 50, b: 80, l: 50, r: 20 }, // Margins restored for Legend + Toolbar
                },
                config: {
                  ...commonPlotlyConfig, // Apply common config
                  // staticPlot: true, // REMOVED: Caused rendering mismatches
                  displayModeBar: true, // SHOW mode bar in dashboard as requested
                },
                style: { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }, // Absolute positioning to force fit
              },
            }}
          />
        </div>
      </div>
    );
  }

  // --- EDIT MODE (Popup Creation) ---
  return (
    <div className="flex flex-col gap-4 w-full min-w-[1000px]">
      <h3 className="text-lg font-bold text-gray-800 mb-2 px-2">{getChartTitle()}</h3>
      <PivotTableUI // Renders the pivot table UI with controls
        data={data}
        renderers={allRenderers}
        {...safePivotState}
        aggregators={fetchedAggregators}
        onChange={(s: unknown) => {
          setPivotState(cleanState(s) as PivotState);
        }}
        rendererOptions={{
          // ALL PLOTLY CONFIGURATION GOES INSIDE rendererOptions
          plotly: {
            layout: {
              ...commonPlotlyLayout, // Apply common layout
              height: 650, // Specific height for edit view
              autosize: true,
            },
            config: {
              ...commonPlotlyConfig, // Apply common config
            },
          },
        }}
      />

      {(onSave || onCancel) && (
        <div className="flex justify-end gap-3 mt-4 border-t pt-4">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          {onSave && (
            <button
              onClick={() => onSave(safePivotState)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md transition-colors"
            >
              Confirm Selection
            </button>
          )}
        </div>
      )}
    </div>
  );
}