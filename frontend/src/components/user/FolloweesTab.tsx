import { useEffect, useState } from "react";
import { followService } from "../../services/followService";
import type { ProfileData } from "../../types/User";
import { Alert } from "../ui/Alert";
import { Loading } from "../ui/Loading";
import { ProfileCard } from "./ProfileCard";
import { ProfileGrid } from "./ProfileGrid";

export function FolloweesTab({ id }: { id: string }) {
  const [followees, setFollowees] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchFollowees = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await followService.getFolloweesProfileData(id);
        if (isMounted) {
          setFollowees(data);
        }
      } catch (e) {
        if (isMounted) {
          setError(e instanceof Error ? e.message : "Error fetching followees");
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

  if (error) {
    return <Alert message={error} />;
  }

  if (followees.length === 0) {
    return <div>No followees found.</div>;
  }

  return (
    <ProfileGrid>
      {followees.map((followee) => (
        <ProfileCard key={followee.id} profile={followee} />
      ))}
    </ProfileGrid>
  );
}
