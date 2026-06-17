import React from 'react';
import { Inbox } from 'lucide-react';
import { THEME } from '../../../theme';

export const ImportsManagement: React.FC = () => {
  return (
    <div className={`p-12 text-center border border-dashed ${THEME.neutral.borderMedium} rounded-2xl bg-white flex flex-col items-center justify-center min-h-[350px]`}>
      <div className={`w-12 h-12 rounded-full bg-red-50 flex items-center justify-center ${THEME.primary.text} mb-4`}>
        <Inbox size={24} />
      </div>
      <h3 className={`text-base font-bold ${THEME.neutral.textDark} mb-1`}>قائمة الواردات فارغة</h3>
      <p className="text-xs text-slate-400 max-w-xs">لا توجد شحنات أو واردات مسجلة في الوقت الحالي داخل إدارة الواردات.</p>
    </div>
  );
};

