"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getUsers } from "../api/get-users";
import { userQueryKeys } from "../api/user-query-keys";
import type { UserListParams } from "../types/user";

export function useUsersQuery(params: UserListParams, enabled = true) {
  return useQuery({
    queryKey: userQueryKeys.list(params),
    queryFn: () => getUsers(params),
    enabled,
    placeholderData: keepPreviousData,
  });
}
