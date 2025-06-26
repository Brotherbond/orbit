import { Market } from "./market";
import { Role } from "./role";

export interface User {
  id: string;
  uuid: string;
  first_name: string;
  full_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: Role;
  market: Market;
  status: string;
  created_at: string;
}
