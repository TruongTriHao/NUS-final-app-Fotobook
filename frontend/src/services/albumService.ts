import albums from "../mocks/albums.json";
import type { Album } from "../types/Album";
import { followService } from "./followService";

export const albumService = {
  getAlbums: async (
    type: "feeds" | "discover",
    userId: string,
  ): Promise<Album[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const followees = await followService.getFollowees(userId);
    let result = albums;

    if (type === "feeds") {
      result = albums.filter(
        (album) => followees.includes(album.user) && album.mode === "public",
      );
    }
    if (type === "discover") {
      result = albums.filter((album) => album.mode === "public");
    }

    result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return result as Album[];
  },
  getPublicCountByUserId: async (id: string): Promise<number> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return albums.filter(
      (album) => album.user === id && album.mode === "public",
    ).length;
  },
  getPublicAlbumsByUserId: async (userId: string): Promise<Album[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return albums
      .filter((album) => album.user === userId && album.mode === "public")
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ) as Album[];
  },
  getAllAlbumsByUserId: async (userId: string): Promise<Album[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return albums
      .filter((album) => album.user === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ) as Album[];
  },
  getAllCountByUserId: async (id: string): Promise<number> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return albums.filter((album) => album.user === id).length;
  },
  getAlbumById: async (id: string): Promise<Album | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return (albums as Album[]).find((album) => album.id === id) || null;
  },
};
