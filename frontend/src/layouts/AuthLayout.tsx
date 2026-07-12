import { Navigate, Outlet } from "react-router-dom";
import { Navbar } from "../components/common/Navbar";
import { useAuth } from "../hooks/useAuth";

export function AuthLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
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
