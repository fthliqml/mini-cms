import type { UserRole } from "@/features/auth/types/auth";
import { getUsers } from "@/features/users/api/get-users";
import { ApiResponse, fetcher } from "@/lib/api";
import type { PostAuthor, PostCategory } from "../types/post";

export async function getPostCategories() {
  const response = await fetcher<ApiResponse<PostCategory[]>>(
    "/categories?per_page=100",
  );

  return response.data;
}

export async function getPostAssignees(role: UserRole) {
  if (role !== "admin") {
    return [];
  }

  const response = await getUsers({ page: 1, perPage: 100 });

  return response.items as PostAuthor[];
}
