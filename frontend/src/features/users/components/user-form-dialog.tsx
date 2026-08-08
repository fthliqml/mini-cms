"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserRole } from "@/features/auth/types/auth";
import { ApiError, getApiErrorMessage } from "@/lib/api";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../hooks/use-user-mutations";
import {
  createUserSchema,
  updateUserSchema,
  type UserFormValues,
} from "../schemas/user-schema";
import type { ManagedUser, UpdateUserInput } from "../types/user";

type UserFormMode = "create" | "edit";

interface UserFormDialogProps {
  mode: UserFormMode;
  user?: ManagedUser;
  currentUserId: number;
  onClose: () => void;
  onSaved: (user: ManagedUser) => void;
}

const fieldNames = ["name", "email", "password", "role"] as const;

export function UserFormDialog({
  mode,
  user,
  currentUserId,
  onClose,
  onSaved,
}: UserFormDialogProps) {
  const isEditingSelf = mode === "edit" && user?.id === currentUserId;
  const createMutation = useCreateUserMutation();
  const updateMutation = useUpdateUserMutation();
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(
      mode === "create" ? createUserSchema : updateUserSchema,
    ),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
      role: user?.role ?? "author",
    },
  });

  const onSubmit = async (values: UserFormValues) => {
    try {
      const savedUser =
        mode === "create"
          ? await createMutation.mutateAsync(values)
          : await updateMutation.mutateAsync({
              id: user!.id,
              input: {
                name: values.name,
                email: values.email,
                role: values.role,
                ...(values.password ? { password: values.password } : {}),
              } satisfies UpdateUserInput,
            });

      onSaved(savedUser);
    } catch (error: unknown) {
      if (error instanceof ApiError && error.errors) {
        for (const fieldName of fieldNames) {
          const message = error.errors[fieldName]?.[0];
          if (message) {
            setError(fieldName, { type: "server", message });
          }
        }
      }

      setError("root", {
        type: "server",
        message: getApiErrorMessage(error, "The user could not be saved."),
      });
    }
  };

  return (
    <Dialog open onOpenChange={(open) => (open ? undefined : onClose())}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add team member" : "Edit team member"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create an account and choose its access level."
              : "Update account details or replace the current password."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errors.root ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {errors.root.message}
            </div>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor="user-name">Name</Label>
            <Input
              id="user-name"
              autoComplete="name"
              {...register("name")}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name ? (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="user-email">Email</Label>
            <Input
              id="user-email"
              type="email"
              autoComplete="email"
              {...register("email")}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email ? (
              <p className="text-xs text-destructive">
                {errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="user-password">
              Password
              {mode === "edit" ? (
                <span className="ml-1 font-normal text-muted-foreground">
                  (optional)
                </span>
              ) : null}
            </Label>
            <Input
              id="user-password"
              type="password"
              autoComplete="new-password"
              placeholder={
                mode === "edit" ? "Leave blank to keep current password" : ""
              }
              {...register("password")}
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password ? (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="user-role">Role</Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value as UserRole)}
                  disabled={isEditingSelf}
                >
                  <SelectTrigger
                    id="user-role"
                    className="w-full"
                    aria-invalid={Boolean(errors.role)}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="start">
                    <SelectItem value="author">Author</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {isEditingSelf ? (
              <p className="text-[11px] text-muted-foreground">
                Your own admin access cannot be removed.
              </p>
            ) : null}
            {errors.role ? (
              <p className="text-xs text-destructive">{errors.role.message}</p>
            ) : null}
          </div>

          <DialogFooter className="mt-5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              {mode === "create" ? "Add user" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
