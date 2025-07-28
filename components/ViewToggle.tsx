import React from 'react';
import { ListBulletIcon, MapIcon } from './IconComponents';

interface ViewToggleProps {
  viewMode: 'list' | 'map';
  setViewMode: (mode: 'list' | 'map') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, setViewMode }) => {
  return (
    <div className="inline-flex rounded-lg shadow-sm" role="group">
      <button
        type="button"
        onClick={() => setViewMode('list')}
        aria-pressed={viewMode === 'list'}
        className={`inline-flex items-center px-4 py-2 text-sm font-medium border rounded-l-lg transition-colors duration-150 ${
          viewMode === 'list'
            ? 'bg-green-700 text-white border-green-700 z-10 ring-2 ring-green-300'
            : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100'
        }`}
      >
        <ListBulletIcon className="w-5 h-5 mr-2" />
        รายการ
      </button>
      <button
        type="button"
        onClick={() => setViewMode('map')}
        aria-pressed={viewMode === 'map'}
        className={`inline-flex items-center px-4 py-2 text-sm font-medium border rounded-r-lg transition-colors duration-150 ${
          viewMode === 'map'
            ? 'bg-green-700 text-white border-green-700 z-10 ring-2 ring-green-300'
            : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100'
        }`}
      >
        <MapIcon className="w-5 h-5 mr-2" />
        แผนที่
      </button>
    </div>
  );
};

export default ViewToggle;
