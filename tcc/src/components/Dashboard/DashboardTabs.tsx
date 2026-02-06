import React from 'react';
import { Dashboard } from '../../types/dashboard';

interface DashboardTabsProps {
  dashboards: Dashboard[];
  activeDashboardId: string;
  onSwitchDashboard: (id: string) => void;
  onAddDashboard: () => void;
}

const DashboardTabs = ({
  dashboards,
  activeDashboardId,
  onSwitchDashboard,
  onAddDashboard,
}: DashboardTabsProps) => {
  return (
    <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 border-b border-gray-200">
      {dashboards.map((dashboard) => (
        <button
          key={dashboard.id}
          onClick={() => onSwitchDashboard(dashboard.id)}
          className={`
                        px-4 py-2 rounded-t-lg font-medium text-sm transition-all duration-200 border-b-2
                        ${
                          activeDashboardId === dashboard.id
                            ? 'bg-white text-indigo-600 border-indigo-600 shadow-sm'
                            : 'bg-transparent text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
                        }
                    `}
        >
          {dashboard.name}
        </button>
      ))}

      <button
        onClick={onAddDashboard}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors ml-2"
        title="Create New Dashboard"
      >
        <span className="text-xl leading-none mb-0.5">+</span>
      </button>
    </div>
  );
};

export default DashboardTabs;