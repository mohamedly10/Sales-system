import React from 'react';
import { Search } from 'lucide-react';
import { THEME } from '../../theme';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearchChange?: (value: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ 
  value, 
  onChange, 
  onSearchChange,
  placeholder = "بحث...", 
  className = "",
  ...props 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e);
    if (onSearchChange) onSearchChange(e.target.value);
  };

  return (
    <div className={`relative flex-1 ${className}`}>
      <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full pr-11 pl-5 py-2.5 bg-slate-50/60 border border-slate-100 rounded-full text-xs font-medium focus:outline-none focus:ring-4 ${THEME.primary.ringFocus} focus:bg-white transition-all text-slate-705 placeholder-slate-400`}
        {...props}
      />
    </div>
  );
};
