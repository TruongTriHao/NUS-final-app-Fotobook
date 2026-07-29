import { cn } from "../../utils/cn";
import { SubmitButton } from "./SubmitButton";

export function SaveButton({
  onClick,
  disabled,
  className,
}: {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <SubmitButton
      text="Save"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "bg-green-600 mx-2 md:mx-4 px-1.25 md:px-2.5 py-1 md:py-2",
        className,
      )}
    />
  );
}
