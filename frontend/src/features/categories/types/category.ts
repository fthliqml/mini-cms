import type { PaginationMeta } from "@/types/pagination";

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  posts_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ManagedCategoryListData {
  items: Category[];
  pagination: PaginationMeta;
}

export interface ManagedCategoryListParams {
  page: number;
  search?: string;
}

export interface CategoryListParams {
  perPage?: number;
}

export interface CreateCategoryInput {
  name: string;
  description?: string | null;
}

export type UpdateCategoryInput = CreateCategoryInput;
