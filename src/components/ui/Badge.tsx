import { cn } from '../../lib/utils';

const v = {
  default: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  primary: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400',
  success: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
  warning: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
  danger: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
};

export function Badge({ children, variant = 'default', className }: { children: React.ReactNode; variant?: keyof typeof v; className?: string }) {
  return <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium', v[variant], className)}>{children}</span>;
}
