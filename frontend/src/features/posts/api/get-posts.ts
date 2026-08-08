import { ApiResponse, fetcher } from "@/lib/api";
import type { Post } from "../types/post";

export async function getPosts() {
  const response = await fetcher<ApiResponse<Post[]>>("/posts");

  return response.data;
}
