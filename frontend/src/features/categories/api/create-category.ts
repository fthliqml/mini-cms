import { ApiResponse, fetcher } from "@/lib/api";
import type { Category, CreateCategoryInput } from "../types/category";

export async function createCategory(input: CreateCategoryInput) {
  const response = await fetcher<ApiResponse<Category>>("/categories", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return response.data;
}
