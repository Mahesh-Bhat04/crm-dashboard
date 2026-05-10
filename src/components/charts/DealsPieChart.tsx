import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import { useTheme } from '../../contexts/ThemeContext';

const COLORS = ['#6366f1', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];
const LABELS: Record<string, string> = { qualification: 'Qualification', proposal: 'Proposal', negotiation: 'Negotiation', closed_won: 'Won', closed_lost: 'Lost' };

export function DealsPieChart({ data }: { data: { stage: string; count: number }[] }) {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const items = data.map((d) => ({ ...d, name: LABELS[d.stage] || d.stage }));

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Deals by Stage</h3>
      <p className="text-xs text-slate-400">Pipeline breakdown</p>
      <div className="mt-4 h-52 flex items-center justify-center">
        {data.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-slate-500">No deals yet</p>
        ) : (
          <div className="flex items-center gap-6 w-full">
            <div className="w-36 h-36 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={items} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="count" strokeWidth={0}>
                    {items.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: dark ? '#1e293b' : '#fff', border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`, borderRadius: 8, fontSize: 12, color: dark ? '#e2e8f0' : '#334155' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2.5">
              {items.map((item, i) => (
                <div key={item.stage} className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-slate-600 dark:text-slate-400 flex-1">{item.name}</span>
                  <span className="font-medium text-slate-900 dark:text-white tabular-nums">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
