import follows from "../mocks/follows.json";
import type { ProfileData } from "../types/User";
import { userService } from "./userService";

// Temporary mock service with 1 second delay to simulate API calls. TODO: replace with real API calls when backend is ready.
export const followService = {
  getFollowersProfileData: async (id: string): Promise<ProfileData[]> => {
    const followerIds = follows
      .filter((follow) => follow.followeeId === id)
      .map((follow) => follow.followerId);
    const profile = await Promise.all(
      followerIds.map((followerId) =>
        userService.getProfileData(id, followerId),
      ),
    );
    return profile
      .filter((profileData) => profileData !== null)
      .sort((a, b) => a.firstName.localeCompare(b.firstName));
  },
  getFolloweesProfileData: async (id: string): Promise<ProfileData[]> => {
    const followeeIds = follows
      .filter((follow) => follow.followerId === id)
      .map((follow) => follow.followeeId);
    const profile = await Promise.all(
      followeeIds.map((followeeId) =>
        userService.getProfileData(id, followeeId),
      ),
    );
    return profile
      .filter((profileData) => profileData !== null)
      .sort((a, b) => a.firstName.localeCompare(b.firstName));
  },
};
