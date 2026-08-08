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
  status: PostStatus;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}
