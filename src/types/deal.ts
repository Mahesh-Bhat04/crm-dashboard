export type DealStage = 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';

export interface Deal {
  id: string;
  user_id: string;
  contact_id: string | null;
  title: string;
  value: number;
  stage: DealStage;
  expected_close_date: string | null;
  created_at: string;
  updated_at: string;
}

export type DealInsert = Omit<Deal, 'id' | 'created_at' | 'updated_at'>;
export type DealUpdate = Partial<DealInsert>;
