import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function ProtectedLayout({
  requireAdmin = false,
  children,
}: {
  requireAdmin?: boolean;
  children?: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
