import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import { useTheme } from '../../contexts/ThemeContext';

export function RevenueLineChart({ data }: { data: { month: string; revenue: number }[] }) {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const allZero = data.every((d) => d.revenue === 0);

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Revenue Trend</h3>
      <p className="text-xs text-slate-400">Last 6 months</p>
      <div className="mt-4 h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="rv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={dark ? 0.15 : 0.1} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#1e293b' : '#f1f5f9'} vertical={false} />
            <XAxis dataKey="month" tick={{ fill: dark ? '#64748b' : '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: dark ? '#64748b' : '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} domain={allZero ? [0, 100] : ['auto', 'auto']} allowDecimals={false} />
            <Tooltip contentStyle={{ background: dark ? '#1e293b' : '#fff', border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`, borderRadius: 8, fontSize: 12, color: dark ? '#e2e8f0' : '#334155' }} formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Revenue']} />
            <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#rv)" dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: '#6366f1' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
