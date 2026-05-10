import { cn } from '../../lib/utils';
import type { ReactNode } from 'react';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900', className)}>
      {children}
    </div>
  );
}
