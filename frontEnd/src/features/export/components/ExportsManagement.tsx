import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Plus,
  X,
  Calendar,
  FileText,
  DollarSign,
  TrendingDown,
  Paperclip,
  Upload,
  Search,
  Check,
  Building2,
  Trash2,
  SlidersHorizontal,
  FolderOpen,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { THEME } from '../../../theme';
import { SearchInput } from '../../../components/ui/SearchInput';
import { Dropdown, DropdownOption } from '../../../components/ui/Dropdown';
import { PageHeader } from '../../../components/ui/PageHeader';
import {
  getExports,
  createExport,
  deleteExport,
  ExportData,
  CreateExportPayload,
} from '../api/exports';
import { getPeople, PersonData } from '../../personal/api/persons';

const filterOptions: DropdownOption[] = [
  { value: 'All', label: 'الكل' },
  { value: 'WithAttachment', label: 'بمرفقات رسمية' },
  { value: 'WithoutAttachment', label: 'حقوق بدون مرفق' },
];

export const ExportsManagement: React.FC = () => {
  const [exports, setExports] = useState<ExportData[]>([]);
  const [persons, setPersons] = useState<PersonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [attachmentFilter, setAttachmentFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formDate, setFormDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [formPerson, setFormPerson] = useState('');
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  const [formReason, setFormReason] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const [isPersonDropdownOpen, setIsPersonDropdownOpen] = useState(false);
  const [personSearchQuery, setPersonSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [exportsData, peopleData] = await Promise.all([
        getExports(),
        getPeople(),
      ]);
      setExports(exportsData);
      setPersons(peopleData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تحميل البيانات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    const visibleRowIds = filteredExports.map((e) => e.id);
    const allVisibleSelected = visibleRowIds.every((id) =>
      selectedRows.includes(id),
    );

    if (allVisibleSelected) {
      setSelectedRows((prev) =>
        prev.filter((id) => !visibleRowIds.includes(id)),
      );
    } else {
      setSelectedRows((prev) =>
        Array.from(new Set([...prev, ...visibleRowIds])),
      );
    }
  };

  const filteredExports = exports.filter((item) => {
    const query = searchQuery.toLowerCase();
    const personName = item.person?.name ?? '';
    const matchesSearch =
      item.code.toLowerCase().includes(query) ||
      personName.toLowerCase().includes(query) ||
      item.reason.toLowerCase().includes(query) ||
      item.amount.toString().includes(query) ||
      item.date.includes(query);

    let matchesFilter = true;
    if (attachmentFilter === 'WithAttachment') {
      matchesFilter = item.note !== null && item.note !== '';
    } else if (attachmentFilter === 'WithoutAttachment') {
      matchesFilter = item.note === null || item.note === '';
    }

    return matchesSearch && matchesFilter;
  });

  const filteredPeopleOptions = persons.filter((person) =>
    person.name.toLowerCase().includes(personSearchQuery.toLowerCase()),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPersonId || !formAmount.trim() || !formReason.trim()) return;

    try {
      setError(null);
      const payload: CreateExportPayload = {
        person_id: selectedPersonId,
        amount: parseFloat(formAmount),
        reason: formReason.trim(),
        note: formDescription.trim() || undefined,
        date: formDate,
      };

      await createExport(payload);

      setFormDate(new Date().toISOString().split('T')[0]);
      setFormPerson('');
      setSelectedPersonId(null);
      setFormReason('');
      setFormAmount('');
      setFormDescription('');
      setPersonSearchQuery('');
      setIsModalOpen(false);

      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تسجيل الصادر');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteExport(id);
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل حذف الصادر');
    }
  };

  const deleteSelected = async () => {
    try {
      await Promise.all(selectedRows.map((id) => deleteExport(id)));
      setSelectedRows([]);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل حذف المحدد');
    }
  };

  if (loading && exports.length === 0) {
    return (
      <div className="w-full space-y-6" dir="rtl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-slate-100 animate-pulse"
            >
              <div className="h-3 w-24 bg-slate-100 rounded mb-3" />
              <div className="h-5 w-32 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 p-24 flex items-center justify-center">
          <RefreshCw size={24} className="text-slate-300 animate-spin" />
        </div>
      </div>
    );
  }

  const totalAmount = exports.reduce(
    (sum, item) => sum + parseFloat(item.amount),
    0,
  );

  return (
    <div className="w-full space-y-6" dir="rtl">
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between font-sans">
          <div>
            <span className="text-[11px] font-medium text-slate-400">
              إجمالي الصادرات والمدفوعات
            </span>
            <h4 className="text-xl font-medium text-slate-800 mt-1 font-mono">
              {totalAmount.toLocaleString()} د.ل
            </h4>
          </div>
          <div
            className={`w-10 h-10 rounded-xl ${THEME.primary.lightBg} flex items-center justify-center ${THEME.primary.text}`}
          >
            <TrendingDown size={18} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between font-sans">
          <div>
            <span className="text-[11px] font-medium text-slate-400">
              إجمالي المعاملات المالية
            </span>
            <h4 className="text-xl font-medium text-slate-800 mt-1 font-mono">
              {exports.length} حركة
            </h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <SlidersHorizontal size={18} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between font-sans">
          <div>
            <span className="text-[11px] font-medium text-slate-400">
              حركات بمرفقات رسمية
            </span>
            <h4 className="text-xl font-medium text-slate-800 mt-1 font-mono">
              {exports.filter((e) => e.note && e.note !== '').length} معتمدة
            </h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Paperclip size={18} />
          </div>
        </div>
      </div>

      <PageHeader title="سجل الصادرات المالية الحالي في المنظومة">
        <button
          onClick={fetchData}
          className="flex items-center gap-1.5 px-4 py-2 border border-slate-100 bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50 text-xs font-medium rounded-2xl transition-all cursor-pointer active:scale-95"
        >
          <RefreshCw size={13} />
          <span>تحديث</span>
        </button>

        {selectedRows.length > 0 && (
          <button
            onClick={deleteSelected}
            className="flex items-center gap-1.5 px-4 py-2 border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 text-xs font-medium rounded-2xl transition-all cursor-pointer active:scale-95"
          >
            <Trash2 size={13} />
            <span>حذف المحدد ({selectedRows.length})</span>
          </button>
        )}

        <button
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center gap-1.5 px-4.5 py-2 ${THEME.primary.solid} ${THEME.primary.solidHover} text-white text-xs font-medium rounded-2xl transition-all active:scale-95 cursor-pointer select-none`}
        >
          <Plus size={14} />
          <span>إضافة صادر مالي</span>
        </button>
      </PageHeader>

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden font-sans">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-5 border-b border-slate-50 gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <SearchInput
              value={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="ابحث حسب الرمز، اسم المستلم، القيمة أو البيان..."
              className="max-w-xs"
            />

            <Dropdown
              options={filterOptions}
              selectedValue={attachmentFilter}
              onChange={setAttachmentFilter}
              placeholder="مستوى الاعتماد"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-50">
            <span className="text-[11px] font-medium text-slate-400 select-none">
              صف مرشح: {filteredExports.length}
            </span>
            <div className="flex items-center gap-1.5">
              <button className="p-1 hover:bg-slate-50 border border-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-all cursor-pointer">
                <ChevronRight size={14} />
              </button>
              <span className="text-xs font-medium text-slate-600 px-1 font-mono">
                1 من 1
              </span>
              <button className="p-1 hover:bg-slate-50 border border-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-all cursor-pointer">
                <ChevronLeft size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-16 flex items-center justify-center">
              <RefreshCw
                size={20}
                className="text-slate-300 animate-spin"
              />
            </div>
          ) : filteredExports.length > 0 ? (
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-4 w-12 text-center select-none">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-200 text-red-600 focus:ring-0 cursor-pointer accent-red-600"
                      onChange={toggleAll}
                      checked={
                        filteredExports.length > 0 &&
                        filteredExports.every((e) =>
                          selectedRows.includes(e.id),
                        )
                      }
                    />
                  </th>
                  <th className="p-4 text-xs font-medium tracking-wider text-slate-400">
                    كود المرجع
                  </th>
                  <th className="p-4 text-xs font-medium tracking-wider text-slate-400">
                    التاريخ \ الطرف
                  </th>
                  <th className="p-4 text-xs font-medium tracking-wider text-slate-400">
                    النوع / القيمة
                  </th>
                  <th className="p-4 text-xs font-medium tracking-wider text-slate-400">
                    الحالة
                  </th>
                  <th className="p-4 w-12 text-center text-slate-400">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExports.map((row) => {
                  const isChecked = selectedRows.includes(row.id);
                  return (
                    <tr
                      key={row.id}
                      className={`transition-colors duration-150 ${
                        isChecked ? 'bg-red-50/10' : 'hover:bg-slate-50/40'
                      }`}
                    >
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-200 cursor-pointer accent-red-600"
                          checked={isChecked}
                          onChange={() => toggleRow(row.id)}
                        />
                      </td>

                      <td className="p-4 text-xs font-medium text-slate-800 font-mono">
                        {row.code}
                      </td>

                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 font-mono">
                            {row.date}
                          </span>
                          <span className="text-xs font-medium text-slate-800 mt-0.5">
                            {row.person?.name ?? '-'}
                          </span>
                          <span className="text-[10px] text-slate-400 leading-relaxed line-clamp-1 mt-0.5 max-w-[220px]">
                            {row.reason}
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex px-2 py-0.5 bg-red-50 text-red-700 rounded-md text-[10px] font-medium">
                            صادرات
                          </span>
                          <span className="text-xs font-medium font-mono text-red-600">
                            -
                            {parseFloat(row.amount).toLocaleString()} د.ل
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        {row.note ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            معتمد
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-[11px] font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            قيد الانتظار
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="text-slate-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="حذف القيد المالي"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-16 text-center flex flex-col items-center justify-center">
              <div
                className={`w-12 h-12 rounded-full ${THEME.primary.lightBg} flex items-center justify-center ${THEME.primary.text} mb-3`}
              >
                <FolderOpen size={20} />
              </div>
              <h4 className="text-xs font-medium text-slate-500">
                لا توجد سجلات مطابقة لعوامل هذا التصفية
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                يرجى تعديل معلمات تصفية البحث أو الضغط على زر "إضافة صادر"
                لتسجيل معاملة مالية جديدة.
              </p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative bg-white rounded-3xl border border-slate-100 p-6 w-full max-w-lg z-10 space-y-5 font-sans"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-xl ${THEME.primary.lightBg} ${THEME.primary.text} flex items-center justify-center`}
                  >
                    <Plus size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-800">
                      تسجيل قيد صادر مالي جديد
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      توثيق وخروج المبالغ النقدية والمصالح الفردية
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3 bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-medium text-slate-400">
                      رمز المعاملة المالي
                    </label>
                    <div className="relative">
                      <FileText
                        size={12}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="text"
                        disabled
                        value="يُحدد تلقائياً"
                        className="w-full pr-8 pl-3 py-2 bg-slate-100/80 border border-slate-200/60 rounded-xl text-xs font-medium text-slate-500 font-mono text-center select-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-medium text-slate-500">
                      تاريخ تسجيل الحركة
                    </label>
                    <div className="relative">
                      <Calendar
                        size={12}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400Pointer"
                      />
                      <input
                        type="date"
                        required
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        className={`w-full pr-8 pl-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 font-mono focus:outline-none focus:ring-4 ${THEME.primary.ringFocus} transition-all`}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div className="space-y-1" ref={dropdownRef}>
                    <label className="block text-[11px] font-medium text-slate-500 flex items-center justify-between">
                      <span>الشخص / الجهة المستلمة</span>
                      <span className="text-red-500 text-[10px]">
                        * حقل مطلوب
                      </span>
                    </label>

                    <div className="relative">
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                        <Search size={13} className="text-slate-400" />
                      </div>

                      <input
                        type="text"
                        required
                        placeholder="ابحث عن اسم المستفيد..."
                        value={formPerson}
                        onFocus={() => setIsPersonDropdownOpen(true)}
                        onChange={(e) => {
                          setFormPerson(e.target.value);
                          setPersonSearchQuery(e.target.value);
                          setSelectedPersonId(null);
                          setIsPersonDropdownOpen(true);
                        }}
                        className={`w-full pr-9 pl-8 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-4 ${THEME.primary.ringFocus} transition-all`}
                      />

                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                        <ChevronLeft
                          size={14}
                          className={`text-slate-400 transform transition-transform ${isPersonDropdownOpen ? '-rotate-90' : ''}`}
                        />
                      </div>

                      <AnimatePresence>
                        {isPersonDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute z-30 left-0 right-0 mt-1.5 bg-white border border-slate-150 rounded-2xl shadow-xl max-h-48 overflow-y-auto divide-y divide-slate-50"
                          >
                            {filteredPeopleOptions.length > 0 ? (
                              filteredPeopleOptions.map((person) => {
                                const isSelected =
                                  selectedPersonId === person.id;
                                return (
                                  <button
                                    key={person.id}
                                    type="button"
                                    onClick={() => {
                                      setFormPerson(person.name);
                                      setSelectedPersonId(person.id);
                                      setPersonSearchQuery('');
                                      setIsPersonDropdownOpen(false);
                                    }}
                                    className="w-full text-right px-4 py-2.5 text-xs hover:bg-slate-50 flex items-center justify-between transition-colors text-slate-705 font-medium cursor-pointer"
                                  >
                                    <div className="flex flex-col">
                                      <span>{person.name}</span>
                                      {person.company && (
                                        <span className="text-[9px] text-slate-400">
                                          {person.company}
                                        </span>
                                      )}
                                    </div>
                                    {isSelected && (
                                      <Check
                                        size={13}
                                        className={`${THEME.primary.text}`}
                                      />
                                    )}
                                  </button>
                                );
                              })
                            ) : (
                              <div className="p-3 text-center">
                                <p className="text-[11px] text-slate-400 font-medium">
                                  لم يتم العثور على شخص
                                </p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {isPersonDropdownOpen && (
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setIsPersonDropdownOpen(false)}
                      />
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-slate-500 flex items-center justify-between">
                      <span>سبب الصرف</span>
                      <span className="text-red-500 text-[10px]">
                        * حقل مطلوب
                      </span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="اكتب سبب الصرف (مثال: سداد فاتورة، سلفة تشغيلية...)"
                      value={formReason}
                      onChange={(e) => setFormReason(e.target.value)}
                      className={`w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-4 ${THEME.primary.ringFocus} transition-all`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-slate-550 flex items-center justify-between">
                      <span>القيمة المالية (المبلغ المالي الصادر)</span>
                      <span className="text-red-500 text-[10px]">
                        * حقل مطلوب
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center text-slate-400 text-xs font-medium select-none">
                        د.ل
                      </div>
                      <input
                        type="number"
                        required
                        min="1"
                        step="1"
                        placeholder="مثال: 1500"
                        value={formAmount}
                        onChange={(e) => setFormAmount(e.target.value)}
                        className={`w-full pr-11 pl-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-700 font-mono focus:outline-none focus:ring-4 ${THEME.primary.ringFocus} transition-all`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-slate-550 flex items-center justify-between">
                      <span>ملاحظات</span>
                      <span className="text-slate-400 text-[10px]">
                        اختياري
                      </span>
                    </label>
                    <textarea
                      placeholder="أضف ملاحظات إضافية إن وجدت..."
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      rows={2.5}
                      className={`w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-4 ${THEME.primary.ringFocus} transition-all resize-none leading-relaxed text-slate-700`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-medium text-slate-500">
                      مرفق إيصال الصرف أو المستند القانوني (اختياري)
                    </label>
                    <div className="border-2 border-dashed rounded-2xl p-4 text-center border-slate-200 bg-slate-50/20">
                      <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-2">
                        <Upload size={14} />
                      </div>
                      <p className="text-[11px] font-medium text-slate-400">
                        رفع المرفقات قيد التفعيل
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3.5 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 border border-slate-150 rounded-2xl text-xs font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    إلغاء الإجراء
                  </button>
                  <button
                    type="submit"
                    className={`px-5 py-2.5 ${THEME.primary.solid} ${THEME.primary.solidHover} text-white text-xs font-medium rounded-2xl transition-all shadow-[0_4px_12px_${THEME.primary.shadowSoft}] active:scale-95 cursor-pointer`}
                  >
                    تأكيد إدخال الصادر
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
