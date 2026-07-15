import { cn } from "../../utils/cn";

export function ProfileTitle({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("text-xs text-neutral-400", className)}>{title}</div>
  );
}
