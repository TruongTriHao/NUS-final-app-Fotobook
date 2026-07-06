import type { User } from "../../types/User";
import { cn } from "../../utils/cn";
import { Avatar } from "../ui/Avatar";

export function UserInfo({
  user,
  outerClassName,
  avatarClassName,
  nameClassName,
  to = "/me",
}: {
  user: User | null;
  outerClassName?: string;
  avatarClassName?: string;
  nameClassName?: string;
  to?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1", outerClassName)}>
      <Avatar
        user={user}
        defaultClassName={cn("p-2", avatarClassName)}
        to={to}
      />
      <div className={cn("p-2", nameClassName)}>
        {user?.firstName} {user?.lastName}
      </div>
    </div>
  );
}
