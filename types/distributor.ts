import { User } from "./user";

export interface Distributor {
  id: string;
  uuid: string;
  user: User;
  business_name: string;
  address: string;
  business_type: string;
  registration_number?: string;
  tax_id?: string;
  bank_name?: string;
  account_number?: string;
  account_name?: string;
  ime_vss_user_id?: string;
  ime_vss?: {
    uuid: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  performance?: {
    total_orders: number;
    total_order_value: number;
    target_volume: number;
    total_value: number;
    growth_rate: number;
    last_order_date: string;
  };
  created_at: string;
  send_notification?: boolean;
}
