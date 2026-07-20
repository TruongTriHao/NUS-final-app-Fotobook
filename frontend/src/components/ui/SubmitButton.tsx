import { cn } from "../../utils/cn";

export function SubmitButton({
  text = "Submit",
  className,
  onClick,
}: {
  text?: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "self-center bg-indigo-800 text-xs md:text-base text-white rounded-sm font-bold px-2.75 md:px-5.5 py-1.25 md:py-2.5 my-1.25 md:my-2.5 hover:opacity-70 active:opacity-50",
        className,
      )}
      type="submit"
    >
      {text}
    </button>
  );
}
