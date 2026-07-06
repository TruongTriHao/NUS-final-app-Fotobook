import users from "../mocks/users.json";
import type { User } from "../types/User";

export const authService = {
  login: async (email: string, password: string): Promise<User | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return (
      (users as User[]).find(
        (user) => user.email === email && password === "password",
      ) || null
    );
  },
};
