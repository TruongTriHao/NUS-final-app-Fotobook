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
