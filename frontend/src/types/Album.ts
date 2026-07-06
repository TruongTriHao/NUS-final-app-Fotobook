export type Album = {
  id: string;
  title: string;
  description: string;
  images: string[];
  createdAt: string;
  likeCount: number;
  mode: "public" | "private";
  user: string;
};
