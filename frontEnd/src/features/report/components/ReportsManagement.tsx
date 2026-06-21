import React, { useState, useEffect, useCallback } from 'react';
import { BarChart3, Calendar, FileSpreadsheet, FileText, Printer, RefreshCw, Search, SlidersHorizontal, X } from 'lucide-react';
import { THEME } from '../../../theme';
import { Dropdown, DropdownOption } from '../../../components/ui/Dropdown';
import { SearchInput } from '../../../components/ui/SearchInput';
import { PageHeader } from '../../../components/ui/PageHeader';
import { getReports, getReportPersons, ReportItem, ReportPerson, ReportFilters } from '../api/reports';
import { ReportPrintView } from './ReportPrintView';

export const ReportsManagement: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [persons, setPersons] = useState<ReportPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [summary, setSummary] = useState({ total_amount: 0, total_count: 0 });
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = useCallback(() => {
    setIsPrinting(true);
  }, []);

  useEffect(() => {
    if (!isPrinting) return;
    const timer = setTimeout(() => {
      window.print();
    }, 200);
    const afterPrint = () => setIsPrinting(false);
    window.addEventListener('afterprint', afterPrint);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('afterprint', afterPrint);
    };
  }, [isPrinting]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: ReportFilters = {
        type: typeFilter,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        person_id: filter !== 'All' ? Number(filter) : undefined,
        search: searchQuery || undefined,
      };

      const [reportData, personsData] = await Promise.all([
        getReports(filters),
        getReportPersons(),
      ]);
      setReports(reportData.data);
      setSummary(reportData.summary);
      setPersons(personsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تحميل التقارير');
    } finally {
      setLoading(false);
    }
  }, [typeFilter, dateFrom, dateTo, filter, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const peopleOptions: DropdownOption[] = [
    { value: 'All', label: 'الكل' },
    ...persons.map((p) => ({ value: String(p.id), label: p.name })),
  ];

  const typeButtons = [
    { value: 'all', label: 'الكل' },
    { value: 'exports', label: 'المصروفات' },
    { value: 'imports', label: 'المقبوضات' },
  ];

  return (
    <div className="w-full space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs font-medium flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="p-1 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

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
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 text-[10px] font-medium rounded-xl transition-all cursor-pointer select-none"
          >
            <RefreshCw size={13} />
            <span>تحديث</span>
          </button>
          <button
            onClick={handlePrint}
            disabled={reports.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 text-[10px] font-medium rounded-xl transition-all cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Printer size={13} />
            <span>طباعة PDF</span>
          </button>
          <span className="text-[11px] font-medium text-slate-400 select-none">{summary.total_count} نتيجة | {summary.total_amount.toLocaleString()} د.ل</span>
          <button className="p-1.5 border border-slate-100 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-all cursor-pointer">
            <SlidersHorizontal size={14} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-24">
          <RefreshCw size={24} className="text-slate-300 animate-spin" />
        </div>
      ) : reports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-[1.5rem] border border-slate-100 p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 tracking-wider">{report.id}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-medium text-slate-400 ml-1">
                    {report.type === 'export' ? 'صادر' : 'وارد'}
                  </span>
                  <span className={`text-[13px] font-semibold tracking-wide ${
                    report.type === 'export' ? 'text-red-600' : 'text-emerald-600'
                  }`}>
                    {report.amount.toLocaleString()} د.ل
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-700 leading-snug">{report.name}</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{report.desc}</p>
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

      {isPrinting && (
        <ReportPrintView
          reports={reports}
          dateFrom={dateFrom}
          dateTo={dateTo}
        />
      )}
    </div>
  );
};
