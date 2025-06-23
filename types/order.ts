import { StatusBadgeProps } from "@/components/ui/status-badge";

export interface OrderBrand {
  uuid: string;
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
  ime_vss: {
    uuid: string;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    phone: string;
  };
  distributor_user: {
    uuid: string;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    phone: string;
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
