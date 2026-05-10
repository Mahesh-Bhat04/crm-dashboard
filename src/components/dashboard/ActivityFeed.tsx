import { Card } from '../ui/Card';
import { formatRelativeTime } from '../../lib/utils';
import type { Activity } from '../../types/activity';
import { UserPlus, Pencil, Trash2, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const icons = {
  created: { icon: UserPlus, cls: 'text-emerald-500' },
  updated: { icon: Pencil, cls: 'text-blue-500' },
  deleted: { icon: Trash2, cls: 'text-red-500' },
  stage_changed: { icon: ArrowRight, cls: 'text-amber-500' },
};

export function ActivityFeed({ activities, loading }: { activities: Activity[]; loading: boolean }) {
  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Activity</h3>

      <div className="mt-4 space-y-1">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3 py-2">
              <div className="h-4 w-4 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
              <div className="flex-1 space-y-1">
                <div className="h-3 w-3/4 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
                <div className="h-3 w-1/3 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
              </div>
            </div>
          ))
        ) : activities.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">No activity yet. Add contacts or deals to get started.</p>
        ) : (
          activities.map((a) => {
            const { icon: Icon, cls } = icons[a.action];
            return (
              <div key={a.id} className="flex gap-3 rounded-lg px-1 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', cls)} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-700 dark:text-slate-300 truncate">{a.description}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{a.entity_type} &middot; {formatRelativeTime(a.created_at)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
