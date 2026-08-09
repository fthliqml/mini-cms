"use client";

import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { useDeferredValue, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
import { useCategoryOptionsQuery } from "@/features/categories/hooks/use-category-options-query";
import { ApiError } from "@/lib/api";
import { formatDate, getInitials } from "@/lib/utils";
import { useManagedPostsQuery } from "../hooks/use-managed-posts-query";
import type { Post, PostStatus } from "../types/post";
import { DeletePostDialog } from "./delete-post-dialog";
import { PostCoverImage } from "./post-cover-image";
import { PostFormSheet } from "./post-form-sheet";

type StatusFilter = "all" | PostStatus;
type CategoryFilter = "all" | `${number}`;
type FormState =
  | { mode: "create" }
  | { mode: "edit"; post: Post }
  | null;

export function AdminPostManagement() {
  const currentUser = useAuthStore((state) => state.user);
  const { endSession } = useAuthSession();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [form, setForm] = useState<FormState>(null);
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);
  const deferredSearch = useDeferredValue(search.trim());
  const canManagePosts = currentUser?.role === "admin";
  const categoriesQuery = useCategoryOptionsQuery(canManagePosts);
  const postsQuery = useManagedPostsQuery(
    canManagePosts && currentUser
      ? { userId: currentUser.id, role: currentUser.role }
      : null,
    {
      page,
      ...(deferredSearch ? { search: deferredSearch } : {}),
      ...(status === "all" ? {} : { status }),
      ...(category === "all" ? {} : { categoryId: Number(category) }),
    },
    canManagePosts,
  );

  useEffect(() => {
    if (
      postsQuery.error instanceof ApiError &&
      postsQuery.error.status === 401
    ) {
      endSession();
    }
  }, [endSession, postsQuery.error]);

  const posts = postsQuery.data?.items ?? [];
  const pagination = postsQuery.data?.pagination;
  const handleDeleted = () => {
    const shouldMoveToPreviousPage = posts.length === 1 && page > 1;
    setDeletingPost(null);

    if (shouldMoveToPreviousPage) {
      setPage((currentPage) => currentPage - 1);
    }
  };

  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  return (
    <main className="w-full flex-1 px-4 py-6 md:px-8 md:py-8 xl:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-px w-7 bg-blue-600" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-700">
                Editorial pipeline
              </p>
            </div>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">
              Posts
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage every article, owner, category, and publishing state.
            </p>
          </div>
          <Button
            onClick={() => setForm({ mode: "create" })}
            className="self-start sm:self-auto"
          >
            <Plus className="size-4" />
            New post
          </Button>
        </div>

        <Card className="mt-8 border-0 bg-white py-0 shadow-none ring-1 ring-slate-200/80">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search title or excerpt..."
                className="bg-slate-50 pl-9 lg:max-w-sm"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={status}
                onValueChange={(value) => {
                  setStatus(value as StatusFilter);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-32 bg-white">
                  <SelectValue>
                    {status === "all"
                      ? "All statuses"
                      : status === "published"
                        ? "Published"
                        : "Draft"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={category}
                onValueChange={(value) => {
                  setCategory(value as CategoryFilter);
                  setPage(1);
                }}
                disabled={categoriesQuery.isLoading}
              >
                <SelectTrigger className="w-40 bg-white">
                  <SelectValue>
                    {category === "all"
                      ? "All categories"
                      : ((categoriesQuery.data ?? []).find(
                          (item) => item.id === Number(category),
                        )?.name ?? "All categories")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="all">All categories</SelectItem>
                  {(categoriesQuery.data ?? []).map((item) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => void postsQuery.refetch()}
                disabled={postsQuery.isFetching}
                aria-label="Refresh posts"
              >
                <RefreshCw
                  className={
                    postsQuery.isFetching
                      ? "size-4 animate-spin"
                      : "size-4"
                  }
                />
              </Button>
            </div>
          </div>

          {postsQuery.error ? (
            <div className="m-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <p className="font-medium">Posts could not be loaded.</p>
              <p className="mt-1 text-xs opacity-80">
                {postsQuery.error instanceof Error
                  ? postsQuery.error.message
                  : "Try again."}
              </p>
            </div>
          ) : null}

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] uppercase tracking-[0.12em] text-slate-400">
                    <th className="px-5 py-3 font-medium">Article</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Author</th>
                    <th className="px-4 py-3 font-medium">Updated</th>
                    <th className="px-5 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {postsQuery.isLoading ? (
                    Array.from({ length: 4 }, (_, index) => (
                      <tr key={index}>
                        <td className="px-5 py-4" colSpan={6}>
                          <div className="h-11 animate-pulse rounded-lg bg-slate-100" />
                        </td>
                      </tr>
                    ))
                  ) : posts.length > 0 ? (
                    posts.map((post) => (
                      <tr
                        key={post.id}
                        className="transition-colors hover:bg-slate-50/70"
                      >
                        <td className="max-w-sm px-5 py-4">
                          <div className="flex items-center gap-3">
                            <PostCoverImage
                              src={post.image_url}
                              alt=""
                              className="aspect-[4/3] w-14 shrink-0 rounded-lg ring-1 ring-slate-900/8"
                            />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-slate-900">
                                {post.title}
                              </p>
                              <p className="mt-1 truncate text-xs text-slate-400">
                                {post.excerpt || `/${post.slug}`}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Badge
                            variant={
                              post.status === "published"
                                ? "default"
                                : "secondary"
                            }
                            className="capitalize"
                          >
                            {post.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-600">
                          {post.category?.name ?? "Uncategorized"}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className="flex size-7 items-center justify-center rounded-full bg-slate-100 text-[9px] font-semibold text-slate-600">
                              {getInitials(post.author?.name ?? "Unknown")}
                            </span>
                            <span className="max-w-32 truncate text-xs text-slate-600">
                              {post.author?.name ?? "Unknown"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-500">
                          {formatDate(post.updated_at)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() =>
                                setForm({ mode: "edit", post })
                              }
                              aria-label={`Edit ${post.title}`}
                            >
                              <Pencil className="size-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => setDeletingPost(post)}
                              aria-label={`Delete ${post.title}`}
                              className="text-slate-400 hover:text-destructive"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-5 py-16 text-center">
                        <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                          <FileText className="size-5" />
                        </span>
                        <p className="mt-3 text-sm font-medium text-slate-800">
                          No posts found
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Adjust the filters or create the first article.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {pagination ? (
              <div className="flex items-center justify-between gap-4 border-t border-slate-100 px-4 py-3">
                <p className="text-xs text-slate-400">
                  {pagination.total} post{pagination.total === 1 ? "" : "s"}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">
                    Page {pagination.current_page} of {pagination.last_page}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={() => setPage((current) => current - 1)}
                    disabled={
                      pagination.current_page <= 1 || postsQuery.isFetching
                    }
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={() => setPage((current) => current + 1)}
                    disabled={
                      pagination.current_page >= pagination.last_page ||
                      postsQuery.isFetching
                    }
                    aria-label="Next page"
                  >
                    <ChevronRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </section>

      {form ? (
        <PostFormSheet
          key={form.mode === "edit" ? form.post.id : "create"}
          mode={form.mode}
          post={form.mode === "edit" ? form.post : undefined}
          role="admin"
          currentUserId={currentUser.id}
          onClose={() => setForm(null)}
          onSaved={() => setForm(null)}
        />
      ) : null}

      {deletingPost ? (
        <DeletePostDialog
          key={deletingPost.id}
          post={deletingPost}
          onClose={() => setDeletingPost(null)}
          onDeleted={handleDeleted}
        />
      ) : null}
    </main>
  );
}
