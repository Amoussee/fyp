import React, { useState } from 'react';
import { WidgetConfig } from '../../types/dashboard';
import { ChartType, CHART_TYPES } from '../../lib/surveyConstants';

interface SurveyField {
  id: string;
  label: string;
}

interface ChartConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: Omit<WidgetConfig, 'id'>) => void;
  surveySchema: { fields: SurveyField[] };
}

const ChartConfigModal = ({ isOpen, onClose, onSave, surveySchema }: ChartConfigModalProps) => {
  const [questionId, setQuestionId] = useState('');
  const [chartType, setChartType] = useState<ChartType>('Grouped Bar Chart');
  const [aggregation, setAggregation] = useState<'count' | 'sum' | 'average'>('count');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!questionId) return;
    onSave({
      questionId,
      chartType,
      aggregation,
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
        <h2 className="text-xl font-bold mb-4">Configure Chart</h2>

        <div className="flex flex-col gap-4">
          {/* Question Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">Select Question</label>
            <select
              className="w-full p-2 border rounded"
              value={questionId}
              onChange={(e) => setQuestionId(e.target.value)}
            >
              <option value="">-- Select --</option>
              {surveySchema.fields.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {/* Aggregation Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">Aggregation</label>
            <select
              className="w-full p-2 border rounded"
              value={aggregation}
              onChange={(e) => setAggregation(e.target.value as 'count' | 'sum' | 'average')}
            >
              <option value="count">Count (Frequency)</option>
              <option value="sum">Sum (Numeric)</option>
              <option value="average">Average (Numeric)</option>
            </select>
          </div>

          {/* Chart Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">Chart Type</label>
            <select
              className="w-full p-2 border rounded"
              value={chartType}
              onChange={(e) => setChartType(e.target.value as ChartType)}
            >
              {CHART_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!questionId}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChartConfigModal;
