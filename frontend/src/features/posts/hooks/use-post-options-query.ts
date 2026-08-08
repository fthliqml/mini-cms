"use client";

import { useQuery } from "@tanstack/react-query";

import type { AuthQueryScope } from "@/features/auth/types/auth";
import {
  getPostAssignees,
  getPostCategories,
} from "../api/get-post-options";
import { postQueryKeys } from "../api/post-query-keys";

export function usePostCategoriesQuery(enabled = true) {
  return useQuery({
    queryKey: postQueryKeys.categories(),
    queryFn: getPostCategories,
    enabled,
    staleTime: 5 * 60_000,
  });
}

export function usePostAssigneesQuery(
  viewer: AuthQueryScope | null,
  enabled = true,
) {
  return useQuery({
    queryKey: postQueryKeys.assignees(viewer),
    queryFn: () => getPostAssignees(viewer?.role ?? "author"),
    enabled: enabled && viewer?.role === "admin",
    staleTime: 60_000,
  });
}
