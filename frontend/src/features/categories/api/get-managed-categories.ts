import { ApiResponse, fetcher } from "@/lib/api";
import type {
  ManagedCategoryListData,
  ManagedCategoryListParams,
} from "../types/category";

export async function getManagedCategories(
  params: ManagedCategoryListParams,
) {
  const searchParams = new URLSearchParams({ page: String(params.page) });

  if (params.search) {
    searchParams.set("search", params.search);
  }

  const response = await fetcher<ApiResponse<ManagedCategoryListData>>(
    `/management/categories?${searchParams.toString()}`,
  );

  return response.data;
}
