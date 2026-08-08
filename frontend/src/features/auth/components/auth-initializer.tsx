"use client";

import { useEffect } from "react";

import { getCurrentUser } from "../api/get-current-user";
import { useAuthStore } from "../store/auth-store";

export function AuthInitializer() {
  useEffect(() => {
    let isActive = true;

    async function restoreSession() {
      try {
        const response = await getCurrentUser();

        if (
          isActive &&
          useAuthStore.getState().status === "loading"
        ) {
          useAuthStore.getState().setUser(response.data);
        }
      } catch {
        if (
          isActive &&
          useAuthStore.getState().status === "loading"
        ) {
          useAuthStore.getState().clearUser();
        }
      }
    }

    void restoreSession();

    return () => {
      isActive = false;
    };
  }, []);

  return null;
}
