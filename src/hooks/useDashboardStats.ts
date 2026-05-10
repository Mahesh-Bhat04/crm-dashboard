import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@clerk/react';
import { supabase } from '../lib/supabase';

export interface DashboardStats {
  totalContacts: number;
  totalDeals: number;
  totalRevenue: number;
  conversionRate: number;
  dealsByStage: { stage: string; count: number }[];
  revenueByMonth: { month: string; revenue: number }[];
  contactsByMonth: { month: string; count: number }[];
}

const defaultStats: DashboardStats = {
  totalContacts: 0,
  totalDeals: 0,
  totalRevenue: 0,
  conversionRate: 0,
  dealsByStage: [],
  revenueByMonth: [],
  contactsByMonth: [],
};

export function useDashboardStats() {
  const { userId } = useAuth();
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    const [contactsRes, dealsRes] = await Promise.all([
      supabase.from('contacts').select('*').eq('user_id', userId),
      supabase.from('deals').select('*').eq('user_id', userId),
    ]);

    const contacts = contactsRes.data || [];
    const deals = dealsRes.data || [];

    const totalContacts = contacts.length;
    const totalDeals = deals.length;
    const totalRevenue = deals
      .filter((d) => d.stage === 'closed_won')
      .reduce((sum, d) => sum + (d.value || 0), 0);
    const wonDeals = deals.filter((d) => d.stage === 'closed_won').length;
    const closedDeals = deals.filter((d) => d.stage === 'closed_won' || d.stage === 'closed_lost').length;
    const conversionRate = closedDeals > 0 ? Math.round((wonDeals / closedDeals) * 100) : 0;

    // Deals by stage
    const stageMap: Record<string, number> = {};
    deals.forEach((d) => {
      stageMap[d.stage] = (stageMap[d.stage] || 0) + 1;
    });
    const dealsByStage = Object.entries(stageMap).map(([stage, count]) => ({ stage, count }));

    // Revenue by month (last 6 months)
    const revenueByMonth: { month: string; revenue: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toLocaleString('en-US', { month: 'short' });
      const monthNum = date.getMonth();
      const yearNum = date.getFullYear();
      const monthRevenue = deals
        .filter((d) => {
          if (d.stage !== 'closed_won') return false;
          const created = new Date(d.created_at);
          return created.getMonth() === monthNum && created.getFullYear() === yearNum;
        })
        .reduce((sum, d) => sum + (d.value || 0), 0);
      revenueByMonth.push({ month: monthKey, revenue: monthRevenue });
    }

    // Contacts by month (last 6 months)
    const contactsByMonth: { month: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toLocaleString('en-US', { month: 'short' });
      const monthNum = date.getMonth();
      const yearNum = date.getFullYear();
      const count = contacts.filter((c) => {
        const created = new Date(c.created_at);
        return created.getMonth() === monthNum && created.getFullYear() === yearNum;
      }).length;
      contactsByMonth.push({ month: monthKey, count });
    }

    setStats({ totalContacts, totalDeals, totalRevenue, conversionRate, dealsByStage, revenueByMonth, contactsByMonth });
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, fetchStats };
}
