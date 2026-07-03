import { cn } from "../../utils/cn";
import { Photo } from "./Photo";

export function UserInfo({
  firstName,
  lastName,
  avatarUrl,
  forNavbar = false,
}: {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  forNavbar?: boolean;
}) {
  const alternativeStyle1 = "justify-start overflow-hidden";
  const alternativeStyle2 = "text-indigo-800 bg-white";
  const alternativeStyle3 = "text-white hidden md:block";

  return (
    <div
      className={cn("flex items-center gap-1", forNavbar && alternativeStyle1)}
    >
      {avatarUrl ? (
        <Photo
          className="rounded-full w-8 h-8"
          src={avatarUrl}
          alt={`${firstName} ${lastName}'s avatar`}
        />
      ) : (
        <div
          className={cn(
            "rounded-full p-2 font-bold",
            forNavbar
              ? alternativeStyle2
              : "text-white text-xs md:text-sm bg-indigo-800",
          )}
        >
          {firstName.charAt(0)}
          {lastName.charAt(0)}
        </div>
      )}
      <div
        className={cn(
          "p-2",
          forNavbar ? alternativeStyle3 : "text-indigo-800 text-xs md:text-sm",
        )}
      >
        {firstName} {lastName}
      </div>
    </div>
  );
}
