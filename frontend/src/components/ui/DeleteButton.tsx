import { cn } from "../../utils/cn";

export function DeleteButton({ className }: { className?: string }) {
  return (
    <button
      className={cn(
        "bg-rose-500 text-white font-bold hover:opacity-70 active:opacity-50 rounded-sm mx-2 md:mx-4 px-1.25 md:px-2.5 py-1 md:py-2 text-xs md:text-base",
        className,
      )}
    >
      Delete
    </button>
  );
}
