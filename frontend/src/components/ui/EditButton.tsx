import { Link } from "react-router-dom";
import { cn } from "../../utils/cn";

export function EditButton({
  text = "EDIT",
  to,
  className,
}: {
  text?: string;
  to: string;
  className?: string;
}) {
  return (
    <Link
      className={cn(
        "absolute bottom-0 right-0 text-white font-bold text-xs md:text-sm rounded-full bg-black/40 hover:opacity-30 p-0.5 md:p-1",
        className,
      )}
      to={to}
    >
      {text}
    </Link>
  );
}
