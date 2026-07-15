import { Navigate, Outlet } from "react-router-dom";
import { Navbar } from "../components/common/Navbar";
import { Sidebar } from "../components/common/Sidebar";
import { useAuth } from "../hooks/useAuth";

export function AdminLayout() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar />
      <Sidebar type="admin" />
      <main className="flex flex-col bg-white ml-[15%] mt-17 md:mt-22 shadow-lg max-w-full md:max-w-[70%]">
        <Outlet />
      </main>
    </>
  );
}
