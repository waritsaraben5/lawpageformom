import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProfileImageFrameProps {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function ProfileImageFrame({
  src,
  alt,
  className,
  priority = false,
}: ProfileImageFrameProps) {
  return (
    <figure
      className={cn(
        "shrink-0 rounded-lg border-4 border-[var(--color-text-primary)] bg-[var(--color-surface)] p-1.5 shadow-sm",
        className
      )}
    >
      {src ? (
        src.startsWith("blob:") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            className="aspect-[4/5] h-auto w-44 rounded object-cover sm:w-56"
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={224}
            height={280}
            priority={priority}
            className="aspect-[4/5] h-auto w-44 rounded object-cover sm:w-56"
            sizes="(max-width: 640px) 176px, 224px"
          />
        )
      ) : (
        <div
          className="flex aspect-[4/5] w-44 items-center justify-center rounded bg-[var(--color-bg)] px-3 text-center text-body text-[var(--color-text-muted)] sm:w-56"
          aria-hidden={!alt}
        >
          ยังไม่มีรูปภาพ
        </div>
      )}
    </figure>
  );
}
