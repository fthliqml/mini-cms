import type { Post } from "../../types/post";
import { BackToStoriesLink } from "./back-to-stories-link";
import { PostArticleBody } from "./post-article-body";
import { PostDetailHeader } from "./post-detail-header";

interface PostDetailProps {
  post: Post;
}

export function PostDetail({ post }: PostDetailProps) {
  return (
    <main className="mx-auto w-full max-w-[1180px] flex-1 px-5 pb-20 pt-8 md:px-8 md:pb-28 md:pt-12">
      <div className="mb-10">
        <BackToStoriesLink className="-ml-3 text-slate-500 hover:text-slate-950" />
      </div>

      <article>
        <PostDetailHeader post={post} />
        <PostArticleBody post={post} />
      </article>

      <footer className="mx-auto mt-16 max-w-3xl border-t border-slate-900/10 pt-7">
        <BackToStoriesLink
          label="Back to all stories"
          variant="outline"
        />
      </footer>
    </main>
  );
}
