import React, { useState } from 'react';
import { BarChart3, Calendar, FileSpreadsheet, FileText, Search, SlidersHorizontal } from 'lucide-react';
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

  interface ReportItem {
    id: string;
    name: string;
    amount: number;
    desc: string;
  }

  const sampleReports: ReportItem[] = [
    { id: 'RPT-001', name: 'تقرير المقبوضات الشهري', amount: 12500, desc: 'تقرير شامل لكافة المقبوضات خلال شهر يونيو يشمل المدفوعات النقدية والتحويلات البنكية' },
    { id: 'RPT-002', name: 'تقرير المصروفات الأسبوعي', amount: 8400, desc: 'مصروفات الأسبوع الثالث من يونيو تشمل المشتريات والرواتب والمصروفات الإدارية' },
    { id: 'RPT-003', name: 'تقرير الرصيد الدوري', amount: 4100, desc: 'الفرق بين إجمالي المقبوضات والمصروفات للفترة من 1 يونيو حتى 20 يونيو' },
  ];

  const typeButtons = [
    { value: 'All', label: 'الكل' },
    { value: 'exports', label: 'المصروفات' },
    { value: 'imports', label: 'المقبوضات' },
  ];

  const filteredReports = sampleReports.filter((r) =>
    searchQuery
      ? r.name.includes(searchQuery) || r.desc.includes(searchQuery) || r.id.includes(searchQuery)
      : true
  );

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
            placeholder="ابحث حسب كود المرجع أو العنوان أو البيان..."
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
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-medium rounded-xl transition-all cursor-pointer select-none">
            <FileText size={13} />
            PDF الكل
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-[10px] font-medium rounded-xl transition-all cursor-pointer select-none">
            <FileSpreadsheet size={13} />
            Excel الكل
          </button>
          <span className="text-[11px] font-medium text-slate-400 select-none">{filteredReports.length} نتيجة</span>
          <button className="p-1.5 border border-slate-100 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-all cursor-pointer">
            <SlidersHorizontal size={14} />
          </button>
        </div>
      </div>

      {filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-white rounded-[1.5rem] border border-slate-100 p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 tracking-wider">{report.id}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-semibold text-red-600 tracking-wide">{report.amount.toLocaleString()} د.ل</span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-700 leading-snug">{report.name}</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{report.desc}</p>
              <div className="flex items-center gap-2 pt-1">
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-medium rounded-xl transition-all cursor-pointer select-none">
                  <FileText size={12} />
                  PDF
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-[10px] font-medium rounded-xl transition-all cursor-pointer select-none">
                  <FileSpreadsheet size={12} />
                  Excel
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
      <div className={`p-12 text-center border border-dashed ${THEME.neutral.borderMedium} rounded-2xl bg-white flex flex-col items-center justify-center min-h-[350px]`}>
        <div className={`w-12 h-12 rounded-full bg-red-50 flex items-center justify-center ${THEME.primary.text} mb-4`}>
          <BarChart3 size={24} />
        </div>
        <h3 className={`text-base font-semibold ${THEME.neutral.textDark} mb-1`}>قائمة التقارير فارغة</h3>
        <p className="text-xs text-slate-400 max-w-xs">لا توجد تقارير مسجلة في الوقت الحالي داخل إدارة التقارير.</p>
      </div>
      )}
    </div>
  );
};
