export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin";
  avatarUrl?: string | null;
};

export type ProfileData = User & {
  isCurrentUser: boolean;
  isFollowee: boolean;
  numPhotos: number;
  numAlbums: number;
  numFollowers: number;
  numFollowees: number;
};

export type AdminUserData = User & {
  lastLogin?: string | null;
  isActive: boolean;
};
