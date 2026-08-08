import type { UserListParams } from "../types/user";

export const userQueryKeys = {
  all: ["users"] as const,
  lists: () => [...userQueryKeys.all, "list"] as const,
  list: (params: UserListParams) =>
    [...userQueryKeys.lists(), params] as const,
};
