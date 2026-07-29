import type { Photo, PhotoLike } from "../generated/prisma/client";
import type {
  PhotoCreateInput,
  PhotoUpdateInput,
} from "../generated/prisma/models";
import { prisma } from "../lib/prisma";

export class PhotoRepository {
  async create(photo: PhotoCreateInput): Promise<Photo> {
    return prisma.photo.create({ data: photo });
  }

  async createLike(userId: string, photoId: string): Promise<PhotoLike> {
    return prisma.photoLike.create({
      data: {
        userId,
        photoId,
      },
    });
  }

  async findById(id: string): Promise<Photo | null> {
    return prisma.photo.findUnique({ where: { id } });
  }

  async findByOwnerId(
    ownerId: string,
    isCurrentUser: boolean,
  ): Promise<Photo[]> {
    return prisma.photo.findMany({
      where: {
        ownerId,
        mode: isCurrentUser ? undefined : "public",
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getAdminPhotos(
    take: number,
    skip: number,
  ): Promise<{ data: Photo[]; total: number }> {
    const [data, total] = await Promise.all([
      prisma.photo.findMany({
        take,
        skip,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.photo.count(),
    ]);
    return { data, total };
  }

  async isLiked(userId: string, photoId: string): Promise<boolean> {
    const like = await prisma.photoLike.findUnique({
      where: {
        userId_photoId: { userId, photoId },
      },
    });
    return !!like;
  }

  async update(id: string, photo: PhotoUpdateInput): Promise<Photo> {
    return prisma.photo.update({ where: { id }, data: photo });
  }

  async delete(id: string): Promise<Photo> {
    return prisma.photo.delete({ where: { id } });
  }

  async deleteLike(userId: string, photoId: string): Promise<PhotoLike> {
    return prisma.photoLike.delete({
      where: {
        userId_photoId: { userId, photoId },
      },
    });
  }
}
