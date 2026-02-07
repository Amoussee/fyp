'use client';

import { useState, useRef, useEffect } from 'react';

export type SurveyStatus = 'open' | 'ready' | 'closed' | 'draft';
export type SurveyType = 'Public - Parent' | 'Public - Student' | 'Parent' | 'Student';

export interface Survey {
  id: string;
  name: string;
  creationDate: string;
  labels: string[];
  completedCount: number;
  totalCount: number;
  type: SurveyType;
  status: SurveyStatus;
}

interface SurveyListProps {
  surveys: Survey[];
  maxLabelsToShow?: number;
  onNewSurvey?: () => void;
  onUseTemplate?: () => void;
  onDashboard?: (survey: Survey) => void;
  onEdit?: (survey: Survey) => void;
  onDelete?: (survey: Survey) => void;
  // ViewToggle props
  activeView?: 'published' | 'drafts';
  onViewChange?: (view: 'published' | 'drafts') => void;
  publishedCount?: number;
  draftsCount?: number;
}

const statusStyles: Record<SurveyStatus, string> = {
  open: 'bg-amber-100 text-amber-700',
  ready: 'bg-[rgba(11,187,7,0.2)] text-[#50ab72]',
  closed: 'bg-[#F8FCF9] text-[#6C8270]',
  draft: 'bg-blue-100 text-blue-700',
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

// Simple dropdown hook
function useDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return { isOpen, setIsOpen, ref };
}

function SurveyCard({
  survey,
  maxLabelsToShow = 2,
  onDashboard,
  onEdit,
  onDelete,
}: {
  survey: Survey;
  maxLabelsToShow: number;
  onDashboard?: (survey: Survey) => void;
  onEdit?: (survey: Survey) => void;
  onDelete?: (survey: Survey) => void;
}) {
  const { isOpen, setIsOpen, ref } = useDropdown();
  const visibleLabels = survey.labels.slice(0, maxLabelsToShow);
  const remainingLabels = survey.labels.length - maxLabelsToShow;

  return (
    <div className="flex items-center justify-between px-4 py-4 bg-white border border-[#DAE0DB] rounded-lg hover:border-[#6C8270] hover:shadow-sm transition-all">
      {/* Left section */}
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className="flex-shrink-0 w-10 h-10 bg-[rgba(11,187,7,0.1)] rounded-lg flex items-center justify-center">
          <svg
            className="w-5 h-5 text-[#50ab72]"
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
        </div>

        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium text-[#111827]">{survey.name}</h3>
            <span className="text-xs px-2 py-0.5 rounded bg-[#F8FCF9] text-[#6C8270]">
              {survey.type}
            </span>
          </div>

          <p className="text-sm text-[#6C8270]">{formatDate(survey.creationDate)}</p>

          {survey.labels.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mt-1">
              {visibleLabels.map((label, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-0.5 rounded bg-[rgba(11,187,7,0.1)] text-[#50ab72]"
                >
                  {label}
                </span>
              ))}
              {remainingLabels > 0 && (
                <span className="text-xs px-2 py-0.5 rounded bg-[#F8FCF9] text-[#6C8270]">
                  +{remainingLabels} others
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-6 flex-shrink-0">
        <div className="text-right">
          <p className="text-sm font-medium text-[#111827]">
            {survey.completedCount} / {survey.totalCount}
          </p>
          <p className="text-xs text-[#6C8270]">responses</p>
        </div>

        <span className={`text-xs px-2 py-1 rounded capitalize ${statusStyles[survey.status]}`}>
          {survey.status}
        </span>

        {/* Action dropdown */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-[#6C8270] hover:text-[#111827] hover:bg-[#F8FCF9] rounded-md"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-white border border-[#DAE0DB] rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  onDashboard?.(survey);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-[#111827] hover:bg-[#F8FCF9] flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                Dashboard
              </button>
              <button
                onClick={() => {
                  onEdit?.(survey);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-[#111827] hover:bg-[#F8FCF9] flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete?.(survey);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SurveyList({
  surveys,
  maxLabelsToShow = 2,
  onNewSurvey,
  onUseTemplate,
  onDashboard,
  onEdit,
  onDelete,
  activeView,
  onViewChange,
  publishedCount,
  draftsCount,
}: SurveyListProps) {
  const { isOpen, setIsOpen, ref } = useDropdown();

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#111827]">Survey List</h1>
          <p className="text-sm text-[#6C8270] mt-0.5">
            {surveys.length} {surveys.length === 1 ? 'survey' : 'surveys'} total
          </p>
        </div>

        {/* New Survey Dropdown */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-[#50ab72] hover:bg-[#50ab72]/90 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Survey
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-1 w-44 bg-white border border-[#DAE0DB] rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  onNewSurvey?.();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-[#111827] hover:bg-[#F8FCF9] flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New Survey
              </button>
              <button
                onClick={() => {
                  onUseTemplate?.();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-[#111827] hover:bg-[#F8FCF9] flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Use Templates
              </button>
            </div>
          )}
        </div>
      </div>

      {/* View Toggle - Show only if props are provided */}
      {activeView && onViewChange && publishedCount !== undefined && draftsCount !== undefined && (
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center bg-white border border-[#DAE0DB] rounded-full p-1.5 shadow-sm">
            <button
              onClick={() => onViewChange('published')}
              className={`
                px-5 py-2.5 text-sm font-medium rounded-full transition-all
                ${
                  activeView === 'published'
                    ? 'bg-[#50ab72] text-white shadow-md'
                    : 'text-[#6C8270] hover:text-[#111827] hover:bg-[#F8FCF9]'
                }
              `}
            >
              Published
              <span
                className={`
                ml-2 text-xs px-2.5 py-0.5 rounded-full font-semibold
                ${
                  activeView === 'published'
                    ? 'bg-[#50ab72]/80 text-white'
                    : 'bg-[#F8FCF9] text-[#6C8270]'
                }
              `}
              >
                {publishedCount}
              </span>
            </button>
            <button
              onClick={() => onViewChange('drafts')}
              className={`
                px-5 py-2.5 text-sm font-medium rounded-full transition-all
                ${
                  activeView === 'drafts'
                    ? 'bg-[#50ab72] text-white shadow-md'
                    : 'text-[#6C8270] hover:text-[#111827] hover:bg-[#F8FCF9]'
                }
              `}
            >
              Drafts
              <span
                className={`
                ml-2 text-xs px-2.5 py-0.5 rounded-full font-semibold
                ${
                  activeView === 'drafts'
                    ? 'bg-[#50ab72]/80 text-white'
                    : 'bg-[#F8FCF9] text-[#6C8270]'
                }
              `}
              >
                {draftsCount}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Survey List */}
      <div className="flex flex-col gap-3">
        {surveys.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white border border-[#DAE0DB] rounded-lg">
            <svg
              className="w-12 h-12 text-[#DAE0DB] mb-4"
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
            <p className="text-[#6C8270] font-medium">No surveys found</p>
            <p className="text-sm text-[#6C8270]/70 mt-1">Create a new survey to get started</p>
          </div>
        ) : (
          surveys.map((survey) => (
            <SurveyCard
              key={survey.id}
              survey={survey}
              maxLabelsToShow={maxLabelsToShow}
              onDashboard={onDashboard}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
