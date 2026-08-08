import { ApiResponse, fetcher } from "@/lib/api";
import type { CreatePostInput, Post } from "../types/post";
import { createPostFormData } from "./post-form-data";

export async function createPost(input: CreatePostInput) {
  const response = await fetcher<ApiResponse<Post>>("/posts", {
    method: "POST",
    body: createPostFormData(input),
  });

  return response.data;
}
