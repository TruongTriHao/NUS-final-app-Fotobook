import type {
  AlbumWhereInput,
  PhotoWhereInput,
} from "../generated/prisma/models";
import { prisma } from "../lib/prisma";
import type { AlbumWithOwner } from "../validators/album.validator";
import type { PhotoWithOwner } from "../validators/photo.validator";

export class FeedRepository {
  async getPhotos(
    type: "feed" | "discover",
    take: number,
    cursor: string | null = null,
    search: string = "",
    userId?: string,
  ): Promise<{
    photos: PhotoWithOwner[];
    nextCursor: string | null;
  }> {
    if (type === "feed" && !userId) {
      return {
        photos: [],
        nextCursor: null,
      };
    }

    const whereCondition: PhotoWhereInput = {
      mode: "public",
      ...(type === "feed" && {
        owner: {
          followers: {
            some: {
              followerId: userId,
            },
          },
        },
      }),
      ...(search && {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),
    };

    const photos = await prisma.photo.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        mode: true,
        ownerId: true,
        createdAt: true,
        owner: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
            followers: {
              where: {
                followerId: userId,
              },
              select: {
                followerId: true,
              },
              take: 1,
            },
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
          where: userId ? { userId } : { userId: "guest-user" },
          take: 1,
        },
      },
      where: whereCondition,
      orderBy: [
        {
          createdAt: "desc",
        },
        { id: "desc" },
      ],
      take: take + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
    });
    let nextCursor: string | null = null;
    if (photos.length > take) {
      nextCursor = photos[take - 1].id;
      photos.pop();
    }
    return {
      photos: photos.map(({ _count, likes, owner, ...photo }) => ({
        ...photo,
        likeCount: _count.likes,
        isLiked: likes.length > 0,
        owner: {
          ...owner,
          isFollowee: owner.followers.length > 0,
        },
      })),
      nextCursor,
    };
  }

  async getAlbums(
    type: "feed" | "discover",
    take: number,
    cursor: string | null = null,
    search: string = "",
    userId?: string,
  ): Promise<{
    albums: AlbumWithOwner[];
    nextCursor: string | null;
  }> {
    if (type === "feed" && !userId) {
      return {
        albums: [],
        nextCursor: null,
      };
    }

    const whereCondition: AlbumWhereInput = {
      mode: "public",
      ...(type === "feed" && {
        owner: {
          followers: {
            some: {
              followerId: userId,
            },
          },
        },
      }),
      ...(search && {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),
    };

    const albums = await prisma.album.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        images: true,
        mode: true,
        ownerId: true,
        createdAt: true,
        owner: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
            followers: {
              where: {
                followerId: userId,
              },
              select: {
                followerId: true,
              },
              take: 1,
            },
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
          where: userId ? { userId } : { userId: "guest-user" },
          take: 1,
        },
      },
      where: whereCondition,
      orderBy: [
        {
          createdAt: "desc",
        },
        { id: "desc" },
      ],
      take: take + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
    });
    let nextCursor: string | null = null;
    if (albums.length > take) {
      nextCursor = albums[take - 1].id;
      albums.pop();
    }
    return {
      albums: albums.map(({ _count, likes, owner, ...album }) => ({
        ...album,
        likeCount: _count.likes,
        isLiked: likes.length > 0,
        owner: {
          ...owner,
          isFollowee: owner.followers.length > 0,
        },
      })),
      nextCursor,
    };
  }
}
