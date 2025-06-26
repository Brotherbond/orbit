import { Location } from "./location";

export interface Market {
  id: string;
  uuid: string;
  name: string;
  description: string;
  region: string;
  status: string;
  users_count: number;
  location: Location;
  location_count: number;
  created_at: string;
}
