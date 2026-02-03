'use client';

interface ViewToggleProps {
  activeView: 'published' | 'drafts';
  onViewChange: (view: 'published' | 'drafts') => void;
  publishedCount: number;
  draftsCount: number;
}

export function ViewToggle({
  activeView,
  onViewChange,
  publishedCount,
  draftsCount,
}: ViewToggleProps) {
  return (
    <div className="inline-flex items-center bg-white border border-gray-200 rounded-full p-1.5 shadow-sm">
      <button
        onClick={() => onViewChange('published')}
        className={`
          px-5 py-2.5 text-sm font-medium rounded-full transition-all
          ${
            activeView === 'published'
              ? 'bg-teal-500 text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }
        `}
      >
        Published
        <span
          className={`
          ml-2 text-xs px-2.5 py-0.5 rounded-full font-semibold
          ${
            activeView === 'published'
              ? 'bg-teal-600 text-white'
              : 'bg-gray-100 text-gray-600'
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
              ? 'bg-teal-500 text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }
        `}
      >
        Drafts
        <span
          className={`
          ml-2 text-xs px-2.5 py-0.5 rounded-full font-semibold
          ${
            activeView === 'drafts' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600'
          }
        `}
        >
          {draftsCount}
        </span>
      </button>
    </div>
  );
}