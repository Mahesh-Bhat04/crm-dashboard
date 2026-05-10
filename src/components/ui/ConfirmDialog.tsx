import { Modal } from './Modal';
import { Button } from './Button';

interface Props { open: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string; loading?: boolean }

export function ConfirmDialog({ open, onClose, onConfirm, title, message, loading }: Props) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">{message}</p>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" size="sm" onClick={onClose} disabled={loading}>Cancel</Button>
        <Button variant="danger" size="sm" onClick={onConfirm} disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</Button>
      </div>
    </Modal>
  );
}
