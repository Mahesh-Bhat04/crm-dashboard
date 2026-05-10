import { useState, useMemo } from 'react';
import {
  useReactTable, getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel, flexRender,
  type ColumnDef, type SortingState,
} from '@tanstack/react-table';
import { Pencil, Trash2, ChevronLeft, ChevronRight, Search, ChevronsUpDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatDate } from '../../lib/utils';
import type { Contact, ContactStatus } from '../../types/contact';

const sv: Record<ContactStatus, 'primary' | 'warning' | 'success' | 'danger'> = { lead: 'primary', prospect: 'warning', customer: 'success', churned: 'danger' };

interface Props { contacts: Contact[]; loading: boolean; onEdit: (c: Contact) => void; onDelete: (c: Contact) => void }

export function ContactsTable({ contacts, loading, onEdit, onDelete }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => statusFilter === 'all' ? contacts : contacts.filter((c) => c.status === statusFilter), [contacts, statusFilter]);

  const columns = useMemo<ColumnDef<Contact>[]>(() => [
    {
      id: 'name', accessorFn: (r) => `${r.first_name} ${r.last_name}`,
      header: ({ column }) => <button type="button" className="flex items-center gap-1" onClick={() => column.toggleSorting()}>Name <ChevronsUpDown className="h-3 w-3 text-slate-400" /></button>,
      cell: ({ row: { original: o } }) => (
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">{o.first_name} {o.last_name}</p>
          {o.email && <p className="text-xs text-slate-500">{o.email}</p>}
        </div>
      ),
    },
    { accessorKey: 'company', header: 'Company', cell: ({ getValue }) => <span className="text-sm text-slate-600 dark:text-slate-400">{(getValue() as string) || '—'}</span> },
    { accessorKey: 'status', header: 'Status', cell: ({ getValue }) => { const s = getValue() as ContactStatus; return <Badge variant={sv[s]}>{s}</Badge>; } },
    {
      accessorKey: 'created_at',
      header: ({ column }) => <button type="button" className="flex items-center gap-1" onClick={() => column.toggleSorting()}>Created <ChevronsUpDown className="h-3 w-3 text-slate-400" /></button>,
      cell: ({ getValue }) => <span className="text-sm text-slate-500">{formatDate(getValue() as string)}</span>,
    },
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
      {/* filters */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text" placeholder="Search contacts..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} title="Filter status" className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <option value="all">All Status</option>
          <option value="lead">Lead</option>
          <option value="prospect">Prospect</option>
          <option value="customer">Customer</option>
          <option value="churned">Churned</option>
        </select>
      </div>

      {/* table + pagination as one card */}
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
                <tr><td colSpan={columns.length} className="py-10 text-center text-sm text-slate-400">No contacts found</td></tr>
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
