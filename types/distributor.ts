import { User } from "./user";

export interface Distributor {
  id: string;
  uuid: string;
  user: User;
  business_name: string;
  address: string;
  performance?: {
    total_orders: number;
    total_value: number;
    growth_rate: number;
  };
  created_at: string;
}