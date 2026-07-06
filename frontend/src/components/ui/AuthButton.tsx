import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function AuthButton() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return isAuthenticated ? (
    <button
      className="text-white hover:text-indigo-300 active:text-indigo-400 text-xs md:text-base"
      onClick={logout}
    >
      Logout
    </button>
  ) : (
    <button
      className="text-white hover:text-indigo-300 active:text-indigo-400 text-xs md:text-base"
      onClick={() => void navigate("/login")}
    >
      Login
    </button>
  );
}
