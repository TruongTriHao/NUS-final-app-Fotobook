import follows from "../mocks/follows.json";
import photos from "../mocks/photos.json";
import users from "../mocks/users.json";
import type { Photo, PhotoWithUser } from "../types/Photo";
import type { User } from "../types/User";

// Temporary mock service with 1 second delay to simulate API calls. TODO: replace with real API calls when backend is ready.
export const photoService = {
  getAllPhotos: async (page: number, limit: number): Promise<Photo[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return (photos as Photo[]).slice(startIndex, endIndex);
  },
  getAllCount: async (): Promise<number> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return (photos as Photo[]).length;
  },
  getPhotosForMain: async (
    type: "feeds" | "discover",
    userId: string,
  ): Promise<PhotoWithUser[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const followees = follows
      .filter((follow) => follow.followerId === userId)
      .map((follow) => follow.followeeId);
    const photoResult = photos.filter(
      (photo) =>
        (type === "discover" || followees.includes(photo.ownerId)) &&
        photo.mode === "public",
    ) as Photo[];

    photoResult.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const userIds = photoResult.map(
      (p) => (users as User[]).find((user) => user.id === p.ownerId) ?? null,
    );
    const result: PhotoWithUser[] = photoResult
      .map((photo, index) => ({ ...photo, owner: userIds[index] }))
      .filter((photo) => photo.owner !== null) as PhotoWithUser[];

    return result;
  },
  getPhotosByUserId: async (
    userId: string,
    isCurrentUser: boolean,
  ): Promise<Photo[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return photos
      .filter(
        (photo) =>
          photo.ownerId === userId &&
          (isCurrentUser || photo.mode === "public"),
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ) as Photo[];
  },
  getPhotoById: async (id: string): Promise<Photo | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return (photos as Photo[]).find((photo) => photo.id === id) || null;
  },
};
