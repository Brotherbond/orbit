import { Market } from "./market";

export interface Location {
  id: string;
  uuid: string;
  full_location: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  markets: Market[];
  status: string;
  created_at: string;
}
