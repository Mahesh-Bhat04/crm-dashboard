import { cn } from '../../lib/utils';
import type { LucideIcon } from 'lucide-react';

interface Props { label: string; value: string; icon: LucideIcon; color: string }

export function MetricCard({ label, value, icon: Icon, color }: Props) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-lg', color)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-lg font-semibold text-slate-900 dark:text-white truncate">{value}</p>
      </div>
    </div>
  );
}
