"use client";

import { useState } from "react";

interface VisualizationCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

function VisualizationCard({ title, children, className = "" }: VisualizationCardProps) {
  return (
    <div className={`bg-white border-2 border-teal-600 rounded-xl p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function PlaceholderChart({ type }: { type: string }) {
  return (
    <div className="w-full h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-2">📊</div>
        <p className="text-gray-500 text-sm font-medium">{type}</p>
        <p className="text-gray-400 text-xs mt-1">Placeholder</p>
      </div>
    </div>
  );
}

export function VisualisationDashboard() {
  const [selectedSurvey] = useState("Poi Ching School Carbon Emissions");

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{selectedSurvey}</h1>
              <p className="text-sm text-gray-500 mt-1">Survey Dashboard & Analytics</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Export Data
              </button>
              <button className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                Share Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
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

        {/* Visualizations Section */}
        <div className="bg-gradient-to-br from-teal-50 to-blue-50 border-2 border-teal-600 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Visualizations</h2>
          
          {/* Visualization Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Visual 1 - Circle Chart */}
            <VisualizationCard title="Completion Status">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-lg">
                    <div className="text-white text-center">
                      <div className="text-2xl font-bold">72.5%</div>
                      <div className="text-xs">Completed</div>
                    </div>
                  </div>
                </div>
              </div>
            </VisualizationCard>

            {/* Visual 2 - Bar Chart */}
            <VisualizationCard title="Response Distribution">
              <div className="flex items-end justify-center gap-3 h-40 w-full px-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 bg-gradient-to-t from-pink-400 to-pink-300 rounded-t-lg" style={{ height: '80%' }}></div>
                  <span className="text-xs text-gray-600">Q1</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 bg-gradient-to-t from-teal-400 to-teal-300 rounded-t-lg" style={{ height: '55%' }}></div>
                  <span className="text-xs text-gray-600">Q2</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-t-lg" style={{ height: '70%' }}></div>
                  <span className="text-xs text-gray-600">Q3</span>
                </div>
              </div>
            </VisualizationCard>

            {/* Visual 3 - Placeholder */}
            <VisualizationCard title="Visual 3">
              <div className="flex items-center justify-center h-40 w-full">
                <div className="text-center">
                  <div className="text-6xl mb-2">📈</div>
                  <p className="text-gray-400 text-sm">Chart Placeholder</p>
                </div>
              </div>
            </VisualizationCard>
          </div>

          {/* Additional Visualization Rows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <VisualizationCard title="Response Timeline" className="h-64">
              <PlaceholderChart type="Line Chart" />
            </VisualizationCard>

            <VisualizationCard title="Category Breakdown" className="h-64">
              <PlaceholderChart type="Pie Chart" />
            </VisualizationCard>
          </div>

          <div className="mt-6">
            <VisualizationCard title="Detailed Analytics" className="h-80">
              <PlaceholderChart type="Advanced Analytics" />
            </VisualizationCard>
          </div>
        </div>

        {/* Additional Info Section */}
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