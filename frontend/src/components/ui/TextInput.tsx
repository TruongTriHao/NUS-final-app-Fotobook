import { cn } from "../../utils/cn";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "border-2 border-neutral-200 p-1.5 md:p-3 mx-2 md:mx-4 rounded-sm md:min-w-54.5 text-xs md:text-base",
        props.className,
      )}
    />
  );
}
