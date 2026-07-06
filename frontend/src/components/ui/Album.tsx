import { cn } from "../../utils/cn";
import { Photo } from "./Photo";

export function Album({
  src,
  className,
  imageClassName,
  alt,
}: {
  src: [string, string | null, string | null];
  className?: string;
  imageClassName?: string;
  alt: string;
}) {
  return (
    <div className={cn("relative shrink-0 m-1", className)}>
      <Photo
        src={src[0]}
        className={cn("absolute inset-0 w-full -rotate-6", imageClassName)}
        alt={alt}
      />
      {src[1] && (
        <Photo
          src={src[1]}
          className={cn("absolute inset-0 w-full rotate-3", imageClassName)}
          alt={alt}
        />
      )}

      {src[2] && (
        <Photo
          src={src[2]}
          className={cn("absolute inset-0 w-full", imageClassName)}
          alt={alt}
        />
      )}
    </div>
  );
}
