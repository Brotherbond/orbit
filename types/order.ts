import { StatusBadgeProps } from "@/components/ui/status-badge";
import { User } from "./user";

export interface OrderBrand {
  uuid: string;
  order_ref: string;
  customer_name: string;
  customer_type: string;
  category: string;
  brand_name: string;
  pcs_per_carton: string;
  cartons_sold: string;
  location: string;
  date: string;
  price_per_carton: string;
  sales_value: number;
  comments: string;
  quantity: string;
  price: string;
  info: {
    uuid: string;
    name: string;
    category: string;
  };
}

export interface Order {
  uuid: string;
  ref: string;
  delivery_image: string;
  fulfilled_token: string;
  ime_vss: User;
  distributor_user: User & {
    distributor_details: {
      uuid: string;
      business_name: string;
      address: string;
    };
  };
  total_amount: string;
  created_at: string;
  status: StatusBadgeProps["status"];
  brands: OrderBrand[];
  promos: any;
}
