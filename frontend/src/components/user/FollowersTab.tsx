import { useEffect, useState } from "react";
import { followService } from "../../services/followService";
import type { ProfileData } from "../../types/User";
import { Alert } from "../ui/Alert";
import { Loading } from "../ui/Loading";
import { ProfileCard } from "./ProfileCard";
import { ProfileGrid } from "./ProfileGrid";

export function FollowersTab({ id }: { id: string }) {
  const [followers, setFollowers] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchFollowers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await followService.getFollowersProfileData(id);
        if (isMounted) {
          setFollowers(data);
        }
      } catch (e) {
        if (isMounted) {
          setError(e instanceof Error ? e.message : "Error fetching followers");
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

  if (error) {
    return <Alert message={error} />;
  }

  if (followers.length === 0) {
    return <div>No followers found.</div>;
  }

  return (
    <ProfileGrid>
      {followers.map((follower) => (
        <ProfileCard key={follower.id} profile={follower} />
      ))}
    </ProfileGrid>
  );
}
