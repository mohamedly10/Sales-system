import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavigationItem } from '../types';
import { THEME } from '../../../theme';

interface SidebarItemProps {
  item: NavigationItem;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isActive,
  isCollapsed,
  onClick,
}) => {
  const Icon = item.icon;
  const isLogout = item.id === 'logout';

  return (
    <button
      id={`sidebar-item-${item.id}`}
      onClick={onClick}
      className={`relative w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group outline-none cursor-pointer ${
        isActive
          ? `${THEME.primary.lightBg} ${THEME.primary.text} font-semibold`
          : isLogout
          ? 'text-rose-500 hover:bg-rose-50/60 hover:text-rose-600'
          : 'text-slate-500 hover:bg-slate-50/80 hover:text-slate-800'
      }`}
    >
      {/* Icon with interactive micro-motion */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex-shrink-0 transition-colors ${
          isActive 
            ? THEME.primary.text 
            : isLogout
            ? 'text-rose-500'
            : 'text-slate-400 group-hover:text-slate-600'
        }`}
      >
        <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
      </motion.div>

      {/* Label and badges */}
      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.15 }}
            className="flex flex-1 items-center justify-between overflow-hidden"
          >
            <span className="truncate text-sm tracking-wide font-medium">
              {item.label}
            </span>

            {/* Badge (e.g. 12 on Orders) */}
            {item.badge !== undefined && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ml-1 ${
                  item.badgeType === 'danger'
                    ? `${THEME.primary.solid} text-white`
                    : isActive
                    ? `${THEME.primary.solid} text-white`
                    : `${THEME.primary.solid} text-white`
                }`}
              >
                {item.badge}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip on collapse */}
      {isCollapsed && (
        <div className="absolute right-16 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 bg-neutral-950 text-white text-xs py-1.5 px-3 rounded-lg shadow-md transition-opacity duration-200 whitespace-nowrap z-50 font-medium border border-neutral-800">
          {item.label}
          {item.badge && <span className={`mr-1.5 ${THEME.primary.solid} text-white font-semibold px-1.5 py-0.2 rounded-sm text-[10px]`}>{item.badge}</span>}
        </div>
      )}
    </button>
  );
};

