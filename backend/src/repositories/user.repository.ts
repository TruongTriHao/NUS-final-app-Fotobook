import type { User } from "../generated/prisma/client";
import type {
  UserCreateInput,
  UserUpdateInput,
} from "../generated/prisma/models";
import { prisma } from "../lib/prisma";
import type { UserProfile } from "../validators/user.validator";

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
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
  ): Promise<Omit<UserProfile, "isCurrentUser"> | null> {
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

  async create(user: UserCreateInput): Promise<User> {
    return prisma.user.create({ data: user });
  }

  async update(id: string, user: UserUpdateInput): Promise<User> {
    return prisma.user.update({ where: { id }, data: user });
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({ where: { id } });
  }
}
