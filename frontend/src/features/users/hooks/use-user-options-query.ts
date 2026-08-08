"use client";

import { useQuery } from "@tanstack/react-query";

import type { AuthQueryScope } from "@/features/auth/types/auth";
import { getUserOptions } from "../api/get-user-options";
import { userQueryKeys } from "../api/user-query-keys";

export function useUserOptionsQuery(
  viewer: AuthQueryScope | null,
  enabled = true,
) {
  return useQuery({
    queryKey: userQueryKeys.options(viewer),
    queryFn: getUserOptions,
    enabled: enabled && viewer?.role === "admin",
    staleTime: 60_000,
  });
}
