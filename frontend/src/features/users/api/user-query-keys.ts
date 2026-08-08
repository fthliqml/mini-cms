import type { AuthQueryScope } from "@/features/auth/types/auth";
import type { UserListParams } from "../types/user";

export const userQueryKeys = {
  all: ["users"] as const,
  lists: () => [...userQueryKeys.all, "list"] as const,
  list: (viewer: AuthQueryScope | null, params: UserListParams) =>
    [...userQueryKeys.lists(), viewer, params] as const,
  options: (viewer: AuthQueryScope | null) =>
    [...userQueryKeys.all, "options", viewer] as const,
};
