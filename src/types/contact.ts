export type ContactStatus = 'lead' | 'prospect' | 'customer' | 'churned';

export interface Contact {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  job_title: string | null;
  status: ContactStatus;
  created_at: string;
  updated_at: string;
}

export type ContactInsert = Omit<Contact, 'id' | 'created_at' | 'updated_at'>;
export type ContactUpdate = Partial<ContactInsert>;
