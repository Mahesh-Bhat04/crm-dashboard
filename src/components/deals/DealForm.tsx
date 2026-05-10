import { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import type { Deal, DealStage } from '../../types/deal';

const stageOpts = [
  { value: 'qualification', label: 'Qualification' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'closed_won', label: 'Closed Won' },
  { value: 'closed_lost', label: 'Closed Lost' },
];

interface Props {
  deal?: Deal;
  onSubmit: (d: { title: string; value: number; stage: DealStage; contact_id: string | null; expected_close_date: string | null }) => Promise<void>;
  onCancel: () => void;
}

export function DealForm({ deal, onSubmit, onCancel }: Props) {
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState(deal?.title ?? '');
  const [value, setValue] = useState(deal?.value?.toString() ?? '');
  const [stage, setStage] = useState<DealStage>(deal?.stage ?? 'qualification');
  const [closeDate, setCloseDate] = useState(deal?.expected_close_date ?? '');

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({ title, value: parseFloat(value) || 0, stage, contact_id: null, expected_close_date: closeDate || null });
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handle} className="space-y-3">
      <Input id="title" label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Enterprise license" />
      <Input id="value" label="Value ($)" type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="10000" min="0" step="0.01" />
      <Select id="stage" label="Stage" value={stage} onChange={(e) => setStage(e.target.value as DealStage)} options={stageOpts} />
      <Input id="close" label="Expected Close" type="date" value={closeDate} onChange={(e) => setCloseDate(e.target.value)} />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" size="sm" onClick={onCancel} disabled={saving}>Cancel</Button>
        <Button type="submit" size="sm" disabled={saving}>{saving ? 'Saving...' : deal ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  );
}
