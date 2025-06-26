import { Market } from "./market";

export interface Location {
  id: string;
  uuid: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  market: Market;
  status: string;
  created_at: string;
}
