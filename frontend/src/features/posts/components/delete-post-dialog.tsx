"use client";

import { ConfirmActionDialog } from "@/components/crud/confirm-action-dialog";
import { getApiErrorMessage } from "@/lib/api";
import { useDeletePostMutation } from "../hooks/use-post-mutations";
import type { Post } from "../types/post";

interface DeletePostDialogProps {
  post: Post;
  onClose: () => void;
  onDeleted: () => void;
}

export function DeletePostDialog({
  post,
  onClose,
  onDeleted,
}: DeletePostDialogProps) {
  const deleteMutation = useDeletePostMutation();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync({
        slug: post.slug,
        title: post.title,
      });
      onDeleted();
    } catch {
      return;
    }
  };

  return (
    <ConfirmActionDialog
      open
      title={`Delete ${post.title}?`}
      description="This permanently removes the article from the editorial workspace and public site."
      confirmLabel="Delete post"
      isPending={deleteMutation.isPending}
      error={
        deleteMutation.error
          ? getApiErrorMessage(
              deleteMutation.error,
              "The post could not be deleted.",
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
