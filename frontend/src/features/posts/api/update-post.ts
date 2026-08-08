import { ApiResponse, fetcher } from "@/lib/api";
import type { Post, UpdatePostInput } from "../types/post";
import { createPostFormData } from "./post-form-data";

export async function updatePost(slug: string, input: UpdatePostInput) {
  const formData = createPostFormData(input);
  formData.set("_method", "PATCH");

  const response = await fetcher<ApiResponse<Post>>(`/posts/${slug}`, {
    method: "POST",
    body: formData,
  });

  return response.data;
}
