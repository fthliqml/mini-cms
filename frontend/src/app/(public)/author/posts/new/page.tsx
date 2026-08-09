import type { Metadata } from "next";

import { AuthorPostWorkspace } from "@/features/posts/components/author/author-post-workspace";

export const metadata: Metadata = {
  title: "New Post | Mini CMS",
};

export default function CreateAuthorPostPage() {
  return <AuthorPostWorkspace startCreating />;
}
