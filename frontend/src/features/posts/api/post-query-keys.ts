import type { AuthQueryScope } from "@/features/auth/types/auth";
import type { ManagedPostListParams } from "../types/post";

export const postQueryKeys = {
  all: ["posts"] as const,
  management: () => [...postQueryKeys.all, "management"] as const,
  managementList: (
    viewer: AuthQueryScope | null,
    params: ManagedPostListParams,
  ) => [...postQueryKeys.management(), viewer, params] as const,
};
