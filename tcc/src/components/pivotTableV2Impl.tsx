"use client";

import React, { useState, useEffect } from 'react';
import PivotTableUI from './react-pivottable/PivotTableUI';
import PivotTable from './react-pivottable/PivotTable'; // <-- Import PivotTable for read-only mode
import createPlotlyRenderers from './react-pivottable/PlotlyRenderers';
import TableRenderers from './react-pivottable/TableRenderers';
import Plot from 'react-plotly.js';
import './react-pivottable/pivottable.css';

// create the renderers and pass them to the PivotTableUI
const PlotlyRenderers = createPlotlyRenderers(Plot);
export const allRenderers = Object.assign({}, TableRenderers, PlotlyRenderers);

// Helper to remove non-serializable/dangerous props from state
const cleanState = (state: any) => {
  if (!state) return state;
  const { data, renderers, onChange, ...rest } = state;
  return rest;
};

interface PivotTableV2Props {
  data?: any[];
  onSave?: (state: any) => void;
  onCancel?: () => void;
  readOnly?: boolean; // <-- Re-added readOnly prop
  initialState?: any;
}

export default function PivotTableV2({ 
    data = [['attribute', 'attribute2'], ['value1', 'value2']], 
    onSave, 
    onCancel,
    readOnly = false, // <-- Set default value for readOnly
    initialState
}: PivotTableV2Props) {
    const [pivotState, setPivotState] = useState<any>(cleanState(initialState) || {
        rendererName: 'Grouped Column Chart', // Start with a chart
    });

    // Debugging pivot state to check why titles are not showing
    console.log('DEBUG: pivotState', pivotState);

    // Helper function to get a dynamic chart title
    const getChartTitle = () => {
        const rows = pivotState.rows || [];
        const cols = pivotState.cols || [];
        
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
                text: pivotState.cols?.join(', ') || 'Attributes',
                font: { size: 12 }
            },
            automargin: true,
            tickfont: { size: 11 }
        },
        yaxis: { 
            title: { 
                text: pivotState.rows?.join(', ') || 'Values',
                font: { size: 12 }
            },
            automargin: true,
            tickfont: { size: 11 }
        },
        // IMPORTANT: Ensure sufficient margins for titles and legends
        margin: { t: 80, b: 100, l: 80, r: 40 }, // Increased bottom margin for legend
        showlegend: true, // Make sure legend is shown
        legend: { 
            orientation: 'h', // Horizontal legend
            y: -0.25,         // Position below x-axis
            x: 0.5, 
            xanchor: 'center',
            font: { size: 10 }
        },
    };

    const commonPlotlyConfig = {
        responsive: true,
        displayModeBar: true, // Show mode bar in edit mode
        displaylogo: false
    };

    useEffect(() => {
        if (initialState) {
            setPivotState(cleanState(initialState));
        }
    }, [initialState]);

    const handleChange = (s: any) => {
        const { ...rest } = s;
        setPivotState(rest);
    };

    // --- READ ONLY MODE (Dashboard View) ---
    if (readOnly) {
        return (
            <div className="flex justify-center mb-2 px-2">
                <h2 className="max-w-full font-bold text-gray-700 text-sm text-ellipsis overflow-hidden whitespace-nowrap">
                    {getChartTitle()}
                </h2>
                <PivotTable // Renders the final chart without UI controls
                    data={data}
                    renderers={allRenderers}
                    {...pivotState}
                    rendererOptions={{
                        plotly: { 
                            layout: {
                                ...commonPlotlyLayout, // Apply common layout
                                height: 420, // Increased height for better visibility
                                autosize: true,
                                // For read-only, you might want smaller font sizes or less interactivity
                                xaxis: { ...commonPlotlyLayout.xaxis, tickfont: { size: 10 } },
                                yaxis: { ...commonPlotlyLayout.yaxis, tickfont: { size: 10 } },
                                legend: { ...commonPlotlyLayout.legend, font: { size: 10 }, y: -0.2 }, 
                                margin: { t: 40, b: 100, l: 70, r: 20 }, // Optimized margins
                            },
                            config: {
                                ...commonPlotlyConfig, // Apply common config
                                staticPlot: true, // Usually true for dashboard view
                                displayModeBar: false, // Hide mode bar in read-only
                            },
                            style: { width: '100%', height: '100%' } // Force full width/height
                        }
                    }}

                />
            </div>
        );
    }

    // --- EDIT MODE (Popup Creation) ---
    return (
        <div className="flex flex-col gap-4 w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-2 px-2">
                {getChartTitle()}
            </h3>
            <PivotTableUI // Renders the pivot table UI with controls

                data={data}
                renderers={allRenderers}
                onChange={(s: any) => {
                    setPivotState(cleanState(s));
                }}
                {...pivotState}
                rendererOptions={{ // ALL PLOTLY CONFIGURATION GOES INSIDE rendererOptions
                    plotly: { 
                        layout: {
                            ...commonPlotlyLayout, // Apply common layout
                            height: 450, // Specific height for edit view
                            autosize: true
                        },
                        config: {
                            ...commonPlotlyConfig, // Apply common config
                        }
                    }
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
                            onClick={() => onSave(pivotState)}
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
