import {
  FolderKanban,
  Newspaper,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { UserRole } from "@/features/auth/types/auth";

export interface DashboardNavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export function getDashboardNavigation(
  role: UserRole,
): DashboardNavigationItem[] {
  const basePath = `/dashboard/${role}`;
  const items: DashboardNavigationItem[] = [
    {
      title: "Posts",
      href: `${basePath}/posts`,
      icon: Newspaper,
    },
  ];

  if (role === "admin") {
    items.push({
      title: "Categories",
      href: `${basePath}/categories`,
      icon: FolderKanban,
    });
    items.push({
      title: "Users",
      href: `${basePath}/users`,
      icon: Users,
    });
  }

  return items;
}
