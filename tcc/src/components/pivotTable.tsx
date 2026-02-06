import React, { useState, useMemo, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import _ from 'lodash';
import { WidgetConfig } from '../types/dashboard';

// Example of the list you created earlier
import { CHART_TYPES, type ChartType } from '../lib/surveyConstants';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#aa44cc', '#ff5555'];

interface SurveyField {
  id: string;
  label: string;
}

interface SurveySchema {
  fields: SurveyField[];
}

interface SurveyResponse {
  responses: Record<string, string | number | boolean | null>;
  [key: string]: unknown;
}

interface PivotProps {
  surveySchema?: SurveySchema;
  surveyResponses?: SurveyResponse[];
  activeConfig?: Omit<WidgetConfig, 'id'>; // Optional config to control the view
}

const DynamicSurveyPivot = ({ surveySchema, surveyResponses = [], activeConfig }: PivotProps) => {
  // 1. User Selections
  const [selectedQuestion, setSelectedQuestion] = useState(''); // e.g., "q1"
  const [calculationType, setCalculationType] = useState<'count' | 'average' | 'sum'>('count');
  const [selectedChart, setSelectedChart] = useState<ChartType>('Grouped Bar Chart');

  const setChartType = (type: ChartType) => {
    setSelectedChart(type);
  };

  // Sync with activeConfig if provided
  useEffect(() => {
    if (activeConfig) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedQuestion(activeConfig.questionId);
      setCalculationType(activeConfig.aggregation);
      setChartType(activeConfig.chartType);
    }
  }, [activeConfig]);

  // 2. Extract Question List from the Survey Schema
  const questions = useMemo(() => {
    // Assuming schema_json follows a { fields: [{ id: 'q1', label: 'Age' }] } structure
    return surveySchema?.fields || [];
  }, [surveySchema]);

  // 3. Transform and Aggregate Data
  const chartData = useMemo(() => {
    if (!selectedQuestion) return [];

    // Extract the specific answer from every response
    const rawAnswers = surveyResponses.map((r) => ({
      value: r.responses[selectedQuestion],
    }));

    if (calculationType === 'count') {
      // Group by the answer value and count occurrences
      const counts = _.countBy(rawAnswers, 'value');
      return Object.entries(counts).map(([name, total]) => ({
        name: name === 'undefined' ? 'No Answer' : name,
        total: total,
      }));
    }

    if (calculationType === 'average' || calculationType === 'sum') {
      // Logic for numeric questions
      const sum = _.sumBy(rawAnswers, (o) => Number(o.value) || 0);
      return [
        { name: 'Total/Avg', total: calculationType === 'sum' ? sum : sum / rawAnswers.length },
      ];
    }

    return [];
  }, [surveyResponses, selectedQuestion, calculationType]);

  const renderChartContent = () => {
    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-xs text-gray-400">
          {selectedQuestion ? 'No Data' : 'Select a question'}
        </div>
      );
    }

    const commonProps = { width: '100%', height: '100%' };

    if (selectedChart.includes('Pie')) {
      return (
        <ResponsiveContainer {...commonProps}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={selectedChart.includes('Donut') ? 40 : 0} // Support Donut if we add it
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="total"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (selectedChart.includes('Line')) {
      return (
        <ResponsiveContainer {...commonProps}>
          <LineChart data={chartData}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (selectedChart.includes('Area')) {
      return (
        <ResponsiveContainer {...commonProps}>
          <AreaChart data={chartData}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Area type="monotone" dataKey="total" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    if (selectedChart.includes('Table')) {
      const totalCount = _.sumBy(chartData, 'total');
      return (
        <div className="overflow-auto max-h-full w-full border rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Option
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Count
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Freq (%)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {chartData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-right font-mono tabular-nums">
                    {row.total}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-right font-mono tabular-nums">
                    {totalCount > 0 ? ((row.total / totalCount) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
            {chartData.length > 1 && (
              <tfoot className="bg-gray-50 font-bold border-t-2">
                <tr>
                  <td className="px-4 py-2 text-sm text-gray-900 uppercase">Total</td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right font-mono tabular-nums">
                    {totalCount}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right font-mono tabular-nums">
                    100.0%
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      );
    }

    // Default to Bar/Column
    // "Grouped Bar Chart" usually implies horizontal bars
    // "Grouped Column Chart" usually implies vertical bars
    const isHorizontal = selectedChart.includes('Bar') && !selectedChart.includes('Column');

    return (
      <ResponsiveContainer {...commonProps}>
        <BarChart data={chartData} layout={isHorizontal ? 'vertical' : 'horizontal'}>
          <XAxis
            type={isHorizontal ? 'number' : 'category'}
            dataKey={isHorizontal ? undefined : 'name'}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            type={isHorizontal ? 'category' : 'number'}
            dataKey={isHorizontal ? 'name' : undefined}
            tick={{ fontSize: 12 }}
            width={isHorizontal ? 100 : 40} // More space for labels if vertical bars
          />
          <Tooltip />
          <Bar dataKey="total" fill="#8884d8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  // If activeConfig is present, we render ONLY the chart (Dashboard Mode)
  if (activeConfig) {
    return (
      <div className="w-full h-full p-2">
        <h3 className="text-center font-medium mb-2 text-sm text-gray-600">
          {questions.find((q) => q.id === selectedQuestion)?.label || selectedQuestion}
        </h3>
        <div className="h-full" style={{ minHeight: '150px' }}>
          {renderChartContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="grid grid-cols-3 gap-4 bg-white p-4 shadow rounded-lg">
        {/* Dropdown: Choose Question */}
        <div>
          <label className="block text-sm font-medium">Choose Question to Reflect</label>
          <select
            className="mt-1 w-full p-2 border rounded"
            onChange={(e) => setSelectedQuestion(e.target.value)}
            value={selectedQuestion}
          >
            <option value="">Select a question...</option>
            {questions.map((q) => (
              <option key={q.id} value={q.id}>
                {q.label}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown: Choose Calculation */}
        <div>
          <label className="block text-sm font-medium">Aggregate By</label>
          <select
            className="mt-1 w-full p-2 border rounded"
            onChange={(e) => setCalculationType(e.target.value as 'count' | 'average' | 'sum')}
            value={calculationType}
          >
            <option value="count">Count (Frequency)</option>
            <option value="sum">Sum (Numeric Only)</option>
            <option value="average">Average (Numeric Only)</option>
          </select>
        </div>

        {/* Dropdown: Chart Type */}
        <div>
          <label className="block text-sm font-medium">Chart Type</label>
          <select
            className="mt-1 w-full p-2 border rounded"
            value={selectedChart}
            onChange={(e) => setSelectedChart(e.target.value as ChartType)}
          >
            {CHART_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dynamic Chart Display */}
      <div className="h-96 bg-white p-6 shadow rounded-lg">{renderChartContent()}</div>
    </div>
  );
};

export default DynamicSurveyPivot;

//api
// -- Fetch responses alongside the user's role and organisation for breakdown
// SELECT
//     sr.response_id,
//     sr.responses,
//     u.role,
//     u.organisation,
//     sr.created_at
// FROM survey_responses sr
// JOIN users u ON sr.created_by = u.user_id
// WHERE sr.form_id = $1;
