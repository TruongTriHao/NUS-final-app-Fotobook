import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Loading } from "../components/ui/Loading";
import { ProfileAvatar } from "../components/user/ProfileAvatar";
import { ProfileButton } from "../components/user/ProfileButton";
import { ProfileTabs } from "../components/user/ProfileTabs";
import { useAuth } from "../hooks/useAuth";
import { userService } from "../services/userService";
import type { ApiErrorResponse } from "../types/api";
import type { ProfileData } from "../types/User";

export function ProfilePage() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { userId } = useParams();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [isFollowee, setIsFollowee] = useState(false);

  const activeId = userId ?? currentUser?.id;

  const handleFollow = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to follow users.");
      return;
    }
    try {
      setFollowLoading(true);
      const {
        data: { follow },
        message,
      } = isFollowee
        ? await userService.unfollowUser(profile?.id ?? "")
        : await userService.followUser(profile?.id ?? "");
      setIsFollowee(follow);
      toast.success(message);
    } catch (error) {
      toast.error(
        (error as ApiErrorResponse).message ||
          "An error occurred while following the user.",
      );
    } finally {
      setFollowLoading(false);
    }
  };

  useEffect(() => {
    if (userId && currentUser?.id === userId) {
      void navigate("/profile/me", { replace: true });
      return;
    }

    let isMounted = true;
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const {
          data: { user },
        } = await userService.getProfileData(
          currentUser?.id ?? "",
          activeId ?? "",
        );
        if (isMounted) {
          setProfile(user);
          setIsFollowee(user.isFollowee);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(
            (error as ApiErrorResponse).message ||
              "Failed to fetch profile data",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchProfileData();

    return () => {
      isMounted = false;
    };
  }, [userId, currentUser, navigate, activeId]);

  if (loading) {
    return <Loading />;
  }

  if (!profile) {
    void navigate("/not-found", { replace: true });
    return null;
  }

  return (
    <>
      <div className="flex items-center m-1">
        <ProfileAvatar
          user={profile}
          className="m-2 md:m-8"
          to={
            profile.isCurrentUser
              ? "/profile/me"
              : activeId
                ? `/profile/${activeId}`
                : undefined
          }
        />
        <div className="flex flex-col items-start md:gap-2">
          <ProfileButton
            disabled={followLoading}
            onClick={() => void handleFollow()}
            isCurrentUser={profile.isCurrentUser}
            isFollowee={isFollowee}
          />
          <div className="font-bold text-lg md:text-4xl">
            {profile.firstName} {profile.lastName}
          </div>
        </div>
      </div>
      <ProfileTabs profile={profile} />
    </>
  );
}
