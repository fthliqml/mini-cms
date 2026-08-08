"use client";

import { useQuery } from "@tanstack/react-query";

import type { AuthQueryScope } from "@/features/auth/types/auth";
import { isSameAuthQueryScope } from "@/lib/query";
import { getUsers } from "../api/get-users";
import { userQueryKeys } from "../api/user-query-keys";
import type { UserListParams } from "../types/user";

export function useUsersQuery(
  viewer: AuthQueryScope | null,
  params: UserListParams,
  enabled = true,
) {
  return useQuery({
    queryKey: userQueryKeys.list(viewer, params),
    queryFn: () => getUsers(params),
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
