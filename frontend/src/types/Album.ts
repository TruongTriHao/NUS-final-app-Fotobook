import type { User } from "./User";

export type Album = {
  id: string;
  title: string;
  description: string;
  images: string[];
  createdAt: string;
  likeCount: number;
  mode: "public" | "private";
  ownerId: string;
};

export type AlbumWithOwner = Album & {
  isLiked: boolean;
  isFollowee: boolean;
} & { owner: User & { isFollowee: boolean } };
