import { cn } from '../../lib/utils';
import type { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className, id, ...rest }: Props) {
  return (
    <div className="space-y-1.5">
      {label && <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
      <input
        id={id}
        className={cn(
          'h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400',
          'focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
          'dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500',
          className
        )}
        {...rest}
      />
    </div>
  );
}
