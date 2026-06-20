import React from 'react';
import { NAVIGATION_ITEMS } from '../constants/menuItems';
import { THEME } from '../../../theme';

interface BottomNavBarProps {
  activeId: string;
  onActiveIdChange: (id: string) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeId,
  onActiveIdChange,
}) => {
  return (
    <nav 
      id="bottom-navigation"
      className={`slate-border md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-100 flex items-center justify-around px-2 z-40 select-none shadow-[0_-4px_24px_rgba(0,0,0,0.04)]`}
    >
      {NAVIGATION_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeId === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onActiveIdChange(item.id)}
            className="flex flex-col items-center justify-center flex-1 h-full py-1.5 focus:outline-none transition-all cursor-pointer relative"
          >
            {/* Active Indicator Line at the top of bottom card */}
            {isActive && (
              <span className={`absolute top-0 right-1/4 left-1/4 h-1 ${THEME.primary.solid} rounded-full`} />
            )}
            
            <Icon 
              size={18} 
              className={`transition-colors duration-200 ${
                isActive ? THEME.primary.text : 'text-slate-400 hover:text-slate-600'
              }`} 
              strokeWidth={isActive ? 2.2 : 1.8}
            />
            
            <span 
              className={`text-[10px] font-semibold mt-1 transition-colors duration-200 ${
                isActive ? THEME.primary.text : 'text-slate-500'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
