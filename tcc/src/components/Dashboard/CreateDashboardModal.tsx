import React, { useState } from 'react';
import { DashboardLayoutType } from '../../types/dashboard';

interface CreateDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, layout: DashboardLayoutType) => void;
}

const CreateDashboardModal = ({ isOpen, onClose, onCreate }: CreateDashboardModalProps) => {
  const [name, setName] = useState('');
  const [layout, setLayout] = useState<DashboardLayoutType>('layout-2');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim(), layout);
      setName('');
      setLayout('layout-2');
      onClose();
    }
  };

  const renderLayoutOption = (
    type: DashboardLayoutType,
    title: string,
    description: string,
    visual: React.ReactNode,
  ) => (
    <div
      onClick={() => setLayout(type)}
      className={`cursor-pointer rounded-xl border-2 p-4 transition-all hover:border-indigo-300 ${
        layout === type
          ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
          : 'border-gray-200 bg-white'
      }`}
    >
      <div className="h-20 bg-gray-100 rounded mb-3 p-1.5 flex items-center justify-center">
        {visual}
      </div>
      <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
      <p className="text-xs text-gray-500 mt-0.5">{description}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white p-8 rounded-2xl w-[800px] shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Dashboard</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Dashboard Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Sales Overview"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              autoFocus
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Select Grid Layout
            </label>
            <div className="grid grid-cols-4 gap-4">
              {/* Layout 1 */}
              {renderLayoutOption(
                'layout-1',
                'Single Focus',
                '1 Big Chart',
                <div className="w-full h-full bg-gray-300 rounded border border-gray-400"></div>,
              )}

              {/* Layout 2 */}
              {renderLayoutOption(
                'layout-2',
                'Split View',
                '2 Charts',
                <div className="w-full h-full grid grid-cols-2 gap-1.5">
                  <div className="bg-gray-300 rounded border border-gray-400"></div>
                  <div className="bg-gray-300 rounded border border-gray-400"></div>
                </div>,
              )}

              {/* Layout 3 */}
              {renderLayoutOption(
                'layout-3',
                'Three Column',
                '3 Charts',
                <div className="w-full h-full grid grid-cols-3 gap-1">
                  <div className="bg-gray-300 rounded border border-gray-400"></div>
                  <div className="bg-gray-300 rounded border border-gray-400"></div>
                  <div className="bg-gray-300 rounded border border-gray-400"></div>
                </div>,
              )}

              {/* Layout 4 */}
              {renderLayoutOption(
                'layout-4',
                'Quad Grid',
                '4 Charts (2x2)',
                <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1.5">
                  <div className="bg-gray-300 rounded border border-gray-400"></div>
                  <div className="bg-gray-300 rounded border border-gray-400"></div>
                  <div className="bg-gray-300 rounded border border-gray-400"></div>
                  <div className="bg-gray-300 rounded border border-gray-400"></div>
                </div>,
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
            >
              Create Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDashboardModal;
