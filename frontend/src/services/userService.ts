import users from "../mocks/users.json";
import type { User } from "../types/User";

export const userService = {
  getUserById: async (id: string): Promise<User | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return (users as User[]).find((user) => user.id === id) || null;
  },
};
