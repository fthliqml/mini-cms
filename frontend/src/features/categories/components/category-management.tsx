"use client";

import {
  ChevronLeft,
  ChevronRight,
  Layers3,
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
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { ApiError } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { useManagedCategoriesQuery } from "../hooks/use-managed-categories-query";
import type { Category } from "../types/category";
import { CategoryFormDialog } from "./category-form-dialog";
import { DeleteCategoryDialog } from "./delete-category-dialog";

type FormState =
  | { mode: "create" }
  | { mode: "edit"; category: Category }
  | null;

export function CategoryManagement() {
  const currentUser = useAuthStore((state) => state.user);
  const { endSession } = useAuthSession();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<FormState>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );
  const deferredSearch = useDeferredValue(search.trim());
  const canManageCategories = currentUser?.role === "admin";
  const categoriesQuery = useManagedCategoriesQuery(
    currentUser
      ? { userId: currentUser.id, role: currentUser.role }
      : null,
    {
      page,
      ...(deferredSearch ? { search: deferredSearch } : {}),
    },
    canManageCategories,
  );

  useEffect(() => {
    if (
      categoriesQuery.error instanceof ApiError &&
      categoriesQuery.error.status === 401
    ) {
      endSession();
    }
  }, [categoriesQuery.error, endSession]);

  const categories = categoriesQuery.data?.items ?? [];
  const pagination = categoriesQuery.data?.pagination;

  const handleDeleted = () => {
    const shouldMoveToPreviousPage = categories.length === 1 && page > 1;
    setDeletingCategory(null);

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
                Content taxonomy
              </p>
            </div>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">
              Categories
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Maintain the shared taxonomy available to every author and post.
            </p>
          </div>
          <Button
            onClick={() => setForm({ mode: "create" })}
            className="self-start sm:self-auto"
          >
            <Plus className="size-4" />
            New category
          </Button>
        </div>

        <Card className="mt-8 border-0 bg-white py-0 shadow-none ring-1 ring-slate-200/80">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search name or description..."
                className="bg-slate-50 pl-9 sm:max-w-sm"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => void categoriesQuery.refetch()}
              disabled={categoriesQuery.isFetching}
              aria-label="Refresh categories"
            >
              <RefreshCw
                className={
                  categoriesQuery.isFetching
                    ? "size-4 animate-spin"
                    : "size-4"
                }
              />
            </Button>
          </div>

          {categoriesQuery.error ? (
            <div className="m-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <p className="font-medium">Categories could not be loaded.</p>
              <p className="mt-1 text-xs opacity-80">
                {categoriesQuery.error instanceof Error
                  ? categoriesQuery.error.message
                  : "Try again."}
              </p>
            </div>
          ) : null}

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] uppercase tracking-[0.12em] text-slate-400">
                    <th className="px-5 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Posts</th>
                    <th className="px-4 py-3 font-medium">Updated</th>
                    <th className="px-5 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categoriesQuery.isLoading ? (
                    Array.from({ length: 4 }, (_, index) => (
                      <tr key={index}>
                        <td className="px-5 py-4" colSpan={4}>
                          <div className="h-11 animate-pulse rounded-lg bg-slate-100" />
                        </td>
                      </tr>
                    ))
                  ) : categories.length > 0 ? (
                    categories.map((category) => (
                      <tr
                        key={category.id}
                        className="transition-colors hover:bg-slate-50/70"
                      >
                        <td className="max-w-md px-5 py-4">
                          <p className="truncate text-sm font-medium text-slate-900">
                            {category.name}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-400">
                            {category.description || `/${category.slug}`}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant="secondary">
                            {category.posts_count ?? 0}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-500">
                          {formatDate(category.updated_at)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() =>
                                setForm({ mode: "edit", category })
                              }
                              aria-label={`Edit ${category.name}`}
                            >
                              <Pencil className="size-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => setDeletingCategory(category)}
                              aria-label={`Delete ${category.name}`}
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
                      <td
                        colSpan={4}
                        className="px-5 py-16 text-center"
                      >
                        <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                          <Layers3 className="size-5" />
                        </span>
                        <p className="mt-3 text-sm font-medium text-slate-800">
                          No categories found
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Adjust the search or create a new category.
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
                  {pagination.total} categor
                  {pagination.total === 1 ? "y" : "ies"}
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
                      pagination.current_page <= 1 ||
                      categoriesQuery.isFetching
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
                      categoriesQuery.isFetching
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
        <CategoryFormDialog
          key={form.mode === "edit" ? form.category.id : "create"}
          mode={form.mode}
          category={form.mode === "edit" ? form.category : undefined}
          onClose={() => setForm(null)}
          onSaved={() => setForm(null)}
        />
      ) : null}

      {deletingCategory ? (
        <DeleteCategoryDialog
          key={deletingCategory.id}
          category={deletingCategory}
          onClose={() => setDeletingCategory(null)}
          onDeleted={handleDeleted}
        />
      ) : null}
    </main>
  );
}
