import React, { useState } from 'react';
import { BarChart3, Calendar, Search, SlidersHorizontal } from 'lucide-react';
import { THEME } from '../../../theme';
import { Dropdown, DropdownOption } from '../../../components/ui/Dropdown';
import { SearchInput } from '../../../components/ui/SearchInput';
import { PageHeader } from '../../../components/ui/PageHeader';

const peopleOptions: DropdownOption[] = [
  { value: 'All', label: 'الكل' },
  { value: 'أحمد فتحي الورفلي', label: 'أحمد فتحي الورفلي' },
  { value: 'سارة عمر بن حليم', label: 'سارة عمر بن حليم' },
  { value: 'عماد عبد السلام الترهوني', label: 'عماد عبد السلام الترهوني' },
  { value: 'محمد الهادي الفيتوري', label: 'محمد الهادي الفيتوري' },
  { value: 'ريناد الطاهر بن عثمان', label: 'ريناد الطاهر بن عثمان' },
];

export const ReportsManagement: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const typeButtons = [
    { value: 'All', label: 'الكل' },
    { value: 'exports', label: 'الصادرات' },
    { value: 'imports', label: 'الواردات' },
  ];

  return (
    <div className="w-full space-y-6">
      <PageHeader title="سجل التقارير">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="pr-8 pl-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 font-mono focus:outline-none focus:ring-4 focus:ring-red-100/80 focus:border-red-300/80 transition-all w-[130px]"
            />
          </div>
          <span className="text-[10px] text-slate-400 font-medium">إلى</span>
          <div className="relative">
            <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="pr-8 pl-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 font-mono focus:outline-none focus:ring-4 focus:ring-red-100/80 focus:border-red-300/80 transition-all w-[130px]"
            />
          </div>
        </div>
        <div className="flex items-center gap-1 p-1 bg-slate-50/80 border border-slate-100 rounded-xl">
          {typeButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setTypeFilter(btn.value)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                typeFilter === btn.value
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/60'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </PageHeader>

      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput
            value={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="ابحث حسب العنوان أو النوع أو البيان..."
            className="max-w-xs"
          />
          <Dropdown
            options={peopleOptions}
            selectedValue={filter}
            onChange={setFilter}
            placeholder="الشخص"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-slate-400 select-none">0 نتيجة</span>
          <button className="p-1.5 border border-slate-100 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-all cursor-pointer">
            <SlidersHorizontal size={14} />
          </button>
        </div>
      </div>

      <div className={`p-12 text-center border border-dashed ${THEME.neutral.borderMedium} rounded-2xl bg-white flex flex-col items-center justify-center min-h-[350px]`}>
        <div className={`w-12 h-12 rounded-full bg-red-50 flex items-center justify-center ${THEME.primary.text} mb-4`}>
          <BarChart3 size={24} />
        </div>
        <h3 className={`text-base font-semibold ${THEME.neutral.textDark} mb-1`}>قائمة التقارير فارغة</h3>
        <p className="text-xs text-slate-400 max-w-xs">لا توجد تقارير مسجلة في الوقت الحالي داخل إدارة التقارير.</p>
      </div>
    </div>
  );
};
