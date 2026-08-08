import { ApiResponse, fetcher } from "@/lib/api";
import { Post } from "@/lib/constants";

export async function getPosts() {
  const response = await fetcher<ApiResponse<Post[]>>("/posts");
  const posts = response.data;

  return { posts };
}

export async function getPost(slug: string) {
  const response = await fetcher<ApiResponse<Post>>(`/posts/${slug}`);
  const post = response.data;

  return post;
}
