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
    <div className={`flex-1 min-h-screen overflow-y-auto flex flex-col ${THEME.neutral.appBackground}`}>


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
