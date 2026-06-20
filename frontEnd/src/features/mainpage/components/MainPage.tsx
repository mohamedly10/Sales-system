import React from 'react';
import { Users, Inbox, Send, Plus, DollarSign, Activity, Scale } from 'lucide-react';
import { THEME } from '../../../theme';
import { PageHeader } from '../../../components/ui/PageHeader';

const cards = [
  { icon: Users, title: 'المستخدمين', label: 'إجمالي المستخدمين', value: '0' },
  { icon: Inbox, title: 'المقبوضات', label: 'عدد المقبوضات', value: '0' },
  { icon: DollarSign, title: 'قيمة المقبوضات', label: 'إجمالي قيمة المقبوضات', value: '0 د.ل' },
  { icon: Send, title: 'المصروفات', label: 'عدد المصروفات', value: '0' },
  { icon: DollarSign, title: 'قيمة المصروفات', label: 'إجمالي قيمة المصروفات', value: '0 د.ل' },
  { icon: Scale, title: 'الرصيد', label: 'الرصيد الحالي', value: '0 د.ل' },
  { icon: Activity, title: 'عمليات اليوم', label: 'عدد العمليات اليوم', value: '0' },
];

export const MainPage: React.FC = () => {
  return (
    <div className="w-full space-y-6">
      <PageHeader title="نظرة عامة">
        <button
          className={`flex items-center gap-1.5 px-4.5 py-2 ${THEME.primary.solid} ${THEME.primary.solidHover} text-white text-xs font-medium rounded-2xl transition-all active:scale-95 cursor-pointer select-none`}
        >
          <Plus size={14} />
          <span>إضافة</span>
        </button>
      </PageHeader>

      <div className="flex flex-wrap gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="w-[260px] h-[280px] bg-white rounded-[2rem] p-6 flex flex-col justify-between font-sans box-border border border-slate-100">
              <div className="flex justify-center mt-2">
                <div className="w-[110px] h-[110px] flex items-center justify-center bg-white rounded-3xl border-[1.5px] border-slate-100">
                  <Icon size={44} stroke="#dc2626" strokeWidth={1.5} />
                </div>
              </div>
              <div className="mb-1 flex flex-col gap-3">
                <h2 className="text-slate-800 text-[22px] font-medium tracking-wide m-0">
                  {card.title}
                </h2>
                <div className="flex justify-between items-baseline w-full">
                  <span className="text-slate-400 text-[15px] font-normal">
                    {card.label}
                  </span>
                  <span className="text-red-600 text-[17px] font-semibold tracking-wide">
                    {card.value}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
