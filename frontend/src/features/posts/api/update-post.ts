import { ApiResponse, fetcher } from "@/lib/api";
import type { Post, UpdatePostInput } from "../types/post";

export async function updatePost(slug: string, input: UpdatePostInput) {
  const response = await fetcher<ApiResponse<Post>>(`/posts/${slug}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });

  return response.data;
}
