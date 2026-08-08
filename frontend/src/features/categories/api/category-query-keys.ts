import type { AuthQueryScope } from "@/features/auth/types/auth";
import type { ManagedCategoryListParams } from "../types/category";

export const categoryQueryKeys = {
  all: ["categories"] as const,
  options: () => [...categoryQueryKeys.all, "options"] as const,
  management: () => [...categoryQueryKeys.all, "management"] as const,
  managementList: (
    viewer: AuthQueryScope | null,
    params: ManagedCategoryListParams,
  ) => [...categoryQueryKeys.management(), viewer, params] as const,
};
