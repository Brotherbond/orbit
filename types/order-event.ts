export interface OrderEvent {
  uuid: string;
  order_ref: string;
  ime_vss: string;
  distributor: string;
  total_amount: string;
  created_at: string;
  delivered_at?: string;
  confirmed_at?: string;
  fulfilled_at?: string;
  created_confirmed_lead_time: string;
  confirmed_delivered_lead_time: string;
  delivered_fulfilled_lead_time: string;
  overall_lead_time: string;
}
