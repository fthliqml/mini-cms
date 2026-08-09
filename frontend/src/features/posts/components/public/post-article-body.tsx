import type { Post } from "../../types/post";
import { MarkdownContent } from "../markdown-content";
import { PostCoverImage } from "../post-cover-image";

interface PostArticleBodyProps {
  post: Post;
}

export function PostArticleBody({ post }: PostArticleBodyProps) {
  return (
    <>
      <PostCoverImage
        src={post.image_url}
        alt=""
        priority
        className="mt-12 aspect-[16/8] rounded-[1.75rem] shadow-[0_24px_80px_rgba(31,42,68,0.12)] ring-1 ring-slate-900/8 md:mt-16"
      />

      <MarkdownContent
        content={post.content}
        className="prose-lg mx-auto mt-12 max-w-3xl leading-relaxed prose-headings:font-heading prose-headings:tracking-[-0.04em] prose-a:text-blue-700 md:mt-16"
      />
    </>
  );
}
