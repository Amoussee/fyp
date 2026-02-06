'use client';

import { useState, useEffect } from 'react';

export interface SurveyTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  questionCount: number;
  estimatedTime: string;
}

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: SurveyTemplate) => void;
}

// Mock templates data
const templates: SurveyTemplate[] = [
  {
    id: 't1',
    name: 'Student Wellbeing Survey',
    description: 'Assess student mental health, stress levels, and overall wellbeing',
    category: 'Student',
    questionCount: 15,
    estimatedTime: '5-7 min',
  },
  {
    id: 't2',
    name: 'Parent Satisfaction Survey',
    description: 'Gather feedback on school programs, communication, and facilities',
    category: 'Parent',
    questionCount: 12,
    estimatedTime: '4-6 min',
  },
  {
    id: 't3',
    name: 'Academic Performance Feedback',
    description: 'Collect insights on teaching methods and academic support',
    category: 'Student',
    questionCount: 18,
    estimatedTime: '7-9 min',
  },
  {
    id: 't4',
    name: 'School Climate Assessment',
    description: 'Evaluate school culture, safety, and community engagement',
    category: 'Public - Parent',
    questionCount: 20,
    estimatedTime: '8-10 min',
  },
  {
    id: 't5',
    name: 'Extracurricular Activities Interest',
    description: 'Understand student preferences for clubs and activities',
    category: 'Public - Student',
    questionCount: 10,
    estimatedTime: '3-5 min',
  },
  {
    id: 't6',
    name: 'Parent-Teacher Communication',
    description: 'Assess effectiveness of school-home communication channels',
    category: 'Parent',
    questionCount: 14,
    estimatedTime: '5-7 min',
  },
];

// Usage example in your page:
// const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
//
// <SurveyList
//   onUseTemplate={() => setIsTemplateModalOpen(true)}
//   ...
// />
// <TemplateModal
//   isOpen={isTemplateModalOpen}
//   onClose={() => setIsTemplateModalOpen(false)}
//   onSelectTemplate={(template) => console.log("Selected:", template)}
// />

export function SurveyTemplateList({ isOpen, onClose, onSelectTemplate }: TemplateModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = ['all', ...Array.from(new Set(templates.map((t) => t.category)))];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DAE0DB]">
          <div>
            <h2 className="text-xl font-semibold text-[#111827]">Choose a Template</h2>
            <p className="text-sm text-[#6C8270] mt-0.5">
              Select a pre-built survey template to get started quickly
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#6C8270] hover:text-[#111827] hover:bg-[#F8FCF9] rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="px-6 py-4 border-b border-[#DAE0DB] space-y-3">
          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6C8270]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#DAE0DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50ab72] focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#50ab72] text-white'
                    : 'bg-[#F8FCF9] text-[#6C8270] hover:bg-[rgba(11,187,7,0.1)]'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg
                className="w-16 h-16 text-[#DAE0DB] mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-[#6C8270] font-medium">No templates found</p>
              <p className="text-sm text-[#6C8270]/70 mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    onSelectTemplate(template);
                    onClose();
                  }}
                  className="text-left p-4 border border-[#DAE0DB] rounded-lg hover:border-[#50ab72] hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-[#111827] group-hover:text-[#50ab72] transition-colors">
                      {template.name}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-[rgba(11,187,7,0.1)] text-[#50ab72] rounded">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-sm text-[#6C8270] mb-3 line-clamp-2">{template.description}</p>
                  <div className="flex items-center gap-4 text-xs text-[#6C8270]">
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {template.questionCount} questions
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {template.estimatedTime}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#DAE0DB] bg-[#F8FCF9] rounded-b-xl">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#6C8270]">
              {filteredTemplates.length} {filteredTemplates.length === 1 ? 'template' : 'templates'}{' '}
              available
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-[#6C8270] hover:bg-white rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}