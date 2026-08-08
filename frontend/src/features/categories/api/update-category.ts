import { ApiResponse, fetcher } from "@/lib/api";
import type { Category, UpdateCategoryInput } from "../types/category";

export async function updateCategory(
  id: number,
  input: UpdateCategoryInput,
) {
  const response = await fetcher<ApiResponse<Category>>(`/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });

  return response.data;
}
