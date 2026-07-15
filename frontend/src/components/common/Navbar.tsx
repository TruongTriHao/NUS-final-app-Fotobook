import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { AuthButton } from "../ui/AuthButton";
import { Logo } from "../ui/Logo";
import { SearchBar } from "../ui/SearchBar";
import { UserInfo } from "../ui/UserInfo";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav
      className={
        "grid grid-cols-[1fr_3fr_1fr_0.5fr] items-center fixed top-0 left-0 right-0 bg-indigo-800 gap-2 min-h-12 z-50"
      }
    >
      <Link to={user?.role === "admin" ? "/admin/" : "/"}>
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
    </nav>
  );
}
