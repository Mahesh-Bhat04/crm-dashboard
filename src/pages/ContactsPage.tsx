import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { ContactsTable } from '../components/contacts/ContactsTable';
import { ContactForm } from '../components/contacts/ContactForm';
import { useContacts } from '../hooks/useContacts';
import type { Contact } from '../types/contact';

export function ContactsPage() {
  const { contacts, loading, createContact, updateContact, deleteContact } = useContacts();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Contact>();
  const [deleting, setDeleting] = useState<Contact>();
  const [delLoading, setDelLoading] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 min-w-0">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white truncate">Contacts</h1>
        <Button size="sm" className="shrink-0" onClick={() => setCreateOpen(true)}><Plus className="h-3.5 w-3.5" /> Add Contact</Button>
      </div>

      <ContactsTable contacts={contacts} loading={loading} onEdit={setEditing} onDelete={setDeleting} />

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Contact">
        <ContactForm onSubmit={async (d) => { await createContact(d); setCreateOpen(false); toast.success('Contact created'); }} onCancel={() => setCreateOpen(false)} />
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(undefined)} title="Edit Contact">
        {editing && <ContactForm contact={editing} onSubmit={async (d) => { await updateContact(editing.id, d); setEditing(undefined); toast.success('Contact updated'); }} onCancel={() => setEditing(undefined)} />}
      </Modal>

      <ConfirmDialog
        open={!!deleting} onClose={() => setDeleting(undefined)}
        onConfirm={async () => { if (!deleting) return; setDelLoading(true); try { await deleteContact(deleting.id, `${deleting.first_name} ${deleting.last_name}`); setDeleting(undefined); toast.success('Contact deleted'); } catch { toast.error('Failed to delete'); } finally { setDelLoading(false); } }}
        title="Delete Contact" message={`Delete ${deleting?.first_name} ${deleting?.last_name}? This can't be undone.`} loading={delLoading}
      />
    </div>
  );
}
