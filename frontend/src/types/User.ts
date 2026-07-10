export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin";
  avatarUrl?: string | null;
  lastLogin?: string | null;
  isActive: boolean;
};
