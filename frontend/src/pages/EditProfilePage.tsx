import { ProfileForm } from "../components/new/ProfileForm";
import { NewTitle } from "../components/ui/NewTitle";
import { useAuth } from "../hooks/useAuth";

export function EditProfilePage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <>
      <NewTitle>Edit User Profile</NewTitle>
      <ProfileForm initial={user} />
    </>
  );
}
