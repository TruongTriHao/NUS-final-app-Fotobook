import { useEffect, useState } from "react";
import { toast } from "sonner";
import { followService } from "../../services/followService";
import type { ApiErrorResponse } from "../../types/api";
import type { ProfileData } from "../../types/User";
import { Loading } from "../ui/Loading";
import { NotFoundMessage } from "../ui/NotFoundMessage";
import { ProfileCard } from "./ProfileCard";
import { ProfileGrid } from "./ProfileGrid";

export function FolloweesTab({
  id,
  onFollowChange,
}: {
  id: string;
  onFollowChange?: (change: number) => void;
}) {
  const [followees, setFollowees] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchFollowees = async () => {
      try {
        setLoading(true);
        const {
          data: { followees },
          message,
        } = await followService.getFolloweesProfileData(id);
        if (isMounted) {
          setFollowees(followees);
          toast.success(message);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(
            (error as ApiErrorResponse).message ||
              "Failed to fetch followings.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchFollowees();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (followees.length === 0) {
    return <NotFoundMessage itemType="followings" />;
  }

  return (
    <ProfileGrid>
      {followees.map((followee) => (
        <ProfileCard
          key={followee.id}
          profile={followee}
          onFollowChange={onFollowChange}
        />
      ))}
    </ProfileGrid>
  );
}
