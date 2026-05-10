import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { DealsTable } from '../components/deals/DealsTable';
import { DealForm } from '../components/deals/DealForm';
import { useDeals } from '../hooks/useDeals';
import type { Deal } from '../types/deal';

export function DealsPage() {
  const { deals, loading, createDeal, updateDeal, deleteDeal } = useDeals();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Deal>();
  const [deleting, setDeleting] = useState<Deal>();
  const [delLoading, setDelLoading] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 min-w-0">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white truncate">Deals</h1>
        <Button size="sm" className="shrink-0" onClick={() => setCreateOpen(true)}><Plus className="h-3.5 w-3.5" /> Add Deal</Button>
      </div>

      <DealsTable deals={deals} loading={loading} onEdit={setEditing} onDelete={setDeleting} />

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Deal">
        <DealForm onSubmit={async (d) => { await createDeal(d); setCreateOpen(false); toast.success('Deal created'); }} onCancel={() => setCreateOpen(false)} />
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(undefined)} title="Edit Deal">
        {editing && <DealForm deal={editing} onSubmit={async (d) => { await updateDeal(editing.id, d); setEditing(undefined); toast.success('Deal updated'); }} onCancel={() => setEditing(undefined)} />}
      </Modal>

      <ConfirmDialog
        open={!!deleting} onClose={() => setDeleting(undefined)}
        onConfirm={async () => { if (!deleting) return; setDelLoading(true); try { await deleteDeal(deleting.id, deleting.title); setDeleting(undefined); toast.success('Deal deleted'); } catch { toast.error('Failed to delete'); } finally { setDelLoading(false); } }}
        title="Delete Deal" message={`Delete "${deleting?.title}"? This can't be undone.`} loading={delLoading}
      />
    </div>
  );
}
