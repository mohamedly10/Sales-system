import React from 'react';

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, children }) => {
  return (
    <div className="flex items-center justify-between px-1">
      <h3 className="text-sm md:text-base font-medium text-slate-800">{title}</h3>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
};
