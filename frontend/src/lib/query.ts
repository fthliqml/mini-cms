import type { AuthQueryScope } from "@/features/auth/types/auth";

export function isSameAuthQueryScope(
  current: AuthQueryScope | null,
  previous: AuthQueryScope | null,
) {
  return (
    current?.userId === previous?.userId && current?.role === previous?.role
  );
}
