import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import { useTheme } from '../../contexts/ThemeContext';

export function ContactsBarChart({ data }: { data: { month: string; count: number }[] }) {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const allZero = data.every((d) => d.count === 0);

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Contacts Added</h3>
      <p className="text-xs text-slate-400">Last 6 months</p>
      <div className="mt-4 h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#1e293b' : '#f1f5f9'} vertical={false} />
            <XAxis dataKey="month" tick={{ fill: dark ? '#64748b' : '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: dark ? '#64748b' : '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} domain={allZero ? [0, 10] : ['auto', 'auto']} />
            <Tooltip contentStyle={{ background: dark ? '#1e293b' : '#fff', border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`, borderRadius: 8, fontSize: 12, color: dark ? '#e2e8f0' : '#334155' }} cursor={{ fill: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }} />
            <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
