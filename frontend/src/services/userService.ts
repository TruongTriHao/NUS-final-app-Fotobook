import albums from "../mocks/albums.json";
import follows from "../mocks/follows.json";
import photos from "../mocks/photos.json";
import users from "../mocks/users.json";
import type { ProfileData, User } from "../types/User";

// Temporary mock service with 1 second delay to simulate API calls. TODO: replace with real API calls when backend is ready.
export const userService = {
  getAllUsers: async (page: number, limit: number): Promise<User[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return (users as User[]).slice(startIndex, endIndex);
  },
  getAllCount: async (): Promise<number> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return (users as User[]).length;
  },
  getUserById: async (id: string): Promise<User | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return (users as User[]).find((user) => user.id === id) || null;
  },
  // Mock to use later in ProfilePage
  getProfileData: async (
    currentId: string,
    activeId: string,
  ): Promise<ProfileData | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const user = (users as User[]).find((user) => user.id === activeId);
    if (!user) {
      return null;
    }
    const isCurrentUser = currentId === activeId;
    const isFollowee = follows.some(
      (follow) =>
        follow.followerId === currentId && follow.followeeId === activeId,
    );
    const numPhotos = photos.filter(
      (photo) =>
        photo.ownerId === activeId &&
        (isCurrentUser || photo.mode === "public"),
    ).length;
    const numAlbums = albums.filter(
      (album) =>
        album.ownerId === activeId &&
        (isCurrentUser || album.mode === "public"),
    ).length;
    const numFollowers = follows.filter(
      (follow) => follow.followeeId === activeId,
    ).length;
    const numFollowees = follows.filter(
      (follow) => follow.followerId === activeId,
    ).length;
    return {
      ...user,
      isCurrentUser,
      isFollowee,
      numPhotos,
      numAlbums,
      numFollowers,
      numFollowees,
    };
  },
};
