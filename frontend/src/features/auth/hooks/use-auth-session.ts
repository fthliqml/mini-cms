"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { useAuthStore } from "../store/auth-store";
import type { AuthUser } from "../types/auth";

export function useAuthSession() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  const startSession = useCallback(
    (user: AuthUser) => {
      queryClient.clear();
      setUser(user);
    },
    [queryClient, setUser],
  );

  const endSession = useCallback(() => {
    clearUser();
    queryClient.clear();
  }, [clearUser, queryClient]);

  return { startSession, endSession };
}
