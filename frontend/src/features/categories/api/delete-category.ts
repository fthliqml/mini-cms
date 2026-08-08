import { ApiResponse, fetcher } from "@/lib/api";

export async function deleteCategory(id: number) {
  await fetcher<ApiResponse<null>>(`/categories/${id}`, {
    method: "DELETE",
  });
}
