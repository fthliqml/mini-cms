import type { Post } from "../../types/post";
import { PostCard } from "./post-card";

interface LatestPostsProps {
  posts: Post[];
}

export function LatestPosts({ posts }: LatestPostsProps) {
  return (
    <section id="latest" className="scroll-mt-24 pt-20 md:pt-28">
      <div className="flex items-end justify-between gap-5 border-b border-slate-900/10 pb-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-700">
            From the desk
          </p>
          <h2 className="mt-2 font-heading text-4xl font-semibold tracking-[-0.055em] text-slate-950 md:text-5xl">
            Latest stories
          </h2>
        </div>
        <p className="hidden max-w-xs text-right text-xs leading-5 text-slate-400 sm:block">
          Fresh perspectives from our writers, sorted by publication date.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-x-6 gap-y-12 pt-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="pt-8 text-sm text-slate-500">
          More stories are being prepared by the editorial team.
        </p>
      )}
    </section>
  );
}
