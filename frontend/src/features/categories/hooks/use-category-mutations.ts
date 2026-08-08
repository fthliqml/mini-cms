"use client";

import { useApiMutation } from "@/hooks/use-api-mutation";
import { postQueryKeys } from "@/features/posts/api/post-query-keys";
import { categoryQueryKeys } from "../api/category-query-keys";
import { createCategory } from "../api/create-category";
import { deleteCategory } from "../api/delete-category";
import { updateCategory } from "../api/update-category";
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../types/category";

interface UpdateCategoryVariables {
  id: number;
  input: UpdateCategoryInput;
}

interface DeleteCategoryVariables {
  id: number;
  name: string;
}

const invalidatedCategoryKeys = [
  categoryQueryKeys.all,
  postQueryKeys.management(),
];

export function useCreateCategoryMutation() {
  return useApiMutation<Category, CreateCategoryInput>({
    mutationFn: createCategory,
    invalidateQueryKeys: invalidatedCategoryKeys,
    successMessage: (category) => `${category.name} was created.`,
    errorMessage: "The category could not be created.",
  });
}

export function useUpdateCategoryMutation() {
  return useApiMutation<Category, UpdateCategoryVariables>({
    mutationFn: ({ id, input }) => updateCategory(id, input),
    invalidateQueryKeys: invalidatedCategoryKeys,
    successMessage: (category) => `${category.name} was updated.`,
    errorMessage: "The category could not be updated.",
  });
}

export function useDeleteCategoryMutation() {
  return useApiMutation<void, DeleteCategoryVariables>({
    mutationFn: ({ id }) => deleteCategory(id),
    invalidateQueryKeys: invalidatedCategoryKeys,
    successMessage: (_, category) => `${category.name} was deleted.`,
    errorMessage: "The category could not be deleted.",
  });
}
