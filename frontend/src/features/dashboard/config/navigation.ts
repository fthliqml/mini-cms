import {
  FolderKanban,
  Newspaper,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface DashboardNavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const adminDashboardNavigation: DashboardNavigationItem[] = [
  {
    title: "Posts",
    href: "/dashboard/admin/posts",
    icon: Newspaper,
  },
  {
    title: "Categories",
    href: "/dashboard/admin/categories",
    icon: FolderKanban,
  },
  {
    title: "Users",
    href: "/dashboard/admin/users",
    icon: Users,
  },
];
