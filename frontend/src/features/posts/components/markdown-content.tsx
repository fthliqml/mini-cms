import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

const markdownPlugins = [remarkGfm];

export function MarkdownContent({
  content,
  className,
}: MarkdownContentProps) {
  return (
    <div className={cn("prose prose-slate max-w-none", className)}>
      <ReactMarkdown remarkPlugins={markdownPlugins}>{content}</ReactMarkdown>
    </div>
  );
}
