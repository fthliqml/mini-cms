import { ApiResponse, fetcher } from "@/lib/api";

export async function deletePost(slug: string) {
  await fetcher<ApiResponse<null>>(`/posts/${slug}`, {
    method: "DELETE",
  });
}
