import Image from "next/image";
import { cn } from "@/lib/utils";

interface ArticleCoverImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  variant?: "card" | "hero";
}

export function ArticleCoverImage({
  src,
  alt,
  className,
  priority = false,
  variant = "card",
}: ArticleCoverImageProps) {
  const isHero = variant === "hero";
  const sizeClass = isHero
    ? "aspect-[21/9] max-h-80"
    : "aspect-video";

  return (
    <figure
      className={cn(
        "overflow-hidden rounded-lg border-4 border-[var(--color-text-primary)] bg-[var(--color-surface)] p-1.5 shadow-sm",
        className
      )}
    >
      {src ? (
        src.startsWith("blob:") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            className={cn("w-full rounded object-cover", sizeClass)}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={isHero ? 896 : 640}
            height={isHero ? 384 : 360}
            priority={priority}
            className={cn("w-full rounded object-cover", sizeClass)}
            sizes={
              isHero
                ? "(max-width: 768px) 100vw, 896px"
                : "(max-width: 768px) 100vw, 640px"
            }
          />
        )
      ) : (
        <div
          className={cn(
            "flex w-full items-center justify-center rounded bg-[var(--color-bg)] text-body text-[var(--color-text-muted)]",
            sizeClass
          )}
          aria-hidden
        >
          ไม่มีรูปประกอบ
        </div>
      )}
    </figure>
  );
}
