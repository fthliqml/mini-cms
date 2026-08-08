import type { AuthUser, UserRole } from "@/features/auth/types/auth";
import type { PaginationMeta } from "@/types/pagination";

export type ManagedUser = AuthUser;
export type { PaginationMeta } from "@/types/pagination";

export interface UserListData {
  items: ManagedUser[];
  pagination: PaginationMeta;
}

export interface UserListParams {
  page: number;
  search?: string;
  role?: UserRole;
  perPage?: number;
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
