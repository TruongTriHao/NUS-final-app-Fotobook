import { useAuth } from "../../hooks/useAuth";
import { AuthButton } from "../ui/AuthButton";
import { Logo } from "../ui/Logo";
import { SearchBar } from "../ui/SearchBar";
import { UserInfo } from "../ui/UserInfo";

export function Navbar() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div
      className={
        "grid grid-cols-[1fr_3fr_1fr_0.5fr] items-center fixed top-0 left-0 right-0 bg-indigo-800 gap-2 min-h-12 z-50"
      }
    >
      <Logo isAdmin={user?.role === "admin"} />
      <SearchBar />
      {isAuthenticated ? (
        <UserInfo
          firstName={user?.firstName ?? ""}
          lastName={user?.lastName ?? ""}
          avatarUrl={user?.avatarUrl ?? undefined}
          outerClassName="justify-start overflow-hidden"
          defaultAvatarClassName="text-indigo-800 bg-white"
          nameClassName="text-white hidden md:block"
        />
      ) : (
        <div />
      )}
      <AuthButton />
    </div>
  );
}
