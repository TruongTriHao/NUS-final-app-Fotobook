import type { User } from "./User";

export type Photo = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  mode: "public" | "private";
  ownerId: string;
};

export type PhotoWithOwner = Photo & { isLiked: boolean } & {
  owner: User & { isFollowee: boolean };
};
