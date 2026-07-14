import React from 'react';

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex space-x-4 space-x-reverse">
        {Array.from({ length: columns }).map((_, idx) => (
          <div key={idx} className="flex-1 animate-pulse">
            <div className="h-4 bg-slate-300 rounded w-1/2"></div>
          </div>
        ))}
      </div>
      
      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4 flex items-center space-x-4 space-x-reverse animate-pulse">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="flex-1">
                <div className={`h-3 bg-slate-200 rounded ${colIndex === 0 ? 'w-3/4' : 'w-full'}`}></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
