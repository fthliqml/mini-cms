import { ApiResponse, fetcher } from "@/lib/api";
import type { Category, CategoryListParams } from "../types/category";

export async function getCategories(params: CategoryListParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.perPage) {
    searchParams.set("per_page", String(params.perPage));
  }

  const query = searchParams.toString();
  const response = await fetcher<ApiResponse<Category[]>>(
    `/categories${query ? `?${query}` : ""}`,
  );

  return response.data;
}
