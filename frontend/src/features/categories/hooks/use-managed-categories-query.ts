"use client";

import { useQuery } from "@tanstack/react-query";

import type { AuthQueryScope } from "@/features/auth/types/auth";
import { isSameAuthQueryScope } from "@/lib/query";
import { categoryQueryKeys } from "../api/category-query-keys";
import { getManagedCategories } from "../api/get-managed-categories";
import type { ManagedCategoryListParams } from "../types/category";

export function useManagedCategoriesQuery(
  viewer: AuthQueryScope | null,
  params: ManagedCategoryListParams,
  enabled = true,
) {
  return useQuery({
    queryKey: categoryQueryKeys.managementList(viewer, params),
    queryFn: () => getManagedCategories(params),
    enabled: enabled && viewer?.role === "admin",
    placeholderData: (previousData, previousQuery) => {
      const previousViewer = previousQuery?.queryKey[2] as
        | AuthQueryScope
        | null;

      return isSameAuthQueryScope(viewer, previousViewer)
        ? previousData
        : undefined;
    },
  });
}
