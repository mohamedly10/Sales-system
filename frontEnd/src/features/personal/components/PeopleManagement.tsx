import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical, 
  Settings, 
  SlidersHorizontal,
  UserCheck,
  Plus,
  X,
  Phone,
  MapPin,
  Building2,
  Calendar,
  FileText,
  RefreshCw,
  Trash2,
  FolderOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { THEME } from '../../../theme';
import { SearchInput } from '../../../components/ui/SearchInput';
import { Dropdown, DropdownOption } from '../../../components/ui/Dropdown';
import { PageHeader } from '../../../components/ui/PageHeader';
import {
  getPeople,
  createPerson,
  deletePerson,
  PersonData,
  CreatePersonPayload,
} from '../api/persons';

// ترجمة الحالات لكي تناسب خط الهوية الموحد وتنسيق جدول المستخدمين
const statusTranslation: Record<string, { ar: string; class: string }> = {
  'active': { ar: 'نشط', class: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
  'inactive': { ar: 'غير نشط', class: 'bg-slate-100 text-slate-600 border border-slate-200' },
  'suspended': { ar: 'موقوف', class: 'bg-amber-50 text-amber-600 border border-amber-100' },
};

const filterOptions: DropdownOption[] = [
  { value: 'All', label: 'الكل' },
  { value: 'active', label: 'نشط' },
  { value: 'inactive', label: 'غير نشط' },
  { value: 'suspended', label: 'موقوف' },
];

// مكون شارة الحالة الموائمة للهوية الموحدة
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const meta = statusTranslation[status] || { ar: status, class: 'bg-slate-100 text-slate-600 border border-slate-200' };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${meta.class}`}>
      {meta.ar}
    </span>
  );
};

export const PeopleManagement: React.FC = () => {
  const [people, setPeople] = useState<PersonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal related state
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // حقول الإدخال المطلوبة والداعمة للهيكلية المطلوبة
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formCompanyName, setFormCompanyName] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formStatus, setFormStatus] = useState('active');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPeople();
      setPeople(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تحميل البيانات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // التعامل مع تحديد الصفوف (Checkbox Row Selection)
  const toggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    const visibleRowIds = filteredPeople.map(p => p.id);
    const allVisibleSelected = visibleRowIds.every(id => selectedRows.includes(id));

    if (allVisibleSelected) {
      setSelectedRows(prev => prev.filter(id => !visibleRowIds.includes(id)));
    } else {
      setSelectedRows(prev => Array.from(new Set([...prev, ...visibleRowIds])));
    }
  };

  // معالجة البحث والفلترة (Searching & Filtering)
  const filteredPeople = people.filter((person) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      person.name.toLowerCase().includes(query) ||
      (person.phone ?? '').includes(query) ||
      (person.company ?? '').toLowerCase().includes(query) ||
      (person.address ?? '').toLowerCase().includes(query) ||
      (person.notes ?? '').toLowerCase().includes(query);
    
    const matchesFilter = statusFilter === 'All' || person.status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  // Handle Form Submission for new person record
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) return;

    try {
      setError(null);
      const payload: CreatePersonPayload = {
        name: formName.trim(),
        phone: formPhone.trim(),
        company: formCompanyName.trim() || undefined,
        address: formAddress.trim() || undefined,
        status: formStatus,
        notes: formNotes.trim() || undefined,
      };

      await createPerson(payload);
      
      setFormName('');
      setFormPhone('');
      setFormAddress('');
      setFormCompanyName('');
      setFormNotes('');
      setFormStatus('active');
      setIsModalOpen(false);

      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل إضافة السجل');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePerson(id);
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل حذف السجل');
    }
  };

  const deleteSelected = async () => {
    try {
      await Promise.all(selectedRows.map((id) => deletePerson(id)));
      setSelectedRows([]);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل حذف المحدد');
    }
  };

  if (loading && people.length === 0) {
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

      {/* بطاقة الإحصائيات السريعة للجدول الدائري */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between font-sans">
          <div>
            <span className="text-[11px] font-medium text-slate-400">إجمالي الأشخاص والجهات</span>
            <h4 className="text-xl font-semibold text-slate-800 mt-1">{people.length}</h4>
          </div>
          <div className={`w-10 h-10 rounded-xl ${THEME.primary.lightBg} flex items-center justify-center ${THEME.primary.text}`}>
            <SlidersHorizontal size={18} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between font-sans">
          <div>
            <span className="text-[11px] font-medium text-slate-400">الصفوف المحددة</span>
            <h4 className="text-xl font-semibold text-slate-800 mt-1">{selectedRows.length}</h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserCheck size={18} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between font-sans">
          <div>
            <span className="text-[11px] font-medium text-slate-400">المستخدمين النشطين</span>
            <h4 className="text-xl font-semibold text-slate-800 mt-1">
              {people.filter(p => p.status === 'active').length}
            </h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Settings size={18} />
          </div>
        </div>
      </div>

      <PageHeader title="قائمة السجلات والبيانات الحالية">
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
          <span>إضافة مستخدم</span>
        </button>
      </PageHeader>

      {/* الحاوية الرئيسية للجدول */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden font-sans">
        
        {/* شريط الأدوات العلوي مع اتجاه RTL متناسق كلياً */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-5 border-b border-slate-50 gap-4">
          
          {/* البحث وتصفية الفلاتر باستخدام المكونات المنفصلة Reusable Components */}
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <SearchInput 
              value={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="البحث عن اسم، هاتف، شركة، عنوان أو ملاحظات..."
              className="max-w-xs"
            />
            
            <Dropdown 
              options={filterOptions}
              selectedValue={statusFilter}
              onChange={setStatusFilter}
              placeholder="حسب الحالة"
            />
          </div>

          {/* الترقيم (Pagination) والتأثيرات */}
          <div className="flex flex-wrap items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-50">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-medium text-slate-400 select-none">عدد الصفوف: {filteredPeople.length}</span>
              <div className="flex items-center gap-1.5">
                <button className="p-1 hover:bg-slate-50 border border-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-all cursor-pointer">
                  <ChevronRight size={14} />
                </button>
                <span className="text-xs font-medium text-slate-600 px-1 font-mono">1 من 1</span>
                <button className="p-1 hover:bg-slate-50 border border-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-all cursor-pointer">
                  <ChevronLeft size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* عرض للبيانات باستخدام الجدول responsive */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-16 flex items-center justify-center">
              <RefreshCw size={20} className="text-slate-300 animate-spin" />
            </div>
          ) : filteredPeople.length > 0 ? (
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-4 w-12 text-center select-none">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-200 text-red-600 focus:ring-0 cursor-pointer accent-red-600"
                      onChange={toggleAll}
                      checked={filteredPeople.length > 0 && filteredPeople.every(p => selectedRows.includes(p.id))}
                    />
                  </th>
                  <th className="p-4 text-xs font-medium tracking-wider text-slate-400">الاسم / الجهة</th>
                  <th className="p-4 text-xs font-medium tracking-wider text-slate-400">رقم الهاتف</th>
                  <th className="p-4 text-xs font-medium tracking-wider text-slate-400">النشاط / الشركة</th>
                  <th className="p-4 text-xs font-medium tracking-wider text-slate-400">العنوان</th>
                  <th className="p-4 text-xs font-medium tracking-wider text-slate-400">تاريخ الإضافة</th>
                  <th className="p-4 text-xs font-medium tracking-wider text-slate-400">الحالة</th>
                  <th className="p-4 text-xs font-medium tracking-wider text-slate-400">تفاصيل / ملاحظات</th>
                  <th className="p-4 w-12 text-center text-slate-400">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPeople.map((row) => {
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
                      <td className="p-4 text-xs font-medium text-slate-800">{row.name}</td>
                      <td className="p-4 text-xs font-medium text-slate-600 font-mono" dir="ltr">{row.phone}</td>
                      <td className="p-4 text-xs font-medium text-slate-700">{row.company}</td>
                      <td className="p-4 text-xs font-normal text-slate-500">{row.address}</td>
                      <td className="p-4 text-xs font-normal text-slate-500 font-mono" dir="ltr">{row.created_at?.split('T')[0] ?? '-'}</td>
                      <td className="p-4 text-right">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="p-4 text-xs text-slate-400 truncate max-w-[200px]" title={row.notes ?? ''}>
                        {row.notes ?? '-'}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="text-slate-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="حذف السجل"
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
              <div className={`w-12 h-12 rounded-full ${THEME.primary.lightBg} flex items-center justify-center ${THEME.primary.text} mb-3`}>
                <FolderOpen size={20} />
              </div>
              <h4 className="text-xs font-medium text-slate-500">
                لا توجد سجلات مطابقة لعوامل هذا التصفية
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                يرجى تعديل معلمات تصفية البحث أو الضغط على زر "إضافة مستخدم" لإدراج سجل جديد.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* نافذة إضافة مستخدم جديد بتبويبين وبيانات دقيقة وسرية متوافقة مع الهوية الموحدة */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Dialog Card Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative bg-white rounded-3xl border border-slate-100 p-6 w-full max-w-lg z-10 space-y-5 font-sans"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl ${THEME.primary.lightBg} ${THEME.primary.text} flex items-center justify-center`}>
                    <Plus size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-800">إضافة سجل شخص / جهة جديدة</h3>
                    <p className="text-[10px] text-slate-400 font-medium">املأ البيانات أدناه لإدخال المستخدم لقاعدة البيانات الموحدة</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* 1. البيانات الأساسية (إجبارية) */}
                <div className="space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium text-xs pb-1 border-b border-slate-100/70">
                    <span className="w-1.5 h-3 rounded bg-red-500" />
                    <span>١. البيانات الأساسية (إجبارية)</span>
                  </div>

                  {/* اسم الشخص / الجهة */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-slate-550 flex items-center justify-between">
                      <span>اسم الشخص / الجهة بالكامل</span>
                      <span className="text-red-500 text-[10px]">* حقل مطلوب</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="مثال: المهندس أحمد الورفلي"
                      className={`w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-4 ${THEME.primary.ringFocus} transition-all`}
                    />
                  </div>

                  {/* رقم الهاتف */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-slate-550 flex items-center justify-between">
                      <span>رقم الهاتف المباشر</span>
                      <span className="text-red-500 text-[10px]">* حقل مطلوب</span>
                    </label>
                    <div className="relative">
                      <Phone size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value.replace(/[^0-9+]/g, ''))}
                        placeholder="مثال: 0911234567"
                        dir="ltr"
                        className={`w-full pr-10 pl-3.5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-700 font-mono focus:outline-none focus:ring-4 ${THEME.primary.ringFocus} transition-all text-right`}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. البيانات الإضافية (اختيارية) */}
                <div className="space-y-3 bg-slate-50/20 p-4 rounded-2xl border border-dotted border-slate-200">
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium text-xs pb-1 border-b border-slate-100">
                    <span className="w-1.5 h-3 rounded bg-slate-400" />
                    <span>٢. البيانات الإضافية (اختيارية)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* اسم النشاط أو الشركة */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-medium text-slate-500">اسم النشاط أو الشركة</label>
                      <div className="relative">
                        <Building2 size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={formCompanyName}
                          onChange={(e) => setFormCompanyName(e.target.value)}
                          placeholder="مثال: شركة المدار للخدمات"
                          className={`w-full pr-8 pl-3.5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-4 ${THEME.primary.ringFocus} transition-all`}
                        />
                      </div>
                    </div>

                    {/* عنوان السكن أو العمل */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-medium text-slate-550">عنوان الإقامة أو العمل</label>
                      <div className="relative">
                        <MapPin size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={formAddress}
                          onChange={(e) => setFormAddress(e.target.value)}
                          placeholder="مثال: طرابلس، حي الأندلس"
                          className={`w-full pr-8 pl-3.5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-4 ${THEME.primary.ringFocus} transition-all`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* حالة الحساب المقترحة */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-medium text-slate-550">حالة السجل الأولية</label>
                      <select
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value)}
                        className={`w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-4 ${THEME.primary.ringFocus} cursor-pointer transition-all`}
                      >
                        <option value="active">نشط</option>
                        <option value="inactive">غير نشط</option>
                        <option value="suspended">موقوف</option>
                      </select>
                    </div>

                    {/* رمز المرجع التلقائي */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-medium text-slate-550">رمز المرجع</label>
                      <div className="relative">
                        <FileText size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          disabled
                          value="يُحدد تلقائياً"
                          className="w-full pr-8 pl-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs font-medium text-slate-400 font-mono text-center select-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ملاحظات للعمل */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-slate-550">تفاصيل وملاحظات العمل</label>
                    <textarea
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      placeholder="اكتب هنا أي تفاصيل تخص العميل، طريقة التعامل المالي، جهات الاتصال البديلة أو السلوك التجاري..."
                      rows={2}
                      className={`w-full px-3.5 py-2 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-4 ${THEME.primary.ringFocus} transition-all resize-none`}
                    />
                  </div>
                </div>

                {/* أزرار الحفظ والإلغاء المترابطة */}
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="submit"
                    className={`flex-1 py-2.5 rounded-2xl text-xs font-medium text-white cursor-pointer transition-all active:scale-98 ${THEME.primary.solid} ${THEME.primary.solidHover}`}
                  >
                    تأكيد وإضافة السجل
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 border border-slate-150 rounded-2xl text-xs font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    إلغاء التعديل
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
