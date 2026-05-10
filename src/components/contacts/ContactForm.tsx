import { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import type { Contact, ContactStatus } from '../../types/contact';

const statusOpts = [
  { value: 'lead', label: 'Lead' },
  { value: 'prospect', label: 'Prospect' },
  { value: 'customer', label: 'Customer' },
  { value: 'churned', label: 'Churned' },
];

interface Props {
  contact?: Contact;
  onSubmit: (d: { first_name: string; last_name: string; email: string | null; phone: string | null; company: string | null; job_title: string | null; status: ContactStatus }) => Promise<void>;
  onCancel: () => void;
}

export function ContactForm({ contact, onSubmit, onCancel }: Props) {
  const [saving, setSaving] = useState(false);
  const [fn, setFn] = useState(contact?.first_name ?? '');
  const [ln, setLn] = useState(contact?.last_name ?? '');
  const [email, setEmail] = useState(contact?.email ?? '');
  const [phone, setPhone] = useState(contact?.phone ?? '');
  const [company, setCompany] = useState(contact?.company ?? '');
  const [jobTitle, setJobTitle] = useState(contact?.job_title ?? '');
  const [status, setStatus] = useState<ContactStatus>(contact?.status ?? 'lead');

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({ first_name: fn, last_name: ln, email: email || null, phone: phone || null, company: company || null, job_title: jobTitle || null, status });
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handle} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Input id="fn" label="First Name" value={fn} onChange={(e) => setFn(e.target.value)} required placeholder="John" />
        <Input id="ln" label="Last Name" value={ln} onChange={(e) => setLn(e.target.value)} required placeholder="Doe" />
      </div>
      <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
      <Input id="phone" label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555-1234" />
      <div className="grid grid-cols-2 gap-3">
        <Input id="company" label="Company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Inc" />
        <Input id="job" label="Job Title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="CEO" />
      </div>
      <Select id="status" label="Status" value={status} onChange={(e) => setStatus(e.target.value as ContactStatus)} options={statusOpts} />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" size="sm" onClick={onCancel} disabled={saving}>Cancel</Button>
        <Button type="submit" size="sm" disabled={saving}>{saving ? 'Saving...' : contact ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  );
}
