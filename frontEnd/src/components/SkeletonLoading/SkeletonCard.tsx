import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="border border-gray-200 shadow-sm rounded-2xl p-4 w-full max-w-sm mx-auto bg-white">
      <div className="animate-pulse flex space-x-4 space-x-reverse">
        <div className="rounded-full bg-slate-200 h-12 w-12 shrink-0"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="h-3 bg-slate-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 rounded"></div>
            <div className="h-3 bg-slate-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
      <div className="animate-pulse mt-4">
        <div className="h-32 bg-slate-200 rounded-xl w-full"></div>
      </div>
    </div>
  );
};
