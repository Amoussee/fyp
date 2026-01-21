'use client'

import React, { useState } from 'react'
import {
  LayoutDashboard,
  Edit,
  Trash2
} from 'lucide-react'

// Types
interface Survey {
  id: string
  name: string
  createdDate: string
  labels: string[]
  completedUsers: number
  totalUsers: number
  type: 'Public - Parent' | 'Public - Student' | 'Parent'
  status: 'Pending' | 'Ready' | 'Closed'
}

export function SurveyList() {
  const [surveys, setSurveys] = useState<Survey[]>([
    {
      id: '1',
      name: 'Parent Feedback Survey',
      createdDate: '2024-01-10',
      labels: ['Feedback', 'Parents'],
      completedUsers: 45,
      totalUsers: 100,
      type: 'Public - Parent',
      status: 'Ready',
    },
    {
      id: '2',
      name: 'Student Wellbeing Survey',
      createdDate: '2024-01-15',
      labels: ['Wellbeing'],
      completedUsers: 30,
      totalUsers: 80,
      type: 'Public - Student',
      status: 'Pending',
    },
  ])

  const onDashboard = (id: string) => {
    console.log('Go to dashboard:', id)
    // later: router.push(`/surveys/${id}/dashboard`)
  }

  const onEdit = (id: string) => {
    console.log('Edit survey:', id)
  }

  const onDelete = (id: string) => {
    setSurveys((prev) => prev.filter((s) => s.id !== id))
  }

  const getStatusStyles = (status: Survey['status']) => {
    switch (status) {
      case 'Ready':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Closed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Survey Name</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Created Date</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Labels</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Completed</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Actions</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {surveys.map((survey) => (
            <tr key={survey.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900">{survey.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{survey.createdDate}</td>

              <td className="px-6 py-4">
                <div className="flex gap-1 flex-wrap">
                  {survey.labels.map((label, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </td>

              <td className="px-6 py-4 text-sm text-gray-600">
                {survey.completedUsers} / {survey.totalUsers}
              </td>

              <td className="px-6 py-4 text-sm text-gray-600">{survey.type}</td>

              <td className="px-6 py-4">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs ${getStatusStyles(survey.status)}`}
                >
                  {survey.status}
                </span>
              </td>

              <td className="px-6 py-4">
                <div className="flex justify-center gap-2">
                  <button onClick={() => onDashboard(survey.id)}>
                    <LayoutDashboard size={18} />
                  </button>
                  <button onClick={() => onEdit(survey.id)}>
                    <Edit size={18} />
                  </button>
                  <button onClick={() => onDelete(survey.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
