import { ApiResponse, fetcher } from "@/lib/api";
import type { CreatePostInput, Post } from "../types/post";

export async function createPost(input: CreatePostInput) {
  const response = await fetcher<ApiResponse<Post>>("/posts", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return response.data;
}
