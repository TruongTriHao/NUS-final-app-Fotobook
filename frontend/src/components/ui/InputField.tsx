import { cn } from "../../utils/cn";

export function InputField({
  label,
  htmlFor,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="flex flex-col my-1">
      <label
        htmlFor={htmlFor}
        className={cn("font-bold text-xs md:text-base mx-2 md:mx-4", className)}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
