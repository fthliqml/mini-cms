import { getPosts } from "@/services/post";
import { PostList } from "./_components/post-list";

export default async function Home() {
  const { posts } = await getPosts();

  return (
    <div className="flex flex-1 flex-col font-sans min-h-screen bg-background">
      {/* ── Main Content ── */}
      <main className="mx-auto w-full container px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Public Posts
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Latest articles and updates from Mini CMS.
          </p>
        </div>

        <PostList posts={posts} />
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/50 py-6">
        <div className="mx-auto container px-6 text-center text-xs text-muted-foreground">
          Mini CMS &copy; {new Date().getFullYear()} - Muhammad Fatihul Iqmal
        </div>
      </footer>
    </div>
  );
}
