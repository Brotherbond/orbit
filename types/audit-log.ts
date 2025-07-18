import { User } from "./user";

export interface AuditLog {
  name: string;
  role: string;
  ip: string;
  user: User;
  action: string;
  created_at: string;
}
