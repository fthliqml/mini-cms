"use client";

import { ConfirmActionDialog } from "@/components/crud/confirm-action-dialog";
import { getApiErrorMessage } from "@/lib/api";
import { useDeleteCategoryMutation } from "../hooks/use-category-mutations";
import type { Category } from "../types/category";

interface DeleteCategoryDialogProps {
  category: Category;
  onClose: () => void;
  onDeleted: () => void;
}

export function DeleteCategoryDialog({
  category,
  onClose,
  onDeleted,
}: DeleteCategoryDialogProps) {
  const deleteMutation = useDeleteCategoryMutation();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync({
        id: category.id,
        name: category.name,
      });
      onDeleted();
    } catch {
      return;
    }
  };

  return (
    <ConfirmActionDialog
      open
      title={`Delete ${category.name}?`}
      description="This removes the category permanently. Categories assigned to posts must be removed from those posts first."
      confirmLabel="Delete category"
      isPending={deleteMutation.isPending}
      error={
        deleteMutation.error
          ? getApiErrorMessage(
              deleteMutation.error,
              "The category could not be deleted.",
            )
          : null
      }
      onOpenChange={(open) => {
        if (!open && !deleteMutation.isPending) {
          onClose();
        }
      }}
      onConfirm={handleDelete}
    />
  );
}
