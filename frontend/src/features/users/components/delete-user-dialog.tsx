"use client";

import { ConfirmActionDialog } from "@/components/crud/confirm-action-dialog";
import { getApiErrorMessage } from "@/lib/api";
import { useDeleteUserMutation } from "../hooks/use-user-mutations";
import type { ManagedUser } from "../types/user";

interface DeleteUserDialogProps {
  user: ManagedUser;
  onClose: () => void;
  onDeleted: () => void;
}

export function DeleteUserDialog({
  user,
  onClose,
  onDeleted,
}: DeleteUserDialogProps) {
  const deleteMutation = useDeleteUserMutation();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync({ id: user.id, name: user.name });
      onDeleted();
    } catch {
      return;
    }
  };

  return (
    <ConfirmActionDialog
      open
      title={`Delete ${user.name}?`}
      description="This permanently removes the account. Users who still own posts must have those posts reassigned before deletion."
      confirmLabel="Delete user"
      isPending={deleteMutation.isPending}
      error={
        deleteMutation.error
          ? getApiErrorMessage(
              deleteMutation.error,
              "The user could not be deleted.",
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
