import photos from "../mocks/photos.json";
import type { Photo } from "../types/Photo";
import { followService } from "./followService";

export const photoService = {
  getPhotos: async (
    type: "feeds" | "discover",
    userId: string,
  ): Promise<Photo[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const followees = await followService.getFollowees(userId);
    let result = photos;

    if (type === "feeds") {
      result = photos.filter(
        (photo) => followees.includes(photo.user) && photo.mode === "public",
      );
    }
    if (type === "discover") {
      result = photos.filter((photo) => photo.mode === "public");
    }

    result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return result as Photo[];
  },
  getPublicCountByUserId: async (id: string): Promise<number> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return photos.filter(
      (photo) => photo.user === id && photo.mode === "public",
    ).length;
  },
  getPublicPhotosByUserId: async (userId: string): Promise<Photo[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return photos
      .filter((photo) => photo.user === userId && photo.mode === "public")
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ) as Photo[];
  },
  getAllPhotosByUserId: async (userId: string): Promise<Photo[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return photos
      .filter((photo) => photo.user === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ) as Photo[];
  },
  getAllCountByUserId: async (id: string): Promise<number> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return photos.filter((photo) => photo.user === id).length;
  },
  getPhotoById: async (id: string): Promise<Photo | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return (photos as Photo[]).find((photo) => photo.id === id) || null;
  },
};
