"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { ApiError } from "@/lib/api";
import { useManagedPostsQuery } from "../../hooks/use-managed-posts-query";
import type { Post } from "../../types/post";
import { DeletePostDialog } from "../delete-post-dialog";
import { PostFormSheet } from "../post-form-sheet";
import { AuthorPostHero } from "./author-post-hero";
import { AuthorPostList } from "./author-post-list";
import {
  AuthorPostToolbar,
  type AuthorPostStatusFilter,
} from "./author-post-toolbar";

type FormState =
  | { mode: "create" }
  | { mode: "edit"; post: Post }
  | null;

interface AuthorPostWorkspaceProps {
  startCreating?: boolean;
}

function AuthorWorkspaceLoading() {
  return (
    <main className="mx-auto w-full max-w-[1180px] flex-1 px-5 py-14 md:px-8 md:py-20">
      <div className="h-6 w-28 animate-pulse rounded bg-slate-200" />
      <div className="mt-10 h-36 max-w-2xl animate-pulse rounded-2xl bg-white/70" />
      <div className="mt-16 h-72 animate-pulse rounded-2xl bg-white/70" />
    </main>
  );
}

export function AuthorPostWorkspace({
  startCreating = false,
}: AuthorPostWorkspaceProps) {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.user);
  const authStatus = useAuthStore((state) => state.status);
  const { endSession } = useAuthSession();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AuthorPostStatusFilter>("all");
  const [form, setForm] = useState<FormState>(
    startCreating ? { mode: "create" } : null,
  );
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);
  const deferredSearch = useDeferredValue(search.trim());
  const isAuthor =
    authStatus === "authenticated" && currentUser?.role === "author";
  const postsQuery = useManagedPostsQuery(
    isAuthor
      ? { userId: currentUser.id, role: currentUser.role }
      : null,
    {
      page,
      ...(deferredSearch ? { search: deferredSearch } : {}),
      ...(status === "all" ? {} : { status }),
    },
    isAuthor,
  );
  const posts = postsQuery.data?.items ?? [];
  const pagination = postsQuery.data?.pagination;
  const hasActiveFilters = Boolean(deferredSearch) || status !== "all";

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (authStatus === "authenticated" && currentUser?.role === "admin") {
      router.replace("/dashboard/admin/posts");
    }
  }, [authStatus, currentUser?.role, router]);

  useEffect(() => {
    if (
      postsQuery.error instanceof ApiError &&
      postsQuery.error.status === 401
    ) {
      endSession();
    }
  }, [endSession, postsQuery.error]);

  const closeForm = () => {
    setForm(null);

    if (startCreating) {
      router.replace("/author/posts", { scroll: false });
    }
  };

  const handleDeleted = () => {
    const shouldMoveToPreviousPage = posts.length === 1 && page > 1;
    setDeletingPost(null);

    if (shouldMoveToPreviousPage) {
      setPage((currentPage) => currentPage - 1);
    }
  };

  if (!isAuthor || !currentUser) {
    return <AuthorWorkspaceLoading />;
  }

  return (
    <main className="w-full flex-1 overflow-hidden">
      <div className="mx-auto w-full max-w-[1180px] px-5 pb-16 md:px-8 md:pb-24">
        <AuthorPostHero
          authorName={currentUser.name}
          totalPosts={pagination?.total}
          onCreate={() => setForm({ mode: "create" })}
        />

        <section className="pt-10 md:pt-14" aria-labelledby="author-posts-title">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
                Your work
              </p>
              <h2
                id="author-posts-title"
                className="mt-2 font-heading text-3xl font-semibold tracking-[-0.045em] text-slate-950"
              >
                Posts
              </h2>
            </div>
          </div>

          <AuthorPostToolbar
            search={search}
            status={status}
            isRefreshing={postsQuery.isFetching}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            onStatusChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
            onRefresh={() => void postsQuery.refetch()}
          />

          {postsQuery.error ? (
            <div className="mt-6 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <p className="font-medium">Posts could not be loaded.</p>
              <p className="mt-1 text-xs opacity-80">
                {postsQuery.error instanceof Error
                  ? postsQuery.error.message
                  : "Refresh the page and try again."}
              </p>
            </div>
          ) : null}

          <div className="mt-6">
            <AuthorPostList
              posts={posts}
              isLoading={postsQuery.isLoading}
              hasActiveFilters={hasActiveFilters}
              onCreate={() => setForm({ mode: "create" })}
              onEdit={(post) => setForm({ mode: "edit", post })}
              onDelete={setDeletingPost}
            />
          </div>

          {pagination && pagination.last_page > 1 ? (
            <div className="mt-8 flex items-center justify-between border-t border-slate-900/8 pt-5">
              <p className="text-xs text-slate-500">
                Page {pagination.current_page} of {pagination.last_page}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((currentPage) => currentPage - 1)}
                  disabled={
                    pagination.current_page <= 1 || postsQuery.isFetching
                  }
                >
                  <ChevronLeft className="size-3.5" aria-hidden="true" />
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((currentPage) => currentPage + 1)}
                  disabled={
                    pagination.current_page >= pagination.last_page ||
                    postsQuery.isFetching
                  }
                >
                  Next
                  <ChevronRight className="size-3.5" aria-hidden="true" />
                </Button>
              </div>
            </div>
          ) : null}
        </section>
      </div>

      {form ? (
        <PostFormSheet
          key={form.mode === "edit" ? form.post.id : "create"}
          mode={form.mode}
          post={form.mode === "edit" ? form.post : undefined}
          role="author"
          currentUserId={currentUser.id}
          onClose={closeForm}
          onSaved={closeForm}
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
