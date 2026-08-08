import type { PostStatus } from "@/features/posts/types/post";

export interface DashboardStat {
  label: string;
  value: number;
}

export interface AuthorPostRow {
  id: number;
  title: string;
  status: PostStatus;
  updatedAt: string;
}
