'use client';

import { useState } from 'react';

interface VisualizationCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

function VisualizationCard({ title, children, className = '' }: VisualizationCardProps) {
  return (
    <div className={`bg-white border-2 border-emerald-600 rounded-xl p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="w-full h-full">{children}</div>
    </div>
  );
}

// Mock data
const mockCompletionData = {
  completed: 145,
  total: 200,
  percentage: 72.5,
};

const mockResponseDistribution = [
  { label: 'Q1', value: 85, color: 'from-pink-400 to-pink-300' },
  { label: 'Q2', value: 60, color: 'from-emerald-400 to-emerald-300' },
  { label: 'Q3', value: 95, color: 'from-amber-400 to-amber-300' },
];

const mockTimelineData = [
  { date: 'Mon', responses: 20 },
  { date: 'Tue', responses: 35 },
  { date: 'Wed', responses: 28 },
  { date: 'Thu', responses: 42 },
  { date: 'Fri', responses: 38 },
  { date: 'Sat', responses: 15 },
  { date: 'Sun', responses: 12 },
];

const mockCategoryData = [
  { category: 'Primary 1', value: 35, color: 'bg-blue-500' },
  { category: 'Primary 2', value: 40, color: 'bg-emerald-500' },
  { category: 'Primary 3', value: 25, color: 'bg-amber-500' },
];

const mockSentimentData = [
  { label: 'Positive', value: 65, color: 'bg-emerald-500' },
  { label: 'Neutral', value: 25, color: 'bg-gray-400' },
  { label: 'Negative', value: 10, color: 'bg-red-500' },
];

type CategoryDatum = {
  category: string;
  value: number;
  color: string; // tailwind class like "bg-emerald-500"
};

interface PieChartProps {
  data: CategoryDatum[];
}

interface CompletionChartProps {
  data: typeof mockCompletionData;
}

function CompletionChart({ data }: CompletionChartProps) {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="relative">
        <svg className="w-48 h-48 transform -rotate-90">
          <circle cx="96" cy="96" r="80" stroke="#e5e7eb" strokeWidth="16" fill="none" />
          <circle
            cx="96"
            cy="96"
            r="80"
            stroke="url(#gradient)"
            strokeWidth="16"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 80 * (data.percentage / 100)} ${2 * Math.PI * 80}`}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{data.percentage}%</div>
            <div className="text-sm text-gray-600 mt-1">Completed</div>
            <div className="text-xs text-gray-500 mt-1">
              {data.completed}/{data.total}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface BarChartProps {
  data: typeof mockResponseDistribution;
}

function BarChart({ data }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex items-end justify-center gap-6 h-48 px-4">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center gap-2 flex-1">
          <div
            className={`w-full bg-gradient-to-t ${item.color} rounded-t-lg transition-all hover:opacity-80`}
            style={{ height: `${(item.value / maxValue) * 100}%` }}
          ></div>
          <span className="text-sm font-medium text-gray-600">{item.label}</span>
          <span className="text-xs text-gray-500">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

interface LineChartProps {
  data: typeof mockTimelineData;
}

function LineChart({ data }: LineChartProps) {
  const maxValue = Math.max(...data.map((d) => d.responses));
  const points = data
    .map((item, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (item.responses / maxValue) * 80;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="h-48 w-full">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <polyline
          points={points}
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          className="drop-shadow-sm"
        />
        {data.map((item, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = 100 - (item.responses / maxValue) * 80;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="2" fill="#10b981" />
              <text x={x} y="98" fontSize="4" textAnchor="middle" fill="#6b7280">
                {item.date}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

type PieSlice = {
  item: CategoryDatum;
  endAngle: number;
  largeArc: 0 | 1;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

function PieChart({ data }: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const slices: PieSlice[] = data.reduce<PieSlice[]>((acc, item) => {
    const prevEnd = acc.length ? acc[acc.length - 1].endAngle : 0;

    const angle = total === 0 ? 0 : (item.value / total) * 360;

    const startAngle = prevEnd;
    const endAngle = prevEnd + angle;

    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);

    const largeArc: 0 | 1 = angle > 180 ? 1 : 0;

    return [...acc, { item, endAngle, largeArc, x1, y1, x2, y2 }];
  }, []);

  return (
    <div className="flex items-center justify-center gap-8 h-48">
      <svg viewBox="0 0 100 100" className="w-40 h-40">
        {slices.map(({ item, largeArc, x1, y1, x2, y2 }, i) => (
          <path
            key={i}
            d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
            className={item.color}
            opacity="0.9"
          />
        ))}
      </svg>

      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.category} className="flex items-center gap-2 text-sm">
            <div className={`w-3 h-3 rounded ${item.color}`} />
            <span className="text-gray-700">
              {item.category}: {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface HorizontalBarChartProps {
  data: typeof mockSentimentData;
}

function HorizontalBarChart({ data }: HorizontalBarChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-4 p-4">
      {data.map((item, i) => (
        <div key={i} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700 font-medium">{item.label}</span>
            <span className="text-gray-600">{item.value}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`${item.color} h-3 rounded-full transition-all`}
              style={{ width: `${(item.value / total) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function VisualisationDashboard() {
  const [selectedSurvey] = useState('Poi Ching School Carbon Emissions');

  return (
    <main className="min-h-screen bg-gray-50 w-full">
      <div className="bg-white border-b border-gray-200">
        <div className="w-full px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{selectedSurvey}</h1>
              <p className="text-sm text-gray-500 mt-1">Survey Dashboard & Analytics</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Export Data
              </button>
              <button className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Share Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Total Responses</p>
            <p className="text-3xl font-bold text-gray-900">145</p>
            <p className="text-xs text-emerald-600 mt-1">↑ 12% from last survey</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Response Rate</p>
            <p className="text-3xl font-bold text-gray-900">72.5%</p>
            <p className="text-xs text-emerald-600 mt-1">↑ 5% increase</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Avg. Completion Time</p>
            <p className="text-3xl font-bold text-gray-900">6.2m</p>
            <p className="text-xs text-gray-500 mt-1">Minutes per survey</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Survey Status</p>
            <p className="text-3xl font-bold text-emerald-600">Active</p>
            <p className="text-xs text-gray-500 mt-1">Closes in 5 days</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-blue-50 border-2 border-emerald-600 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Visualizations</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <VisualizationCard title="Completion Status">
              <CompletionChart data={mockCompletionData} />
            </VisualizationCard>

            <VisualizationCard title="Response Distribution">
              <BarChart data={mockResponseDistribution} />
            </VisualizationCard>

            <VisualizationCard title="Sentiment Analysis">
              <HorizontalBarChart data={mockSentimentData} />
            </VisualizationCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <VisualizationCard title="Response Timeline" className="h-80">
              <LineChart data={mockTimelineData} />
            </VisualizationCard>

            <VisualizationCard title="Category Breakdown" className="h-80">
              <PieChart data={mockCategoryData} />
            </VisualizationCard>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-gray-600">15 new responses today</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Survey shared with 3 teams</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-gray-600">Dashboard viewed 45 times</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Key Insights</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <span className="text-emerald-600">✓</span>
                <span className="text-gray-600">Response rate exceeds target by 22%</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-emerald-600">✓</span>
                <span className="text-gray-600">Peak response time: 2-4 PM</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-amber-600">!</span>
                <span className="text-gray-600">Low engagement from Primary 1 group</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
