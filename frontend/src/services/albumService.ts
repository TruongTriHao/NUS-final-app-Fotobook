import albums from "../mocks/albums.json";
import follows from "../mocks/follows.json";
import users from "../mocks/users.json";
import type { Album, AlbumWithUser } from "../types/Album";
import type { User } from "../types/User";

// Temporary mock service with 1 second delay to simulate API calls. TODO: replace with real API calls when backend is ready.
export const albumService = {
  getAllAlbums: async (page: number, limit: number): Promise<Album[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return (albums as Album[]).slice(startIndex, endIndex);
  },
  getAllCount: async (): Promise<number> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return (albums as Album[]).length;
  },
  getAlbumsForMain: async (
    type: "feeds" | "discover",
    userId: string,
  ): Promise<AlbumWithUser[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const followees = follows
      .filter((follow) => follow.followerId === userId)
      .map((follow) => follow.followeeId);
    const albumResult = albums.filter(
      (album) =>
        (type === "discover" || followees.includes(album.ownerId)) &&
        album.mode === "public",
    ) as Album[];

    albumResult.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const userIds = albumResult.map(
      (a) => (users as User[]).find((user) => user.id === a.ownerId) ?? null,
    );
    const result: AlbumWithUser[] = albumResult
      .map((album, index) => ({ ...album, owner: userIds[index] }))
      .filter((album) => album.owner !== null) as AlbumWithUser[];

    return result;
  },
  getAlbumsByUserId: async (
    userId: string,
    isCurrentUser: boolean,
  ): Promise<Album[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return albums
      .filter(
        (album) =>
          album.ownerId === userId &&
          (isCurrentUser || album.mode === "public"),
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ) as Album[];
  },
  getAlbumById: async (id: string): Promise<Album | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return (albums as Album[]).find((album) => album.id === id) || null;
  },
};
