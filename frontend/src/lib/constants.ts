export type Status = "draft" | "published" | "archived";

export type Author = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "author";
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type Post = {
  id: number;
  category: Category;
  author: Author;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  status: Status;
  published_at?: string;
  created_at: string;
  updated_at: string;
  publishedAt?: string;
};
