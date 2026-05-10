import { useState, useMemo } from 'react';
import {
  useReactTable, getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel, flexRender,
  type ColumnDef, type SortingState,
} from '@tanstack/react-table';
import { Pencil, Trash2, ChevronLeft, ChevronRight, Search, ChevronsUpDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatCurrency, formatDate } from '../../lib/utils';
import type { Deal, DealStage } from '../../types/deal';

const sv: Record<DealStage, 'primary' | 'warning' | 'success' | 'danger' | 'default'> = { qualification: 'primary', proposal: 'warning', negotiation: 'default', closed_won: 'success', closed_lost: 'danger' };
const sl: Record<DealStage, string> = { qualification: 'Qualification', proposal: 'Proposal', negotiation: 'Negotiation', closed_won: 'Won', closed_lost: 'Lost' };

interface Props { deals: Deal[]; loading: boolean; onEdit: (d: Deal) => void; onDelete: (d: Deal) => void }

export function DealsTable({ deals, loading, onEdit, onDelete }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('all');

  const filtered = useMemo(() => stageFilter === 'all' ? deals : deals.filter((d) => d.stage === stageFilter), [deals, stageFilter]);

  const columns = useMemo<ColumnDef<Deal>[]>(() => [
    {
      accessorKey: 'title',
      header: ({ column }) => <button type="button" className="flex items-center gap-1" onClick={() => column.toggleSorting()}>Deal <ChevronsUpDown className="h-3 w-3 text-slate-400" /></button>,
      cell: ({ getValue }) => <span className="text-sm font-medium text-slate-900 dark:text-white">{getValue() as string}</span>,
    },
    {
      accessorKey: 'value',
      header: ({ column }) => <button type="button" className="flex items-center gap-1" onClick={() => column.toggleSorting()}>Value <ChevronsUpDown className="h-3 w-3 text-slate-400" /></button>,
      cell: ({ getValue }) => <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(getValue() as number)}</span>,
    },
    { accessorKey: 'stage', header: 'Stage', cell: ({ getValue }) => { const s = getValue() as DealStage; return <Badge variant={sv[s]}>{sl[s]}</Badge>; } },
    { accessorKey: 'expected_close_date', header: 'Close Date', cell: ({ getValue }) => <span className="text-sm text-slate-500">{(getValue() as string | null) ? formatDate(getValue() as string) : '—'}</span> },
    { accessorKey: 'created_at', header: 'Created', cell: ({ getValue }) => <span className="text-sm text-slate-500">{formatDate(getValue() as string)}</span> },
    {
      id: 'actions',
      cell: ({ row: { original: o } }) => (
        <div className="flex gap-1 justify-end">
          <Button variant="ghost" size="sm" onClick={() => onEdit(o)}><Pencil className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(o)}><Trash2 className="h-3.5 w-3.5 text-red-500" /></Button>
        </div>
      ),
    },
  ], [onEdit, onDelete]);

  const table = useReactTable({
    data: filtered, columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  if (loading) return <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />)}</div>;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search deals..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500" />
        </div>
        <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} title="Filter stage" className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <option value="all">All Stages</option>
          <option value="qualification">Qualification</option>
          <option value="proposal">Proposal</option>
          <option value="negotiation">Negotiation</option>
          <option value="closed_won">Won</option>
          <option value="closed_lost">Lost</option>
        </select>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-slate-100 dark:border-slate-800">
                  {hg.headers.map((h) => (
                    <th key={h.id} className="px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr><td colSpan={columns.length} className="py-10 text-center text-sm text-slate-400">No deals found</td></tr>
              ) : table.getRowModel().rows.map((r) => (
                <tr key={r.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 dark:border-slate-800/50 dark:hover:bg-slate-800/30">
                  {r.getVisibleCells().map((c) => <td key={c.id} className="px-4 py-2.5">{flexRender(c.column.columnDef.cell, c.getContext())}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 dark:border-slate-800">
          <span className="text-xs text-slate-500">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1} ({filtered.length} total)</span>
          <div className="flex gap-1">
            <Button variant="secondary" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><ChevronLeft className="h-3.5 w-3.5" /></Button>
            <Button variant="secondary" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><ChevronRight className="h-3.5 w-3.5" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
