import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { updateProfile } from '../../auth/api/auth';
import { PageHeader } from '../../../components/ui/PageHeader';
import { User, Mail, Lock, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { THEME } from '../../../theme';
import * as XLSX from 'xlsx';
import { getPeople } from '../../personal/api/persons';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Initialize fields with current user data
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const data: any = { name, email };
      if (password) {
        data.password = password;
      }
      
      const response = await updateProfile(data);
      setSuccessMsg(response.message || 'تم تحديث البيانات بنجاح');
      setPassword(''); // Clear password field after successful update
      
      // Update local storage user data so sidebar updates immediately
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        parsedUser.name = response.user.name;
        parsedUser.email = response.user.email;
        localStorage.setItem('auth_user', JSON.stringify(parsedUser));
      }
      
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء التحديث');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const people = await getPeople();
      if (!people || people.length === 0) {
        setErrorMsg('لا توجد بيانات للتصدير');
        return;
      }

      const wb = XLSX.utils.book_new();

      const statusTranslation: Record<string, string> = {
        'active': 'نشط',
        'inactive': 'غير نشط',
        'suspended': 'موقوف',
      };

      people.forEach((person) => {
        const wsData = [
          ['معلومات السجل'],
          ['الاسم', person.name],
          ['رقم الهاتف', person.phone],
          ['الشركة/النشاط', person.company || '-'],
          ['العنوان', person.address || '-'],
          ['الحالة', statusTranslation[person.status] || person.status],
          ['الرصيد', person.balance],
          ['تاريخ الإضافة', person.created_at ? person.created_at.split('T')[0] : '-'],
          ['الملاحظات', person.notes || '-']
        ];

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        
        let sheetName = person.name.substring(0, 31).replace(/[\\/?*[\]:]/g, '_');
        let counter = 1;
        let finalSheetName = sheetName;
        while (wb.SheetNames.includes(finalSheetName)) {
          finalSheetName = `${sheetName.substring(0, 28)}_${counter}`;
          counter++;
        }

        XLSX.utils.book_append_sheet(wb, ws, finalSheetName);
      });

      XLSX.writeFile(wb, 'سجلات_المستخدمين.xlsx');
    } catch (err) {
      setErrorMsg('حدث خطأ أثناء التصدير');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="الملف الشخصي">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className={`flex items-center gap-1.5 px-4 py-2 border border-emerald-100 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 text-xs font-medium rounded-2xl transition-all cursor-pointer active:scale-95 ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <FileText size={13} />
          <span>{isExporting ? 'جاري التصدير...' : 'تصدير Excel'}</span>
        </button>
      </PageHeader>

      <div className="max-w-xl mx-auto bg-white rounded-[1.8rem] border border-slate-100 p-8 shadow-sm">
        
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 rounded-xl flex items-start gap-3 border border-emerald-100">
            <CheckCircle className="text-emerald-600 mt-0.5 shrink-0" size={18} />
            <p className="text-emerald-700 text-sm font-medium">{successMsg}</p>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 rounded-xl flex items-start gap-3 border border-red-100">
            <AlertCircle className="text-red-600 mt-0.5 shrink-0" size={18} />
            <p className="text-red-700 text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">الاسم</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-3 pr-10 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-100 focus:border-slate-400 transition-colors"
                placeholder="اسم المستخدم"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">البريد الإلكتروني (اسم الدخول)</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-3 pr-10 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-100 focus:border-slate-400 transition-colors"
                placeholder="البريد الإلكتروني"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">كلمة المرور الجديدة</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-3 pr-10 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-100 focus:border-slate-400 transition-colors"
                placeholder="اتركه فارغاً إذا لم ترد تغييره"
                dir="ltr"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white ${THEME.primary.solid} ${THEME.primary.solidHover} focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
