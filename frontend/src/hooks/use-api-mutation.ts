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
  invalidateQueryKeys?: QueryKey[];
  successMessage: string | ((data: TData, variables: TVariables) => string);
  errorMessage: string;
}

export function useApiMutation<TData, TVariables>({
  mutationFn,
  invalidateQueryKey,
  invalidateQueryKeys,
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

      const queryKeys = [
        ...(invalidateQueryKey ? [invalidateQueryKey] : []),
        ...(invalidateQueryKeys ?? []),
      ];

      if (queryKeys.length > 0) {
        await Promise.all(
          queryKeys.map((queryKey) =>
            queryClient.invalidateQueries({ queryKey }),
          ),
        );
      }
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, errorMessage));
    },
  });
}
