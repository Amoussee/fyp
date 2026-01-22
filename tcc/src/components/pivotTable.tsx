import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import _ from 'lodash';

// Example of the list you created earlier
import { CHART_TYPES, type ChartType } from '@/lib/chartConstants';

const DynamicSurveyPivot = ({ surveySchema, surveyResponses }) => {
    // 1. User Selections
    const [selectedQuestion, setSelectedQuestion] = useState(''); // e.g., "q1"
    const [calculationType, setCalculationType] = useState<'count' | 'average' | 'sum'>('count');
    const [selectedChart, setSelectedChart] = useState<ChartType>('Grouped Bar Chart');

    // 2. Extract Question List from the Survey Schema
    const questions = useMemo(() => {
        // Assuming schema_json follows a { fields: [{ id: 'q1', label: 'Age' }] } structure
        return surveySchema?.fields || [];
    }, [surveySchema]);

    // 3. Transform and Aggregate Data
    const chartData = useMemo(() => {
        if (!selectedQuestion) return [];

        // Extract the specific answer from every response
        const rawAnswers = surveyResponses.map(r => ({
            value: r.responses[selectedQuestion],
        }));

        if (calculationType === 'count') {
            // Group by the answer value and count occurrences
            const counts = _.countBy(rawAnswers, 'value');
            return Object.entries(counts).map(([name, total]) => ({
                name: name === 'undefined' ? 'No Answer' : name,
                total: total
            }));
        }

        if (calculationType === 'average' || calculationType === 'sum') {
            // Logic for numeric questions
            const sum = _.sumBy(rawAnswers, (o) => Number(o.value) || 0);
            return [{ name: 'Total/Avg', total: calculationType === 'sum' ? sum : sum / rawAnswers.length }];
        }

        return [];
    }, [surveyResponses, selectedQuestion, calculationType]);

    return (
        <div className="flex flex-col gap-6 p-4">
            <div className="grid grid-cols-3 gap-4 bg-white p-4 shadow rounded-lg">
                {/* Dropdown: Choose Question */}
                <div>
                    <label className="block text-sm font-medium">Choose Question to Reflect</label>
                    <select
                        className="mt-1 w-full p-2 border rounded"
                        onChange={(e) => setSelectedQuestion(e.target.value)}
                    >
                        <option value="">Select a question...</option>
                        {questions.map(q => (
                            <option key={q.id} value={q.id}>{q.label}</option>
                        ))}
                    </select>
                </div>

                {/* Dropdown: Choose Calculation */}
                <div>
                    <label className="block text-sm font-medium">Aggregate By</label>
                    <select
                        className="mt-1 w-full p-2 border rounded"
                        onChange={(e) => setCalculationType(e.target.value as any)}
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
                        {CHART_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
            </div>

            {/* Dynamic Chart Display */}
            <div className="h-96 bg-white p-6 shadow rounded-lg">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="total" fill="#8884d8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        Select a question to visualize data
                    </div>
                )}
            </div>
        </div>
    );
};

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