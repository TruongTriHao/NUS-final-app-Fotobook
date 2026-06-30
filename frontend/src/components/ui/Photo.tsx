import { cn } from "../../utils/cn";

export function Photo({ src, className }: { src: string; className?: string }) {
  return (
    <img
      className={cn("aspect-square object-cover rounded-sm", className)}
      src={src}
    />
  );
}
