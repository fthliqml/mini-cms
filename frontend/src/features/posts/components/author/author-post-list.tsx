import { FileText, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Post } from "../../types/post";
import { AuthorPostCard } from "./author-post-card";

interface AuthorPostListProps {
  posts: Post[];
  isLoading: boolean;
  hasActiveFilters: boolean;
  onCreate: () => void;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
}

export function AuthorPostList({
  posts,
  isLoading,
  hasActiveFilters,
  onCreate,
  onEdit,
  onDelete,
}: AuthorPostListProps) {
  if (isLoading) {
    return (
      <div className="space-y-5" aria-label="Loading posts">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded-2xl bg-white/70 ring-1 ring-slate-900/5"
          />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/45 px-6 py-16 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-white text-blue-600 ring-1 ring-slate-900/8">
          <FileText className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-5 font-heading text-2xl font-semibold tracking-tight text-slate-950">
          {hasActiveFilters ? "No matching posts" : "Your desk is empty"}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
          {hasActiveFilters
            ? "Try another search or status filter."
            : "Create your first post and save it as a draft or publish it when it is ready."}
        </p>
        {hasActiveFilters ? null : (
          <Button type="button" onClick={onCreate} className="mt-6">
            <Plus className="size-4" aria-hidden="true" />
            New post
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {posts.map((post) => (
        <AuthorPostCard
          key={post.id}
          post={post}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
