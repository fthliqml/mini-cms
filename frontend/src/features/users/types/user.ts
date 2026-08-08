import type { AuthUser, UserRole } from "@/features/auth/types/auth";

export type ManagedUser = AuthUser;

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface UserListData {
  items: ManagedUser[];
  pagination: PaginationMeta;
}

export interface UserListParams {
  page: number;
  search?: string;
  role?: UserRole;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserInput {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
}
