import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert } from "../components/ui/Alert";
import { Loading } from "../components/ui/Loading";
import { ProfileAvatar } from "../components/user/ProfileAvatar";
import { ProfileButton } from "../components/user/ProfileButton";
import { ProfileTabs } from "../components/user/ProfileTabs";
import { useAuth } from "../hooks/useAuth";
import { userService } from "../services/userService";
import type { ProfileData } from "../types/User";

export function ProfilePage() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { userId } = useParams();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeId = userId ?? currentUser?.id;

  useEffect(() => {
    if (userId && currentUser?.id === userId) {
      void navigate("/me", { replace: true });
      return;
    }

    let isMounted = true;
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await userService.getProfileData(
          currentUser?.id ?? "",
          activeId ?? "",
        );
        if (!data) {
          void navigate("/not-found", { replace: true });
          return;
        }
        if (isMounted) {
          setProfile(data);
        }
      } catch (e) {
        if (isMounted) {
          setError(
            e instanceof Error ? e.message : "Error fetching profile data",
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

  if (error) {
    return <Alert message={error} />;
  }

  if (!profile) {
    return <Alert message="Profile not found" />;
  }

  return (
    <>
      <div className="flex items-center m-1">
        <ProfileAvatar
          user={profile}
          className="m-2 md:m-8"
          to={
            profile.isCurrentUser
              ? "/me"
              : activeId
                ? `/profile/${activeId}`
                : undefined
          }
        />
        <div className="flex flex-col items-start md:gap-2">
          <ProfileButton
            isCurrentUser={profile.isCurrentUser}
            isFollowee={profile.isFollowee}
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
