import { ApiResponse, fetcher } from "@/lib/api";
import type {
  ManagedPostListData,
  ManagedPostListParams,
} from "../types/post";

export async function getManagedPosts(params: ManagedPostListParams) {
  const searchParams = new URLSearchParams({ page: String(params.page) });

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.categoryId) {
    searchParams.set("category_id", String(params.categoryId));
  }

  const response = await fetcher<ApiResponse<ManagedPostListData>>(
    `/management/posts?${searchParams.toString()}`,
  );

  return response.data;
}
