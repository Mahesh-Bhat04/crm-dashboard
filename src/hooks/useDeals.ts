import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@clerk/react';
import { supabase } from '../lib/supabase';
import type { Deal, DealInsert, DealUpdate } from '../types/deal';

export function useDeals() {
  const { userId } = useAuth();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeals = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching deals:', error);
    else setDeals(data || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const createDeal = async (deal: Omit<DealInsert, 'user_id'>) => {
    if (!userId) return;
    const { error } = await supabase.from('deals').insert({ ...deal, user_id: userId });
    if (error) throw error;

    await supabase.from('activities').insert({
      user_id: userId,
      entity_type: 'deal',
      entity_id: crypto.randomUUID(),
      action: 'created',
      description: `Created deal "${deal.title}"`,
    });

    await fetchDeals();
  };

  const updateDeal = async (id: string, updates: DealUpdate) => {
    if (!userId) return;
    const { error } = await supabase
      .from('deals')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId);
    if (error) throw error;

    await supabase.from('activities').insert({
      user_id: userId,
      entity_type: 'deal',
      entity_id: id,
      action: updates.stage ? 'stage_changed' : 'updated',
      description: updates.stage
        ? `Deal stage changed to ${updates.stage}`
        : `Updated deal "${updates.title || ''}"`,
    });

    await fetchDeals();
  };

  const deleteDeal = async (id: string, title: string) => {
    if (!userId) return;
    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    if (error) throw error;

    await supabase.from('activities').insert({
      user_id: userId,
      entity_type: 'deal',
      entity_id: id,
      action: 'deleted',
      description: `Deleted deal "${title}"`,
    });

    await fetchDeals();
  };

  return { deals, loading, fetchDeals, createDeal, updateDeal, deleteDeal };
}
