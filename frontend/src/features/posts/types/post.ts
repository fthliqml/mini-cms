import type { PaginationMeta } from "@/types/pagination";

export type PostStatus = "draft" | "published";

export interface PostAuthor {
  id: number;
  name: string;
  email: string;
  role: "admin" | "author";
  created_at: string;
  updated_at: string;
}

export interface PostCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  posts_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: number;
  category: PostCategory | null;
  author: PostAuthor | null;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  image_url?: string | null;
  status: PostStatus;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ManagedPostListData {
  items: Post[];
  pagination: PaginationMeta;
}

export interface ManagedPostListParams {
  page: number;
  search?: string;
  status?: PostStatus;
  categoryId?: number;
}

export interface CreatePostInput {
  user_id?: number;
  category_id: number;
  title: string;
  excerpt?: string | null;
  content: string;
  image?: File;
  remove_image?: boolean;
  status: PostStatus;
}

export type UpdatePostInput = CreatePostInput;
