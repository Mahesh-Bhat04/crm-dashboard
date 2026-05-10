import { UserButton } from '@clerk/react';
import { Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function TopBar({ openMobile }: { openMobile: () => void }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900 md:px-6">
      <button
        type="button"
        onClick={openMobile}
        title="Open menu"
        className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={toggleTheme}
          title="Toggle theme"
          className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
        <UserButton appearance={{ elements: { avatarBox: 'h-7 w-7' } }} />
      </div>
    </header>
  );
}
