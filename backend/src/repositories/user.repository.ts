import type { Follow, User } from "../generated/prisma/client";
import type {
  UserCreateInput,
  UserUpdateInput,
} from "../generated/prisma/models";
import { prisma } from "../lib/prisma";
import type {
  AdminUserData,
  UserProfile,
  UserPublicProfile,
} from "../validators/user.validator";

export class UserRepository {
  async create(user: UserCreateInput): Promise<User> {
    return prisma.user.create({ data: user });
  }

  async createFollow(
    currentUserId: string,
    targetUserId: string,
  ): Promise<Follow> {
    return prisma.follow.create({
      data: {
        followerId: currentUserId,
        followeeId: targetUserId,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findFollow(
    currentUserId: string,
    targetUserId: string,
  ): Promise<Follow | null> {
    return prisma.follow.findUnique({
      where: {
        followerId_followeeId: {
          followerId: currentUserId,
          followeeId: targetUserId,
        },
      },
    });
  }

  async getUsers(
    take: number,
    skip: number,
  ): Promise<{ data: AdminUserData[]; total: number }> {
    const [data, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          isActive: true,
          lastLogin: true,
          avatarUrl: true,
        },
        take,
        skip,
        orderBy: {
          firstName: "asc",
        },
      }),
      prisma.user.count(),
    ]);
    return { data, total };
  }

  async findMyProfile(
    id: string,
  ): Promise<Omit<UserProfile, "isCurrentUser" | "isFollowee"> | null> {
    const profile = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        avatarUrl: true,
        _count: {
          select: {
            photos: true,
            albums: true,
            followers: true,
            followees: true,
          },
        },
      },
    });

    if (!profile) {
      return null;
    }

    const { _count, ...userData } = profile;
    return {
      ...userData,
      numPhotos: _count.photos,
      numAlbums: _count.albums,
      numFollowers: _count.followers,
      numFollowees: _count.followees,
    };
  }

  async findPublicProfile(
    id: string,
    currentUserId: string,
  ): Promise<Omit<UserPublicProfile, "isCurrentUser"> | null> {
    const profile = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        avatarUrl: true,
        _count: {
          select: {
            photos: { where: { mode: "public" } },
            albums: { where: { mode: "public" } },
            followers: true,
            followees: true,
          },
        },
        followers: {
          where: {
            followerId: currentUserId,
          },
          select: {
            followerId: true,
          },
          take: 1,
        },
      },
    });

    if (!profile) {
      return null;
    }

    const { _count, followers, ...userData } = profile;
    return {
      ...userData,
      isFollowee: followers.length > 0,
      numPhotos: _count.photos,
      numAlbums: _count.albums,
      numFollowers: _count.followers,
      numFollowees: _count.followees,
    };
  }

  async getFollowers(
    targetUserId: string,
    currentUserId: string,
  ): Promise<UserPublicProfile[]> {
    const followers = await prisma.user.findMany({
      where: {
        followees: {
          some: {
            followeeId: targetUserId,
          },
        },
      },
      orderBy: [
        {
          firstName: "asc",
        },
        {
          lastName: "asc",
        },
      ],
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        avatarUrl: true,
        _count: {
          select: {
            photos: { where: { mode: "public" } },
            albums: { where: { mode: "public" } },
            followers: true,
            followees: true,
          },
        },
        followers: {
          where: {
            followerId: currentUserId,
          },
          take: 1,
        },
      },
    });
    return followers.map(({ _count, followers, ...follower }) => ({
      ...follower,
      numPhotos: _count.photos,
      numAlbums: _count.albums,
      numFollowers: _count.followers,
      numFollowees: _count.followees,
      isFollowee: followers.length > 0,
      isCurrentUser: follower.id === currentUserId,
    }));
  }

  async getFollowees(
    targetUserId: string,
    currentUserId: string,
  ): Promise<UserPublicProfile[]> {
    const followees = await prisma.user.findMany({
      where: {
        followers: {
          some: {
            followerId: targetUserId,
          },
        },
      },
      orderBy: [
        {
          firstName: "asc",
        },
        {
          lastName: "asc",
        },
      ],
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        avatarUrl: true,
        _count: {
          select: {
            photos: { where: { mode: "public" } },
            albums: { where: { mode: "public" } },
            followers: true,
            followees: true,
          },
        },
        followers: {
          where: {
            followerId: currentUserId,
          },
          take: 1,
        },
      },
    });
    return followees.map(({ _count, followers, ...followee }) => ({
      ...followee,
      numPhotos: _count.photos,
      numAlbums: _count.albums,
      numFollowers: _count.followers,
      numFollowees: _count.followees,
      isFollowee: followers.length > 0,
      isCurrentUser: followee.id === currentUserId,
    }));
  }

  async update(id: string, user: UserUpdateInput): Promise<User> {
    return prisma.user.update({ where: { id }, data: user });
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({ where: { id } });
  }

  async deleteFollow(
    currentUserId: string,
    targetUserId: string,
  ): Promise<Follow> {
    return prisma.follow.delete({
      where: {
        followerId_followeeId: {
          followerId: currentUserId,
          followeeId: targetUserId,
        },
      },
    });
  }
}
