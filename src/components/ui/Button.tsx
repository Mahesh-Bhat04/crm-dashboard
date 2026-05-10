import { cn } from '../../lib/utils';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

const v = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500/40',
  secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500/40',
  ghost: 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
};

const s = { sm: 'h-8 px-3 text-xs gap-1.5', md: 'h-9 px-4 text-sm gap-2' };

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof v;
  size?: keyof typeof s;
  children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', className, children, ...rest }: Props) {
  return (
    <button
      className={cn('inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none', v[variant], s[size], className)}
      {...rest}
    >
      {children}
    </button>
  );
}
