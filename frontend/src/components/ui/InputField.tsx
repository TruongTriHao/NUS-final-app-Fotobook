import { cn } from "../../utils/cn";

export function InputField({
  label,
  htmlFor,
  children,
  outerClassName,
  labelClassName,
}: {
  label: string;
  htmlFor: string;
  children?: React.ReactNode;
  outerClassName?: string;
  labelClassName?: string;
}) {
  return (
    <div className={cn("flex flex-col my-1", outerClassName)}>
      <label
        htmlFor={htmlFor}
        className={cn(
          "font-bold text-xs md:text-base mx-2 md:mx-4",
          labelClassName,
        )}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
