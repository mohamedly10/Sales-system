import React from 'react';

interface SkeletonContainerProps {
  children?: React.ReactNode;
  className?: string;
  count?: number;
}

export const SkeletonContainer: React.FC<SkeletonContainerProps> = ({ 
  children, 
  className = "",
  count = 1
}) => {
  return (
    <div className={`grid gap-4 w-full ${className}`}>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="w-full">
          {children ? (
            children
          ) : (
            <div className="animate-pulse bg-slate-200 h-24 w-full rounded-xl"></div>
          )}
        </div>
      ))}
    </div>
  );
};
