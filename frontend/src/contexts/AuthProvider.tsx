import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { authService } from "../services/authService";
import type { ApiErrorResponse } from "../types/api";
import type { User } from "../types/User";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children?: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const {
          data: { user },
        } = await authService.getMe();
        setUser(user);
      } catch (error) {
        toast.error(
          (error as ApiErrorResponse).message || "Failed to load user",
        );
        setUser(null);
      }
    };
    void loadCurrentUser();
  }, []);

  const login = useCallback((nextUser: User) => {
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(() => {
    return {
      user,
      isAuthenticated: !!user,
      login,
      logout,
    };
  }, [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
