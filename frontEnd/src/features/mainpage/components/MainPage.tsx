import React, { useCallback, useEffect, useState } from 'react';
import { Users, Inbox, Send, Plus, DollarSign, Activity, Scale } from 'lucide-react';
import { THEME } from '../../../theme';
import { PageHeader } from '../../../components/ui/PageHeader';
import { getStats, Stats } from '../api/stats';

const formatAmount = (n: number) =>
  n.toLocaleString('ar-LY') + ' د.ل';

export const MainPage: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تحميل البيانات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const cards = stats ? [
    { icon: Users, title: 'المستخدمين', label: 'إجمالي المستخدمين', value: String(stats.total_persons) },
    { icon: Inbox, title: 'المقبوضات', label: 'عدد المقبوضات', value: String(stats.total_imports) },
    { icon: DollarSign, title: 'قيمة المقبوضات', label: 'إجمالي قيمة المقبوضات', value: formatAmount(stats.total_imports_amount) },
    { icon: Send, title: 'المصروفات', label: 'عدد المصروفات', value: String(stats.total_exports) },
    { icon: DollarSign, title: 'قيمة المصروفات', label: 'إجمالي قيمة المصروفات', value: formatAmount(stats.total_exports_amount) },
    { icon: Scale, title: 'الرصيد', label: 'الرصيد الحالي', value: formatAmount(stats.balance) },
    { icon: Activity, title: 'عمليات اليوم', label: 'عدد العمليات اليوم', value: String(stats.today_operations) },
  ] : [];

  return (
    <div className="w-full space-y-6">
      <PageHeader title="نظرة عامة">

      </PageHeader>

      <div className="flex flex-wrap gap-6">
        {loading ? (
          <p className="text-slate-500 text-lg">جاري التحميل...</p>
        ) : error ? (
          <p className="text-red-500 text-lg">{error}</p>
        ) : (
          cards.map((card) => {
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
          })
        )}
      </div>
    </div>
  );
};
