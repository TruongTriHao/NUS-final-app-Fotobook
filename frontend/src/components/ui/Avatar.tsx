import { Link } from "react-router-dom";
import type { User } from "../../types/User";
import { cn } from "../../utils/cn";
import { Photo } from "./Photo";

export function Avatar({
  user,
  className,
  defaultClassName,
  to = "/me",
}: {
  user: User | null;
  className?: string;
  defaultClassName?: string;
  to?: string;
}) {
  if (!user) {
    return <div className={cn("w-8 h-8", className)} />;
  }

  return (
    <Link to={to}>
      {user.avatarUrl ? (
        <Photo
          className={cn("w-8 h-8 rounded-full", className)}
          src={user.avatarUrl}
          alt={`${user.firstName} ${user.lastName}'s avatar`}
        />
      ) : (
        <div className={cn("rounded-full font-bold", defaultClassName)}>
          {user.firstName.charAt(0)}
          {user.lastName.charAt(0)}
        </div>
      )}
    </Link>
  );
}
