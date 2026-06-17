import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import { THEME } from '../../theme';

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedValue,
  onChange,
  placeholder = "تصفية",
  className = "",
  icon: Icon = Filter,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(opt => opt.value === selectedValue);

  return (
    <div className={`relative ${className}`} ref={dropdownRef} dir="rtl">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-slate-100 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer select-none"
      >
        {Icon && <Icon size={13} className="text-slate-400" />}
        <span>
          {placeholder}: {selectedOption ? selectedOption.label : selectedValue}
        </span>
        <ChevronDown size={12} className="text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.03)] z-50 p-1.5 space-y-0.5">
          {options.map((option) => {
            const isSelected = option.value === selectedValue;
            return (
              <button 
                key={option.value}
                onClick={() => { 
                  onChange(option.value); 
                  setIsOpen(false); 
                }}
                className={`w-full text-right px-3 py-2 rounded-2xl text-xs font-semibold transition-colors cursor-pointer ${
                  isSelected 
                    ? `${THEME.primary.lightBg} ${THEME.primary.text}` 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
