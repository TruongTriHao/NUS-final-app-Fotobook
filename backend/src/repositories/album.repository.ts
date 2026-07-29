import type { Album, AlbumLike } from "../generated/prisma/client";
import type {
  AlbumCreateInput,
  AlbumUpdateInput,
} from "../generated/prisma/models";
import { prisma } from "../lib/prisma";

export class AlbumRepository {
  async create(album: AlbumCreateInput): Promise<Album> {
    return prisma.album.create({ data: album });
  }

  async createLike(userId: string, albumId: string): Promise<AlbumLike> {
    return prisma.albumLike.create({
      data: {
        userId,
        albumId,
      },
    });
  }

  async findById(id: string): Promise<Album | null> {
    return prisma.album.findUnique({ where: { id } });
  }

  async findByOwnerId(
    ownerId: string,
    isCurrentUser: boolean,
  ): Promise<Album[]> {
    return prisma.album.findMany({
      where: {
        ownerId,
        mode: isCurrentUser ? undefined : "public",
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getAdminAlbums(
    take: number,
    skip: number,
  ): Promise<{ data: Album[]; total: number }> {
    const [data, total] = await Promise.all([
      prisma.album.findMany({
        take,
        skip,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.album.count(),
    ]);
    return { data, total };
  }

  async isLiked(userId: string, albumId: string): Promise<boolean> {
    const like = await prisma.albumLike.findUnique({
      where: {
        userId_albumId: {
          userId,
          albumId,
        },
      },
    });
    return !!like;
  }

  async update(id: string, album: AlbumUpdateInput): Promise<Album> {
    return prisma.album.update({ where: { id }, data: album });
  }

  async delete(id: string): Promise<Album> {
    return prisma.album.delete({ where: { id } });
  }

  async deleteLike(userId: string, albumId: string): Promise<AlbumLike> {
    return prisma.albumLike.delete({
      where: {
        userId_albumId: {
          userId,
          albumId,
        },
      },
    });
  }
}
