import { Order } from "./order";
import { Vehicle } from "./vehicle";

export interface Delivery {
  uuid: string;
  order: Order;
  vehicle: Vehicle;
  distance: number; // distance in km
  cost_ratio: number; // cost ratio for the delivery
  delivery_burn_rate: number; // burn rate for the delivery
  from_long: string; // starting longitude
  from_lat: string; // starting latitude
  to_long: string; // destination longitude
  to_lat: string; // destination latitude
  total_order_volume: number; // total order volume in cubic meters
  total_order_weight: number; // total order weight in kg
  total_order_density: number; // total order density in kg/m^3
  vehicle_max_density: number; // vehicle maximum density in kg/m^3
  vehicle_coverage: number; // vehicle coverage in km
  created_at: string;

  // status: string; // delivery status
  // expected_delivery_date: Date; // expected delivery date
  // actual_delivery_date: Date; // actual delivery date
  // delivery_address: string; // delivery address
  // recipient_name: string; // name of the recipient
  // recipient_phone: string; // phone number of the recipient
}
