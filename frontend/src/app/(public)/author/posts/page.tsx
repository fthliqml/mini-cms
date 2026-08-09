import type { Metadata } from "next";

import { AuthorPostWorkspace } from "@/features/posts/components/author/author-post-workspace";

export const metadata: Metadata = {
  title: "My Posts | Mini CMS",
  description: "Create and manage your Mini CMS posts.",
};

export default function AuthorPostsPage() {
  return <AuthorPostWorkspace />;
}
