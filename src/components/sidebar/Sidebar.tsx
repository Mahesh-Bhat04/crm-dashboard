import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, DollarSign, PanelLeftClose, PanelLeft } from 'lucide-react';
import { cn } from '../../lib/utils';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/contacts', label: 'Contacts', icon: Users },
  { to: '/deals', label: 'Deals', icon: DollarSign },
];

interface Props {
  collapsed: boolean;
  toggleCollapse: () => void;
  mobileOpen: boolean;
  closeMobile: () => void;
}

export function Sidebar({ collapsed, toggleCollapse, mobileOpen, closeMobile }: Props) {
  const nav = (
    <div className="flex h-full flex-col">
      {/* brand */}
      <div className="flex h-14 items-center gap-2 px-3 shrink-0">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-indigo-600 text-xs font-bold text-white">C</div>
        {!collapsed && <span className="text-sm font-semibold text-slate-800 dark:text-white">CRM Dash</span>}
      </div>

      {/* links */}
      <nav className="mt-2 flex-1 space-y-1 px-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={closeMobile}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors',
                isActive
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>

      {/* collapse toggle — desktop only */}
      <button
        type="button"
        onClick={toggleCollapse}
        title="Toggle sidebar"
        className="hidden lg:flex items-center justify-center h-10 mx-2 mb-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
      >
        {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
      </button>
    </div>
  );

  return (
    <>
      {/* backdrop */}
      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={closeMobile} />}

      {/* mobile drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-56 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {nav}
      </aside>

      {/* desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:block shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-all duration-200',
          collapsed ? 'w-14' : 'w-52'
        )}
      >
        {nav}
      </aside>
    </>
  );
}
