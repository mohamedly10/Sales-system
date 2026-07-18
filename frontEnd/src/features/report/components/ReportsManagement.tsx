import React, { useState, useEffect, useCallback } from 'react';
import { BarChart3, Calendar, FileSpreadsheet, FileText, Printer, RefreshCw, Search, SlidersHorizontal, X, Trash2, FolderOpen } from 'lucide-react';
import { THEME } from '../../../theme';
import { Dropdown, DropdownOption } from '../../../components/ui/Dropdown';
import { SearchInput } from '../../../components/ui/SearchInput';
import { PageHeader } from '../../../components/ui/PageHeader';
import { getReports, getReportPersons, getReportsExportUrl, ReportItem, ReportPerson, ReportFilters } from '../api/reports';
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

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const safeReports = reports ?? [];

  const sortedAsc = [...safeReports].sort((a, b) => a.date.localeCompare(b.date));
  const runningBalances: number[] = [];
  let bal = 0;
  for (const r of sortedAsc) {
    bal += r.amount;
    runningBalances.push(bal);
  }

  const totalImports = safeReports.filter(r => r.type === 'import').reduce((s, r) => s + r.amount, 0);
  const totalExports = safeReports.filter(r => r.type === 'export').reduce((s, r) => s + Math.abs(r.amount), 0);
  const netBalance = totalImports - totalExports;

  const getRunningBalance = (id: string) => {
    const idx = sortedAsc.findIndex(r => r.id === id);
    return idx !== -1 ? runningBalances[idx] : 0;
  };

  const toggleRow = (id: string) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === reports.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(reports.map(r => r.id));
    }
  };

  const selectedPersonName = filter !== 'All'
    ? persons.find((p) => String(p.id) === filter)?.name || ''
    : '';

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
      setReports(reportData.data ?? []);
      setSummary(reportData.summary || { total_amount: 0, total_count: 0 });
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
    ...(persons || []).map((p) => ({ value: String(p.id), label: p.name })),
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
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 text-[10px] font-medium rounded-xl transition-all cursor-pointer select-none"
          >
            <RefreshCw size={13} />
            <span>تحديث</span>
          </button>
          <button
            onClick={handlePrint}
            disabled={reports.length === 0 || filter === 'All'}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 text-[10px] font-medium rounded-xl transition-all cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed"
            title={filter === 'All' ? 'يجب اختيار شخص للطباعة' : undefined}
          >
            <Printer size={13} />
            <span>طباعة PDF</span>
          </button>
          <button
            onClick={() => window.open(getReportsExportUrl({ type: typeFilter, date_from: dateFrom || undefined, date_to: dateTo || undefined, person_id: filter !== 'All' ? Number(filter) : undefined, search: searchQuery || undefined }), '_blank')}
            disabled={reports.length === 0 || filter === 'All'}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 text-[10px] font-medium rounded-xl transition-all cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed"
            title={filter === 'All' ? 'يجب اختيار شخص للتصدير' : undefined}
          >
            <FileSpreadsheet size={13} />
            <span>Excel</span>
          </button>
          <button className="p-1.5 border border-slate-100 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-all cursor-pointer">
            <SlidersHorizontal size={14} />
          </button>
          <div className="w-full sm:w-auto text-right mt-1 sm:mt-0 order-first sm:order-none">
            <span className="text-[11px] font-medium text-slate-400 select-none">{summary.total_count} نتيجة | {summary.total_amount.toLocaleString()} د.ل</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-24">
          <RefreshCw size={24} className="text-slate-300 animate-spin" />
        </div>
      ) : reports.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden font-sans">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-4 w-12 text-center select-none">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-200 text-red-600 focus:ring-0 cursor-pointer accent-red-600"
                      checked={reports.length > 0 && selectedRows.length === reports.length}
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="p-4 text-xs font-medium tracking-wider text-slate-400">كود المرجع</th>
                  <th className="p-4 text-xs font-medium tracking-wider text-slate-400">التاريخ</th>
                  <th className="p-4 text-xs font-medium tracking-wider text-slate-400">البيان / الوصف</th>
                  <th className="p-4 text-xs font-medium tracking-wider text-slate-400">نوع المعاملة</th>
                  <th className="p-4 text-xs font-medium tracking-wider text-slate-400">القيمة</th>
                  <th className="p-4 text-xs font-medium tracking-wider text-slate-400">الرصيد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((report) => {
                  const isChecked = selectedRows.includes(report.id);
                  return (
                    <tr
                      key={report.id}
                      className={`transition-colors duration-150 ${isChecked ? 'bg-red-50/10' : 'hover:bg-slate-50/40'
                        }`}
                    >
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-200 cursor-pointer accent-red-600"
                          checked={isChecked}
                          onChange={() => toggleRow(report.id)}
                        />
                      </td>
                      <td className="p-4 text-xs font-medium text-slate-800 font-mono">{report.id}</td>
                      <td className="p-4 text-xs font-normal text-slate-500 font-mono">{report.date}</td>
                      <td className="p-4 text-xs font-medium text-slate-700 leading-snug max-w-[300px] truncate" title={report.desc || report.name}>
                        {report.desc || report.name}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium ${report.type === 'export'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-emerald-50 text-emerald-700'
                          }`}>
                          {report.type === 'export' ? 'خروج' : 'دخول'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-medium font-mono ${report.type === 'export' ? 'text-red-600' : 'text-emerald-600'
                          }`}>
                          {report.type === 'export' ? '-' : '+'}{Math.abs(report.amount).toLocaleString()} د.ل
                        </span>
                      </td>
                      <td className="p-4 text-xs font-medium font-mono">
                        <span className={getRunningBalance(report.id) >= 0 ? 'text-emerald-600' : 'text-red-500'}>
                          {getRunningBalance(report.id).toLocaleString()} د.ل
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="border-t-2 border-slate-200">
                <tr className="bg-slate-50/50">
                  <td colSpan={7} className="p-4 text-right">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-slate-600">مجموع الدخول:</span>
                      <span className="text-xs font-medium font-mono text-emerald-600">+{totalImports.toLocaleString()} د.ل</span>
                    </div>
                  </td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td colSpan={7} className="p-4 text-right">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-slate-600">مجموع الخروج:</span>
                      <span className="text-xs font-medium font-mono text-red-600">-{totalExports.toLocaleString()} د.ل</span>
                    </div>
                  </td>
                </tr>
                <tr className="bg-slate-100/80 font-semibold">
                  <td colSpan={7} className="p-4 text-right">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-700">الرصيد الصافي:</span>
                      <span className={`text-xs font-bold font-mono ${netBalance >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {netBalance.toLocaleString()} د.ل
                      </span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
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
          companyName={selectedPersonName}
        />
      )}
    </div>
  );
};
