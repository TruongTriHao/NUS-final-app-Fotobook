import type { User } from "../../types/User";
import { cn } from "../../utils/cn";
import { Avatar } from "../ui/Avatar";

export function ProfileAvatar({
  user,
  className,
  to = "/me",
}: {
  user: User | null;
  className?: string;
  to?: string;
}) {
  return (
    <Avatar
      user={user}
      className={cn("md:w-31 md:h-31 shrink-0", className)}
      defaultClassName={cn(
        "flex items-center justify-center w-8 md:w-31 h-8 md:h-31 bg-indigo-800 text-white text-lg md:text-4xl shrink-0",
        className,
      )}
      to={to}
    />
  );
}
