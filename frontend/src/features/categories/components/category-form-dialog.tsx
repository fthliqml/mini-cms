"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

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
import { Textarea } from "@/components/ui/textarea";
import { ApiError, getApiErrorMessage } from "@/lib/api";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "../hooks/use-category-mutations";
import {
  categorySchema,
  type CategoryFormValues,
} from "../schemas/category-schema";
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../types/category";

type CategoryFormMode = "create" | "edit";

interface CategoryFormDialogProps {
  mode: CategoryFormMode;
  category?: Category;
  onClose: () => void;
  onSaved: () => void;
}

const fieldNames = ["name", "description"] as const;

export function CategoryFormDialog({
  mode,
  category,
  onClose,
  onSaved,
}: CategoryFormDialogProps) {
  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
    },
  });
  const isPending =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (values: CategoryFormValues) => {
    const input = {
      name: values.name,
      description: values.description || null,
    } satisfies CreateCategoryInput | UpdateCategoryInput;

    try {
      if (mode === "create") {
        await createMutation.mutateAsync(input);
      } else {
        await updateMutation.mutateAsync({
          id: category!.id,
          input,
        });
      }

      onSaved();
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
        message: getApiErrorMessage(
          error,
          "The category could not be saved.",
        ),
      });
    }
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isPending) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create category" : "Edit category"}
          </DialogTitle>
          <DialogDescription>
            Define a shared category available to every author and post.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errors.root ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {errors.root.message}
            </div>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
              autoFocus
              {...register("name")}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name ? (
              <p className="text-xs text-destructive">
                {errors.name.message}
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                The public slug is generated automatically.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category-description">Description</Label>
            <Textarea
              id="category-description"
              rows={4}
              placeholder="Explain what belongs in this category."
              {...register("description")}
              aria-invalid={Boolean(errors.description)}
            />
            {errors.description ? (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            ) : null}
          </div>

          <DialogFooter className="mt-5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              {mode === "create" ? "Create category" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
