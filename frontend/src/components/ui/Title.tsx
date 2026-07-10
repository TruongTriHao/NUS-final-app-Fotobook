import { cn } from "../../utils/cn";

export function Title({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "font-bold text-2xl md:text-4xl text-indigo-800",
        className,
      )}
    >
      {children}
    </div>
  );
}
