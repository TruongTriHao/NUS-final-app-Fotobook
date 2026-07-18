import { Link } from "react-router-dom";
import { cn } from "../../utils/cn";

export function ProfileButton({
  isCurrentUser,
  isFollowee,
  followOnClick,
  unfollowOnClick,
  className,
}: {
  isCurrentUser: boolean;
  isFollowee: boolean;
  followOnClick?: () => void;
  unfollowOnClick?: () => void;
  className?: string;
}) {
  if (isCurrentUser) {
    return (
      <Link
        to="/profile/edit"
        className={cn(
          "text-indigo-800 border-2 border-indigo-800 rounded-lg hover:opacity-70 active:opacity-50 px-0.5 md:px-3.5 md:py-1.5 text-xs md:text-base",
          className,
        )}
      >
        Edit Profile
      </Link>
    );
  }
  if (isFollowee) {
    return (
      <button
        onClick={unfollowOnClick}
        className={cn(
          "text-white bg-red-400 border-2 border-red-400 rounded-lg hover:opacity-70 active:opacity-50 px-0.5 md:px-3.5 md:py-1.5 text-xs md:text-base",
          className,
        )}
      >
        Following
      </button>
    );
  }
  return (
    <button
      onClick={followOnClick}
      className={cn(
        "text-red-400 border-2 border-red-400 rounded-lg hover:opacity-70 active:opacity-50 px-0.5 md:px-3.5 md:py-1.5 text-xs md:text-base",
        className,
      )}
    >
      Follow
    </button>
  );
}
