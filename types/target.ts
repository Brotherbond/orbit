export interface Target {
  uuid?: string;
  user_id: string;
  type: string;
  goal_type: string;
  volume?: number;
  amount: number;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
}
