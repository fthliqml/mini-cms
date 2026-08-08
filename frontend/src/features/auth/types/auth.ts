export type UserRole = "admin" | "author";

export interface AuthQueryScope {
  userId: number;
  role: UserRole;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}
