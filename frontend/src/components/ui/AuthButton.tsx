import { useNavigate } from "react-router-dom";

export function AuthButton({
  isAuthenticated,
  logout,
}: {
  isAuthenticated: boolean;
  logout: () => void;
}) {
  const navigate = useNavigate();

  return isAuthenticated ? (
    <button
      className="text-white hover:text-indigo-300 active:text-indigo-400 text-xs md:text-base mx-2 md:mx-4 cursor-pointer"
      onClick={() => {
        logout();
        void navigate("/login");
      }}
    >
      Logout
    </button>
  ) : (
    <button
      className="text-white hover:text-indigo-300 active:text-indigo-400 text-xs md:text-base mx-2 md:mx-4 cursor-pointer"
      onClick={() => void navigate("/login")}
    >
      Login
    </button>
  );
}
