"use client";

import {
  type QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api";

interface UseApiMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  invalidateQueryKey?: QueryKey;
  successMessage: string | ((data: TData, variables: TVariables) => string);
  errorMessage: string;
}

export function useApiMutation<TData, TVariables>({
  mutationFn,
  invalidateQueryKey,
  successMessage,
  errorMessage,
}: UseApiMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: async (data, variables) => {
      toast.success(
        typeof successMessage === "function"
          ? successMessage(data, variables)
          : successMessage,
      );

      if (invalidateQueryKey) {
        await queryClient.invalidateQueries({ queryKey: invalidateQueryKey });
      }
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, errorMessage));
    },
  });
}
