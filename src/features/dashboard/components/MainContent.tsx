import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

interface MainContentProps {
  activeId: string;
}

export const MainContent: React.FC<MainContentProps> = ({ activeId }) => {
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
        return 'إدارة الصادرات';
      case 'imports':
        return 'إدارة الواردات';
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
        return 'قسم مخصص لإدارة ومتابعة كافة الصادرات والبيانات الخارجة بشكل منظم وتفصيلي.';
      case 'imports':
        return 'نافذة متابعة جميع الشحنات الرسمية والواردات المسجلة بداخل النظام بمرونة متناهية.';
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
      default: return <LayoutGrid size={24} />;
    }
  };

  // Dynamically render operations features
  const renderFeatureContent = () => {
    switch (activeId) {
      case 'mainpage':
        return <MainPage />;
      case 'people':
        return <PeopleManagement />;
      case 'exports':
        return <ExportsManagement />;
      case 'imports':
        return <ImportsManagement />;
      case 'reports':
        return <ReportsManagement />;
      default:
        return (
          <div className="p-12 text-center border border-dashed border-slate-200 rounded-2xl bg-white flex flex-col items-center justify-center min-h-[350px]">
            <div className={`w-12 h-12 rounded-full ${THEME.primary.lightBg} flex items-center justify-center ${THEME.primary.text} mb-4`}>
              {getPageIcon(activeId)}
            </div>
            <h3 className="text-base font-semibold text-slate-800 mb-1">صفحة {activeName} فارغة</h3>
            <p className="text-xs text-slate-400 max-w-xs font-medium">لا توجد بيانات أو عناصر لعرضها في الوقت الحالي داخل هذا القسم.</p>
          </div>
        );
    }
  };

  return (
    <div className={`flex-1 min-h-screen overflow-y-auto flex flex-col ${THEME.neutral.appBackground}`}>
      {/* Header Bar - Floating island matching the Sidebar style */}
      <header className="mx-4 md:mx-12 mt-4 bg-white border border-slate-100 rounded-[1.8rem] h-20 flex items-center justify-between px-6 sticky top-4 z-20 select-none">
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

        {/* Elegant Action Elements and Controls */}
        <div className="flex items-center gap-2.5">
          {/* Status Glow Bell - matches sidebar profile footer indicator */}
          <button 
            className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all cursor-pointer relative"
            title="الإشعارات"
          >
            <Bell size={15} />
            <span className="absolute top-2 left-2 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white animate-pulse" />
          </button>

          {/* Sparkles indicator */}
          <button 
            className={`w-9 h-9 rounded-xl ${THEME.primary.lightBg} flex items-center justify-center ${THEME.primary.text} hover:scale-105 transition-all cursor-pointer hidden sm:flex`}
            title="النظام الذكي"
          >
            <Sparkles size={15} />
          </button>

          {/* Primary Action Button */}
          <button 
            onClick={() => {
              setIsRefreshing(true);
              setTimeout(() => setIsRefreshing(false), 800);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 md:py-2 ${THEME.primary.solid} ${THEME.primary.solidHover} text-white text-[11px] md:text-xs font-semibold rounded-xl transition-all cursor-pointer select-none`}
          >
            <RefreshCw 
              size={12} 
              className={`transition-transform duration-[800ms] ${isRefreshing ? 'rotate-180' : ''}`} 
            />
            <span>تحديث البيانات</span>
          </button>
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
            {renderFeatureContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
