import { cn } from "../../utils/cn";
import { Photo } from "./Photo";

export function UserInfo({
  firstName,
  lastName,
  avatarUrl,
  outerClassName,
  defaultAvatarClassName,
  nameClassName,
}: {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  outerClassName?: string;
  defaultAvatarClassName?: string;
  nameClassName?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1", outerClassName)}>
      {avatarUrl ? (
        <Photo
          className="rounded-full w-8 h-8"
          src={avatarUrl}
          alt={`${firstName} ${lastName}'s avatar`}
        />
      ) : (
        <div
          className={cn("rounded-full p-2 font-bold", defaultAvatarClassName)}
        >
          {firstName.charAt(0)}
          {lastName.charAt(0)}
        </div>
      )}
      <div className={cn("p-2", nameClassName)}>
        {firstName} {lastName}
      </div>
    </div>
  );
}
