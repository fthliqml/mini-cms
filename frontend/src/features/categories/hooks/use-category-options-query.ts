"use client";

import { useQuery } from "@tanstack/react-query";

import { categoryQueryKeys } from "../api/category-query-keys";
import { getCategories } from "../api/get-categories";

export function useCategoryOptionsQuery(enabled = true) {
  return useQuery({
    queryKey: categoryQueryKeys.options(),
    queryFn: () => getCategories({ perPage: 100 }),
    enabled,
    staleTime: 5 * 60_000,
  });
}
