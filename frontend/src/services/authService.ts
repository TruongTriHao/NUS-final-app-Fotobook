import users from "../mocks/users.json";
import type { User } from "../types/User";

// Temporary mock service with 1 second delay to simulate API calls. TODO: replace with real API calls when backend is ready.
export const authService = {
  login: async (email: string, password: string): Promise<User | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return (
      (users as User[]).find(
        (user) =>
          user.email === email && password === "password" && user.isActive,
      ) || null
    );
  },
};
