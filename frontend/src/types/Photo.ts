import type { User } from "./User";

export type Photo = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  likeCount: number;
  mode: "public" | "private";
  ownerId: string;
};

export type PhotoWithUser = Photo & { owner: User };
