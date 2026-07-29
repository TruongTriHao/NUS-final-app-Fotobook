import { useEffect, useState } from "react";
import { toast } from "sonner";
import { followService } from "../../services/followService";
import type { ApiErrorResponse } from "../../types/api";
import type { ProfileData } from "../../types/User";
import { Loading } from "../ui/Loading";
import { NotFoundMessage } from "../ui/NotFoundMessage";
import { ProfileCard } from "./ProfileCard";
import { ProfileGrid } from "./ProfileGrid";

export function FollowersTab({
  id,
  onFollowChange,
}: {
  id: string;
  onFollowChange?: (change: number) => void;
}) {
  const [followers, setFollowers] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchFollowers = async () => {
      try {
        setLoading(true);
        const {
          data: { followers },
          message,
        } = await followService.getFollowersProfileData(id);
        if (isMounted) {
          setFollowers(followers);
          toast.success(message);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(
            (error as ApiErrorResponse).message || "Failed to fetch followers.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchFollowers();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (followers.length === 0) {
    return <NotFoundMessage itemType="followers" />;
  }

  return (
    <ProfileGrid>
      {followers.map((follower) => (
        <ProfileCard
          key={follower.id}
          profile={follower}
          onFollowChange={onFollowChange}
        />
      ))}
    </ProfileGrid>
  );
}
