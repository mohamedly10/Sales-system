import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Outlet, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  ShoppingCart,
  Users,
  BarChart3,
  Send,
  Inbox,
  Store,
  ArrowLeftRight,
  FileText,
  Settings as SettingsIcon,
  HelpCircle,
  LogOut,
  RefreshCw,
  Bell,
  Sparkles
} from 'lucide-react';
import { THEME } from '../../../theme';
import { PeopleManagement } from '../../personal/components/PeopleManagement';
import { ExportsManagement } from '../../export/components/ExportsManagement';
import { ImportsManagement } from '../../import/components/ImportsManagement';
import { ReportsManagement } from '../../report/components/ReportsManagement';
import { MainPage } from '../../mainpage/components/MainPage';

export const MainContent: React.FC = () => {
  const location = useLocation();
  const activeId = location.pathname.split('/')[1] || 'dashboard';
  const [isRefreshing, setIsRefreshing] = useState(false);
  const getArabicName = (id: string) => {
    switch (id) {
      case 'dashboard':
        return 'لوحة التحكم';
      case 'orders':
        return 'الطلبات';
      case 'people':
        return 'إدارة المستخدمين';
      case 'reports':
        return 'التقارير';
      case 'exports':
        return 'إدارة الخروج';
      case 'imports':
        return 'إدارة الدخول';
      case 'store':
        return 'متجري';
      case 'integration':
        return 'الربط البرمجي';
      case 'invoice':
        return 'الفواتير';
      case 'settings':
        return 'الإعدادات';
      case 'help':
        return 'مركز المساعدة';
      case 'logout':
        return 'تسجيل الخروج';
      case 'upgrades':
        return 'الترقيات والخطط';
      default:
        return id;
    }
  };

  const activeName = getArabicName(activeId);

  // Get description for each page to replace the generic placeholder
  const getPageDescription = (id: string) => {
    switch (id) {
      case 'people':
        return 'لوحة تطويرية متكاملة لإدارة وتتبع سجلات الموظفين، والجهات الخارجية، والعملاء، مع حلول تصفية ذكية وبحث فوري لتسهيل الإجراءات.';
      case 'exports':
        return 'قسم مخصص لإدارة ومتابعة كافة الخروج والبيانات الخارجة بشكل منظم وتفصيلي.';
      case 'imports':
        return 'نافذة متابعة جميع الشحنات الرسمية والدخول المسجلة بداخل النظام بمرونة متناهية.';
      case 'reports':
        return 'مركز التقارير والإحصائيات لرصد مؤشرات الأداء الحيوية وتدفق البيانات العامة للعمليات.';
      default:
        return 'هذه الواجهة مجهزة كصفحة فارغة ونظيفة تماشياً مع الهوية المحدثة للمنظومة لضمان سهولة الإعداد والتشغيل المستقبلي.';
    }
  };

  // Get icon for generic empty state pages
  const getPageIcon = (id: string) => {
    switch (id) {
      case 'dashboard': return <LayoutGrid size={24} />;
      case 'orders': return <ShoppingCart size={24} />;
      case 'reports': return <BarChart3 size={24} />;
      case 'store': return <Store size={24} />;
      case 'integration': return <ArrowLeftRight size={24} />;
      case 'invoice': return <FileText size={24} />;
      case 'settings': return <SettingsIcon size={24} />;
      case 'help': return <HelpCircle size={24} />;
      case 'logout': return <LogOut size={24} />;
      case 'upgrades': return <Sparkles size={24} />;
      default: return <LayoutGrid size={24} />;
    }
  };

  // Generic empty state if Outlet has nothing (won't typically happen with routes defined)

  return (
    <div className={`flex-1 min-h-screen overflow-y-scroll flex flex-col ${THEME.neutral.appBackground}`}>
      {/* Header Bar - Floating island matching the Sidebar style */}
      <header className="mx-4 md:mx-12 mt-4 bg-white border border-slate-100 rounded-[1.8rem] h-20 shrink-0 flex items-center justify-between px-6 sticky top-4 z-20 select-none">
        <div className="flex items-center gap-3">
          {/* Mobile Only: Brand Logo to match Sidebar Concept */}
          <div className="md:hidden flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-9 h-9 ${THEME.primary.lightBg} rounded-xl flex items-center justify-center flex-shrink-0`}
            >
              <div className={`w-5 h-5 rounded-md ${THEME.primary.solid} flex items-center justify-center text-white text-[10px] font-semibold font-mono`}>
                S
              </div>
            </motion.div>
          </div>

          {/* Breadcrumb Path */}
          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-400">
            <span className="hover:text-slate-600 transition-colors cursor-pointer font-semibold">بوابة المنظومة</span>
            <span className="text-slate-200">/</span>
            <span className={`text-slate-600 uppercase font-black tracking-wide text-[10px] md:text-xs ${THEME.primary.lightBg} ${THEME.primary.text} rounded-lg px-2.5 py-1`}>
              {activeName}
            </span>
          </div>
        </div>



      </header>

      {/* Main Container Content */}
      <main className="flex-1 px-8 md:px-12 pt-6 pb-24 md:pb-12 space-y-8">
        {/* Module Header Overview Card */}


        {/* Dynamic Interactive Component View */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
