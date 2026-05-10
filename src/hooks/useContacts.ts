import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@clerk/react';
import { supabase } from '../lib/supabase';
import type { Contact, ContactInsert, ContactUpdate } from '../types/contact';

export function useContacts() {
  const { userId } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching contacts:', error);
    else setContacts(data || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const createContact = async (contact: Omit<ContactInsert, 'user_id'>) => {
    if (!userId) return;
    const { error } = await supabase.from('contacts').insert({ ...contact, user_id: userId });
    if (error) throw error;

    await supabase.from('activities').insert({
      user_id: userId,
      entity_type: 'contact',
      entity_id: crypto.randomUUID(),
      action: 'created',
      description: `Created contact ${contact.first_name} ${contact.last_name}`,
    });

    await fetchContacts();
  };

  const updateContact = async (id: string, updates: ContactUpdate) => {
    if (!userId) return;
    const { error } = await supabase
      .from('contacts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId);
    if (error) throw error;

    await supabase.from('activities').insert({
      user_id: userId,
      entity_type: 'contact',
      entity_id: id,
      action: 'updated',
      description: `Updated contact ${updates.first_name || ''} ${updates.last_name || ''}`.trim(),
    });

    await fetchContacts();
  };

  const deleteContact = async (id: string, name: string) => {
    if (!userId) return;
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    if (error) throw error;

    await supabase.from('activities').insert({
      user_id: userId,
      entity_type: 'contact',
      entity_id: id,
      action: 'deleted',
      description: `Deleted contact ${name}`,
    });

    await fetchContacts();
  };

  return { contacts, loading, fetchContacts, createContact, updateContact, deleteContact };
}
