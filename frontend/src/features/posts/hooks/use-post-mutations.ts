"use client";

import { useApiMutation } from "@/hooks/use-api-mutation";
import { createPost } from "../api/create-post";
import { deletePost } from "../api/delete-post";
import { postQueryKeys } from "../api/post-query-keys";
import { updatePost } from "../api/update-post";
import type { CreatePostInput, Post, UpdatePostInput } from "../types/post";

interface UpdatePostVariables {
  slug: string;
  input: UpdatePostInput;
}

interface DeletePostVariables {
  slug: string;
  title: string;
}

export function useCreatePostMutation() {
  return useApiMutation<Post, CreatePostInput>({
    mutationFn: createPost,
    invalidateQueryKey: postQueryKeys.management(),
    successMessage: (post) => `${post.title} was created.`,
    errorMessage: "The post could not be created.",
  });
}

export function useUpdatePostMutation() {
  return useApiMutation<Post, UpdatePostVariables>({
    mutationFn: ({ slug, input }) => updatePost(slug, input),
    invalidateQueryKey: postQueryKeys.management(),
    successMessage: (post) => `${post.title} was updated.`,
    errorMessage: "The post could not be updated.",
  });
}

export function useDeletePostMutation() {
  return useApiMutation<void, DeletePostVariables>({
    mutationFn: ({ slug }) => deletePost(slug),
    invalidateQueryKey: postQueryKeys.management(),
    successMessage: (_, post) => `${post.title} was deleted.`,
    errorMessage: "The post could not be deleted.",
  });
}
