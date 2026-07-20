import { cn } from "../../utils/cn";

export function ProfileInfoText({
  amount,
  text,
  className,
  onClick,
}: {
  amount: number;
  text: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center text-indigo-800 font-bold text-xs md:text-sm z-30",
        className,
      )}
      onClick={onClick}
    >
      <div>{amount}</div>
      <div>{text}</div>
    </div>
  );
}
