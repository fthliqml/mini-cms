"use client";

import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
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
import type { UserRole } from "@/features/auth/types/auth";
import { ApiError } from "@/lib/api";
import { formatDate, getInitials } from "@/lib/utils";
import { useUsersQuery } from "../hooks/use-users-query";
import type { ManagedUser } from "../types/user";
import { DeleteUserDialog } from "./delete-user-dialog";
import { UserFormDialog } from "./user-form-dialog";

type RoleFilter = "all" | UserRole;
type FormState =
  | { mode: "create" }
  | { mode: "edit"; user: ManagedUser }
  | null;

export function UserManagement() {
  const currentUser = useAuthStore((state) => state.user);
  const setCurrentUser = useAuthStore((state) => state.setUser);
  const { endSession } = useAuthSession();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<RoleFilter>("all");
  const [form, setForm] = useState<FormState>(null);
  const [deletingUser, setDeletingUser] = useState<ManagedUser | null>(null);
  const deferredSearch = useDeferredValue(search.trim());
  const canManageUsers = currentUser?.role === "admin";

  const { data, error, isLoading, isFetching, refetch } = useUsersQuery(
    currentUser
      ? { userId: currentUser.id, role: currentUser.role }
      : null,
    {
      page,
      ...(deferredSearch ? { search: deferredSearch } : {}),
      ...(role === "all" ? {} : { role }),
    },
    canManageUsers,
  );

  useEffect(() => {
    if (error instanceof ApiError && error.status === 401) {
      endSession();
    }
  }, [endSession, error]);

  const users = data?.items ?? [];
  const pagination = data?.pagination;

  const handleSaved = (savedUser: ManagedUser) => {
    if (savedUser.id === currentUser?.id) {
      setCurrentUser(savedUser);
    }

    setForm(null);
  };

  const handleDeleted = () => {
    const shouldMoveToPreviousPage = users.length === 1 && page > 1;
    setDeletingUser(null);

    if (shouldMoveToPreviousPage) {
      setPage((currentPage) => currentPage - 1);
      return;
    }
  };

  return (
    <main className="w-full flex-1 px-4 py-6 md:px-8 md:py-8 xl:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-px w-7 bg-blue-600" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-700">
                Access management
              </p>
            </div>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">
              Users
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage team members and control who can publish or administer.
            </p>
          </div>
          <Button
            onClick={() => setForm({ mode: "create" })}
            className="self-start sm:self-auto"
          >
            <Plus className="size-4" />
            Add user
          </Button>
        </div>

        <Card className="mt-8 border-0 bg-white py-0 shadow-none ring-1 ring-slate-200/80">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search name or email..."
                className="bg-slate-50 pl-9 md:max-w-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={role}
                onValueChange={(value) => {
                  setRole(value as RoleFilter);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-32 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="all">All roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="author">Author</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => void refetch()}
                disabled={isFetching}
                aria-label="Refresh users"
              >
                <RefreshCw
                  className={isFetching ? "size-4 animate-spin" : "size-4"}
                />
              </Button>
            </div>
          </div>

          {error ? (
            <div className="m-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <p className="font-medium">Users could not be loaded.</p>
              <p className="mt-1 text-xs opacity-80">
                {error instanceof Error ? error.message : "Try again."}
              </p>
            </div>
          ) : null}

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] uppercase tracking-[0.12em] text-slate-400">
                    <th className="px-5 py-3 font-medium">Team member</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Joined</th>
                    <th className="px-5 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    Array.from({ length: 4 }, (_, index) => (
                      <tr key={index}>
                        <td className="px-5 py-4" colSpan={4}>
                          <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
                        </td>
                      </tr>
                    ))
                  ) : users.length > 0 ? (
                    users.map((user) => {
                      const isCurrentUser = user.id === currentUser?.id;

                      return (
                        <tr
                          key={user.id}
                          className="transition-colors hover:bg-slate-50/70"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white">
                                {getInitials(user.name)}
                              </span>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="truncate text-sm font-medium text-slate-900">
                                    {user.name}
                                  </p>
                                  {isCurrentUser ? (
                                    <Badge
                                      variant="outline"
                                      className="h-4 border-blue-100 bg-blue-50 px-1.5 text-[9px] text-blue-700"
                                    >
                                      You
                                    </Badge>
                                  ) : null}
                                </div>
                                <p className="mt-0.5 truncate text-xs text-slate-400">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <Badge
                              variant={
                                user.role === "admin" ? "default" : "secondary"
                              }
                              className="capitalize"
                            >
                              {user.role}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 text-xs text-slate-500">
                            {formatDate(user.created_at)}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => setForm({ mode: "edit", user })}
                                aria-label={`Edit ${user.name}`}
                              >
                                <Pencil className="size-3.5" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => setDeletingUser(user)}
                                disabled={isCurrentUser}
                                aria-label={`Delete ${user.name}`}
                                className="text-slate-400 hover:text-destructive"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-5 py-16 text-center">
                        <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                          <Users className="size-5" />
                        </span>
                        <p className="mt-3 text-sm font-medium text-slate-800">
                          No users found
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Adjust the search or role filter and try again.
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
                  {pagination.total} team member
                  {pagination.total === 1 ? "" : "s"}
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
                    disabled={pagination.current_page <= 1 || isFetching}
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
                      isFetching
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
        <UserFormDialog
          key={form.mode === "edit" ? form.user.id : "create"}
          mode={form.mode}
          user={form.mode === "edit" ? form.user : undefined}
          currentUserId={currentUser?.id ?? -1}
          onClose={() => setForm(null)}
          onSaved={handleSaved}
        />
      ) : null}

      {deletingUser ? (
        <DeleteUserDialog
          key={deletingUser.id}
          user={deletingUser}
          onClose={() => setDeletingUser(null)}
          onDeleted={handleDeleted}
        />
      ) : null}
    </main>
  );
}
