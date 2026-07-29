import { cn } from "../../utils/cn";

export function DeleteButton({
  onClick,
  disabled,
  className,
}: {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "bg-rose-500 text-white font-bold hover:opacity-70 active:opacity-50 rounded-sm mx-2 md:mx-4 px-1.25 md:px-2.5 py-1 md:py-2 text-xs md:text-base cursor-pointer",
        className,
      )}
    >
      Delete
    </button>
  );
}
