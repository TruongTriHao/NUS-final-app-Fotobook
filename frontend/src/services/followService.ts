import follows from "../mocks/follows.json";

export const followService = {
  getFollowers: async (id: string): Promise<string[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return follows
      .filter((follow) => follow.followeeId === id)
      .map((follow) => follow.followerId);
  },
  getFollowees: async (id: string): Promise<string[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return follows
      .filter((follow) => follow.followerId === id)
      .map((follow) => follow.followeeId);
  },
  getFollowersCount: async (id: string): Promise<number> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return follows.filter((follow) => follow.followeeId === id).length;
  },
  getFolloweeCount: async (id: string): Promise<number> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return follows.filter((follow) => follow.followerId === id).length;
  },
  isFollow: async (
    followerId: string,
    followeeId: string,
  ): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return follows.some(
      (follow) =>
        follow.followerId === followerId && follow.followeeId === followeeId,
    );
  },
};
