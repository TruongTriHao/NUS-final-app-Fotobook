import { cn } from "../../utils/cn";

export function Photo({
  src,
  className,
  alt,
  onClick,
}: {
  src: string;
  className?: string;
  alt: string;
  onClick?: () => void;
}) {
  return (
    <img
      className={cn(
        "aspect-square object-cover rounded-sm shrink-0 select-none",
        className,
      )}
      src={src}
      alt={alt}
      onClick={onClick}
      draggable={false}
    />
  );
}
