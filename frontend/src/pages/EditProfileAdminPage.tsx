import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EditProfileAdminForm } from "../components/admin/EditProfileAdminForm";
import { Alert } from "../components/ui/Alert";
import { Loading } from "../components/ui/Loading";
import { NewTitle } from "../components/ui/NewTitle";
import { userService } from "../services/userService";
import type { User } from "../types/User";

export function EditProfileAdminPage() {
  const id = useParams().id as string;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await userService.getUserById(id);
        if (isMounted) {
          setUser(data);
        }
      } catch (e) {
        if (isMounted) {
          setError(e instanceof Error ? e.message : "Error fetching user");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchUser();

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

  if (!user) {
    return <Alert message="User not found." />;
  }

  return (
    <>
      <NewTitle>Edit User Profile</NewTitle>
      <EditProfileAdminForm initial={user} />
    </>
  );
}
