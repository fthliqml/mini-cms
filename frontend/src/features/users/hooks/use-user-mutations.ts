"use client";

import { useApiMutation } from "@/hooks/use-api-mutation";
import { createUser } from "../api/create-user";
import { deleteUser } from "../api/delete-user";
import { updateUser } from "../api/update-user";
import { userQueryKeys } from "../api/user-query-keys";
import type {
  CreateUserInput,
  ManagedUser,
  UpdateUserInput,
} from "../types/user";

interface UpdateUserVariables {
  id: number;
  input: UpdateUserInput;
}

interface DeleteUserVariables {
  id: number;
  name: string;
}

export function useCreateUserMutation() {
  return useApiMutation<ManagedUser, CreateUserInput>({
    mutationFn: createUser,
    invalidateQueryKey: userQueryKeys.all,
    successMessage: (user) => `${user.name} was added to the team.`,
    errorMessage: "The user could not be created.",
  });
}

export function useUpdateUserMutation() {
  return useApiMutation<ManagedUser, UpdateUserVariables>({
    mutationFn: ({ id, input }) => updateUser(id, input),
    invalidateQueryKey: userQueryKeys.all,
    successMessage: (user) => `${user.name}'s changes were saved.`,
    errorMessage: "The user could not be updated.",
  });
}

export function useDeleteUserMutation() {
  return useApiMutation<void, DeleteUserVariables>({
    mutationFn: ({ id }) => deleteUser(id),
    invalidateQueryKey: userQueryKeys.all,
    successMessage: (_, user) => `${user.name} was removed from the team.`,
    errorMessage: "The user could not be deleted.",
  });
}
