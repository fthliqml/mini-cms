"use client";

import { useQuery } from "@tanstack/react-query";

import type { AuthQueryScope } from "@/features/auth/types/auth";
import { isSameAuthQueryScope } from "@/lib/query";
import { getManagedPosts } from "../api/get-managed-posts";
import { postQueryKeys } from "../api/post-query-keys";
import type { ManagedPostListParams } from "../types/post";

export function useManagedPostsQuery(
  viewer: AuthQueryScope | null,
  params: ManagedPostListParams,
  enabled = true,
) {
  return useQuery({
    queryKey: postQueryKeys.managementList(viewer, params),
    queryFn: () => getManagedPosts(params),
    enabled: enabled && viewer !== null,
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
