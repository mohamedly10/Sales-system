import React from 'react';

interface SkeletonListProps {
  count?: number;
}

export const SkeletonList: React.FC<SkeletonListProps> = ({ count = 3 }) => {
  return (
    <div className="w-full bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <div className="animate-pulse flex space-x-4 mb-6">
        <div className="h-6 bg-slate-200 rounded w-1/4"></div>
      </div>
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="flex items-center space-x-4 space-x-reverse animate-pulse">
            <div className="h-10 w-10 bg-slate-200 rounded-full shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
            <div className="h-8 w-16 bg-slate-200 rounded-lg shrink-0"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
