'use client'

import React, { useState } from 'react'
import {
  LayoutDashboard,
  Edit,
  Trash2,
  Search,
  FileText,
  ChevronDown,
} from 'lucide-react'

interface Survey {
  id: string
  name: string
  createdDate: string
  completedUsers: number
  totalUsers: number
  status: 'Pending' | 'Ready' | 'Closed'
}

export function SurveyList() {
  const [surveys, setSurveys] = useState<Survey[]>([
    {
      id: '1',
      name: 'Poi Ching School',
      createdDate: 'Dec 12 2025',
      completedUsers: 145,
      totalUsers: 200,
      status: 'Ready',
    },
    {
      id: '2',
      name: 'Poi Ching School',
      createdDate: 'Dec 12 2025',
      completedUsers: 145,
      totalUsers: 200,
      status: 'Ready',
    },
  ])

  const statusColor = (status: Survey['status']) => {
    if (status === 'Ready') return 'text-green-600'
    if (status === 'Pending') return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="max-w-4xl mx-auto bg-white border rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Survey List
        </h2>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              placeholder="Search"
              className="pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none"
            />
          </div>

          <button className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-md text-sm">
            New Survey
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Survey list */}
      <div className="space-y-3">
        {surveys.map((survey) => (
          <div
            key={survey.id}
            className="flex items-center justify-between bg-gray-50 rounded-lg px-5 py-4"
          >
            {/* Left */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-md flex items-center justify-center">
                <FileText size={18} className="text-green-700" />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900">
                  {survey.name}
                </p>
                <p className="text-xs text-gray-500">
                  {survey.createdDate}
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-gray-700">
                  {survey.completedUsers} responses
                </p>
                <p
                  className={`text-xs font-medium ${statusColor(
                    survey.status
                  )}`}
                >
                  Complete
                </p>
              </div>

              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-200 rounded">
                  <LayoutDashboard size={16} />
                </button>
                <button className="p-2 hover:bg-gray-200 rounded">
                  <Edit size={16} />
                </button>
                <button
                  onClick={() =>
                    setSurveys((prev) =>
                      prev.filter((s) => s.id !== survey.id)
                    )
                  }
                  className="p-2 hover:bg-red-100 rounded text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
