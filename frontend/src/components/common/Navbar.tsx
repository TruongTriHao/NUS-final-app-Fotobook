import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { AuthButton } from "../auth/AuthButton";
import { UserInfo } from "../main/UserInfo";
import { Logo } from "../ui/Logo";
import { SearchBar } from "../ui/SearchBar";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div
      className={
        "grid grid-cols-[1fr_3fr_1fr_0.5fr] items-center fixed top-0 left-0 right-0 bg-indigo-800 gap-2 min-h-12 z-50"
      }
    >
      <Link to="/">
        <Logo isAdmin={user?.role === "admin"} />
      </Link>
      <SearchBar />
      {isAuthenticated ? (
        <UserInfo
          user={user}
          outerClassName="justify-start overflow-hidden"
          avatarClassName="text-indigo-800 bg-white"
          nameClassName="text-white hidden md:block"
        />
      ) : (
        <div />
      )}
      <AuthButton isAuthenticated={isAuthenticated} logout={logout} />
    </div>
  );
}
