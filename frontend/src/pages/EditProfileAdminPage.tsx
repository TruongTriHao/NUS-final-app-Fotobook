import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { EditProfileAdminForm } from "../components/admin/EditProfileAdminForm";
import { Loading } from "../components/ui/Loading";
import { NewTitle } from "../components/ui/NewTitle";
import { userService } from "../services/userService";
import type { AdminUserData } from "../types/User";
import type { ApiErrorResponse } from "../types/api";

export function EditProfileAdminPage() {
  const navigate = useNavigate();
  const id = useParams().id as string;
  const [user, setUser] = useState<AdminUserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        setLoading(true);
        const {
          data: { user },
          message,
        } = await userService.getUserById(id);
        if (isMounted) {
          setUser(user);
          toast.success(message);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(
            (error as ApiErrorResponse).message || "Failed to fetch user.",
          );
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

  if (!user) {
    void navigate("/not-found", { replace: true });
    return null;
  }

  return (
    <>
      <NewTitle>Edit User Profile</NewTitle>
      <EditProfileAdminForm initial={user} />
    </>
  );
}
