import { cn } from "../../utils/cn";

export function Photo({
  src,
  className,
  alt,
}: {
  src: string;
  className?: string;
  alt: string;
}) {
  return (
    <img
      className={cn(
        "aspect-square object-cover rounded-sm shrink-0",
        className,
      )}
      src={src}
      alt={alt}
    />
  );
}
