import { ApiResponse, fetcher } from "@/lib/api";
import type { UserListData, UserListParams } from "../types/user";

export async function getUsers(params: UserListParams) {
  const searchParams = new URLSearchParams({ page: String(params.page) });

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.role) {
    searchParams.set("role", params.role);
  }

  const response = await fetcher<ApiResponse<UserListData>>(
    `/users?${searchParams.toString()}`,
  );

  return response.data;
}
