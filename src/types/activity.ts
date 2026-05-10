export type EntityType = 'contact' | 'deal';
export type ActionType = 'created' | 'updated' | 'deleted' | 'stage_changed';

export interface Activity {
  id: string;
  user_id: string;
  entity_type: EntityType;
  entity_id: string;
  action: ActionType;
  description: string | null;
  created_at: string;
}
