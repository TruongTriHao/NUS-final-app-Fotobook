import { Navigate, Outlet } from "react-router-dom";
import { Navbar } from "../components/common/Navbar";
import { useAuth } from "../hooks/useAuth";

export function AuthLayout() {
  const { user } = useAuth();

  if (user) {
    return (
      <Navigate to={user.role === "admin" ? "/admin" : "/feeds"} replace />
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center mt-17 md:mt-22 shadow-lg h-screen">
        <Outlet />
      </main>
    </>
  );
}
