import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@clerk/react';
import { supabase } from '../lib/supabase';
import type { Activity } from '../types/activity';

export function useActivities(limit = 10) {
  const { userId } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) console.error('Error fetching activities:', error);
    else setActivities(data || []);
    setLoading(false);
  }, [userId, limit]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return { activities, loading, fetchActivities };
}
