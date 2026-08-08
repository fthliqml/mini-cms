import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface PostCoverImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

export function PostCoverImage({
  src,
  alt,
  className,
  imageClassName,
  priority = false,
}: PostCoverImageProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[linear-gradient(135deg,#dbeafe_0%,#eef2ff_48%,#fef3c7_100%)]",
        className,
      )}
    >
      {src ? (
        // Dynamic URLs can come from the Laravel public disk or seeded Unsplash photos.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className={cn("h-full w-full object-cover", imageClassName)}
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <div className="flex size-14 items-center justify-center rounded-full border border-white/70 bg-white/55 text-blue-600 shadow-sm backdrop-blur-sm">
            <ImageIcon className="size-5" aria-hidden="true" />
          </div>
        </div>
      )}
    </div>
  );
}
