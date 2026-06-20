import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  LogOut,
  User,
  Sparkles
} from 'lucide-react';
import { SidebarItem } from './SidebarItem';
import { NAVIGATION_ITEMS } from '../constants/menuItems';
import { THEME } from '../../../theme';

interface SidebarProps {
  activeId: string;
  onActiveIdChange: (id: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeId,
  onActiveIdChange,
  isCollapsed,
  setIsCollapsed,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);

  // Group items by category dynamically
  const categories = Array.from(
    new Set(NAVIGATION_ITEMS.map((item) => item.category || 'General'))
  );

  return (
    <motion.aside
      id="main-sidebar"
      initial={{ width: isCollapsed ? '88px' : '280px' }}
      animate={{ width: isCollapsed ? '88px' : '280px' }}
      transition={{ type: 'spring', stiffness: 350, damping: 35 }}
      // Highly rounded, floating design resembling the mockup
      className="hidden md:flex flex-col justify-between h-[calc(100vh-2rem)] my-4 mr-4 ml-2 bg-white rounded-[2.2rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative z-30 select-none"
    >
      {/* Collapse / Expand Toggle Button */}
      <button
        id="sidebar-toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`absolute -left-3 top-8 w-6 h-6 rounded-full bg-white border border-slate-100 hover:border-red-600 text-slate-400 hover:text-red-600 flex items-center justify-center transition-all shadow-[0_2px_6px_rgba(0,0,0,0.02)] focus:outline-none cursor-pointer z-40`}
      >
        {isCollapsed ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>

      {/* Brand Title Area */}
      <div className="flex flex-col">
        <div className={`pt-8 px-6 pb-4 flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          {/* Mockup Brand Icon Style */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-10 h-10 ${THEME.primary.lightBg} rounded-2xl flex items-center justify-center flex-shrink-0`}
          >
            <div className={`w-5.5 h-5.5 rounded-lg ${THEME.primary.solid} flex items-center justify-center text-white text-xs font-semibold font-mono`}>
              S
            </div>
          </motion.div>

          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col text-right"
            >
              <h1 className="font-sans font-semibold text-base tracking-tight text-slate-800">
                منظومة العمليات
              </h1>
              <span className="text-[10px] text-slate-400 font-medium">لوحة الإدارة الذكية</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation Links and Categories */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-7 scrollbar-none">
        {categories.map((category) => {
          const categoryItems = NAVIGATION_ITEMS.filter(
            (item) => item.category === category
          );

          if (categoryItems.length === 0) return null;

          return (
            <div key={category} className="space-y-2">
              {!isCollapsed && (
                <div className="px-3 text-[11px] font-sans font-semibold tracking-wide text-slate-400 select-none">
                  {category}
                </div>
              )}
              <div className="space-y-1">
                {categoryItems.map((item) => (
                  <SidebarItem
                    key={item.id}
                    item={item}
                    isActive={activeId === item.id}
                    isCollapsed={isCollapsed}
                    onClick={() => onActiveIdChange(item.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Minimal Profile Footer */}
      <div className="p-4 border-t border-slate-50 relative mt-auto">
        <div className="relative">
          <div
            id="sidebar-profile-trigger"
            onClick={() => !isCollapsed && setProfileOpen(!profileOpen)}
            className={`flex items-center gap-3 p-2 rounded-xl transition-colors cursor-pointer group select-none ${
              isCollapsed ? 'justify-center' : 'hover:bg-slate-50'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-700 font-semibold text-xs relative border border-slate-50">
              أ
              <span className="absolute bottom-0 left-0 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-1 items-center justify-between overflow-hidden">
                <div className="flex flex-col text-right overflow-hidden">
                  <span className="text-xs font-semibold truncate text-slate-800 leading-tight">
                    أحمد العتيبي
                  </span>
                  <span className="text-[10px] text-slate-400 truncate mt-0.5">
                    مدير الحساب
                  </span>
                </div>
                <ChevronDown
                  size={12}
                  className={`text-slate-400 transition-transform duration-200 ${
                    profileOpen ? `rotate-180 ${THEME.primary.text}` : `group-hover:${THEME.primary.text}`
                  }`}
                />
              </div>
            )}
          </div>

          {/* Profile Dropdown Popup */}
          {profileOpen && !isCollapsed && (
            <div className="absolute bottom-14 left-0 right-0 bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden z-50 p-1 space-y-0.5">
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors text-right" onClick={() => setProfileOpen(false)}>
                <User size={13} className="text-slate-400" />
                <span>الملف الشخصي</span>
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors text-right" onClick={() => setProfileOpen(false)}>
                <Sparkles size={13} className="text-slate-400" />
                <span>الترقيات والخطط</span>
              </button>
              <div className="h-px bg-slate-50 my-1" />
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50/50 transition-colors text-right" onClick={() => { setProfileOpen(false); onActiveIdChange('logout'); }}>
                <LogOut size={13} />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};
