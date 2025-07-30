export interface Permission {
  uuid: string;
  name: string;
  guard_name: null;
  category: string;
  description?: string;
  created_at: string;
}
export interface Role {
  uuid: string;
  name: string;
  access_type?: string;
  permissions: Permission[];
  permissions_count: number;
  users_count: number;
  description: string;
  status: string;
  created_at: string;
}
