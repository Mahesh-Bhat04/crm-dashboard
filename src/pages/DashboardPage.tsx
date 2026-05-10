import { Users, DollarSign, TrendingUp, Target } from 'lucide-react';
import { MetricCard } from '../components/dashboard/MetricCard';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { RevenueLineChart } from '../components/charts/RevenueLineChart';
import { DealsPieChart } from '../components/charts/DealsPieChart';
import { ContactsBarChart } from '../components/charts/ContactsBarChart';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useActivities } from '../hooks/useActivities';
import { formatCurrency } from '../lib/utils';

export function DashboardPage() {
  const { stats, loading: sl } = useDashboardStats();
  const { activities, loading: al } = useActivities();

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Dashboard</h1>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard label="Contacts" value={sl ? '—' : String(stats.totalContacts)} icon={Users} color="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" />
        <MetricCard label="Deals" value={sl ? '—' : String(stats.totalDeals)} icon={Target} color="bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400" />
        <MetricCard label="Revenue" value={sl ? '—' : formatCurrency(stats.totalRevenue)} icon={DollarSign} color="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" />
        <MetricCard label="Win Rate" value={sl ? '—' : `${stats.conversionRate}%`} icon={TrendingUp} color="bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <RevenueLineChart data={stats.revenueByMonth} />
        <DealsPieChart data={stats.dealsByStage} />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <ContactsBarChart data={stats.contactsByMonth} />
        <ActivityFeed activities={activities} loading={al} />
      </div>
    </div>
  );
}
