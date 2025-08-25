import { Market } from "./market";

export interface Location {
  id: string;
  uuid: string;
  full_location: string;
  street: string;
  city: string;
  state: string;
  region: string;
  country: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  markets: Market[];
  markets_count: number;
  status: string;
  created_at: string;
}
