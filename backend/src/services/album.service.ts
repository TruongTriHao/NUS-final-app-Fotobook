import type { Album } from "../generated/prisma/client";
import type { AlbumRepository } from "../repositories/album.repository";
import type { UserRepository } from "../repositories/user.repository";
import { AppError } from "../utils/AppError";
import {
  deleteFromCloudinary,
  getCloudinaryImageUrl,
} from "../utils/cloudinary";
import {
  type BaseAlbum,
  type CreateAlbumBody,
  type UpdateAlbumBody,
} from "../validators/album.validator";

export class AlbumService {
  private albumRepository: AlbumRepository;
  private userRepository: UserRepository;

  constructor(
    albumRepository: AlbumRepository,
    userRepository: UserRepository,
  ) {
    this.albumRepository = albumRepository;
    this.userRepository = userRepository;
  }

  async create(album: CreateAlbumBody, ownerId: string): Promise<void> {
    await this.albumRepository.create({
      ...album,
      owner: { connect: { id: ownerId } },
    });
  }

  async like(albumId: string, userId: string): Promise<boolean> {
    const isLiked = await this.albumRepository.isLiked(userId, albumId);
    if (isLiked) {
      throw new AppError("Album already liked", 400);
    }
    await this.albumRepository.createLike(userId, albumId);
    return true;
  }

  async getAdminAlbums(
    page: number,
    limit: number,
  ): Promise<{ albums: BaseAlbum[]; total: number }> {
    const albums = await this.albumRepository.getAdminAlbums(
      limit,
      (page - 1) * limit,
    );
    return {
      albums: albums.data.map((album) => ({
        ...album,
        images: album.images.map(getCloudinaryImageUrl),
      })),
      total: albums.total,
    };
  }

  async unlike(albumId: string, userId: string): Promise<boolean> {
    const isLiked = await this.albumRepository.isLiked(userId, albumId);
    if (!isLiked) {
      throw new AppError("Album not liked yet", 400);
    }
    await this.albumRepository.deleteLike(userId, albumId);
    return false;
  }

  async canView(albumId: string, userId: string): Promise<Album> {
    const album = await this.albumRepository.findById(albumId);
    const user = await this.userRepository.findById(userId);
    if (
      !album ||
      (album.mode === "private" &&
        user?.role !== "admin" &&
        album.ownerId !== userId)
    ) {
      throw new AppError("Album not found", 404);
    }
    return { ...album, images: album.images.map(getCloudinaryImageUrl) };
  }

  async canEdit(
    albumId: string,
    userId: string,
    updateData: UpdateAlbumBody,
  ): Promise<BaseAlbum> {
    const album = await this.albumRepository.findById(albumId);
    const user = await this.userRepository.findById(userId);
    if (!album || (user?.role !== "admin" && album.ownerId !== userId)) {
      throw new AppError("Album not found", 404);
    }
    const { existingImages = [], images = [], ...albumData } = updateData;
    const imagesToDelete = album.images.filter(
      (imageId) => !existingImages.includes(imageId),
    );
    const updatedAlbum = await this.albumRepository.update(albumId, {
      ...albumData,
      images: [...existingImages, ...images],
    });
    await Promise.all(imagesToDelete.map(deleteFromCloudinary));
    return {
      ...updatedAlbum,
      images: updatedAlbum.images.map(getCloudinaryImageUrl),
    };
  }

  async canDelete(albumId: string, userId: string): Promise<null> {
    const album = await this.albumRepository.findById(albumId);
    const user = await this.userRepository.findById(userId);
    if (!album || (user?.role !== "admin" && album.ownerId !== userId)) {
      throw new AppError("Album not found", 404);
    }
    await Promise.all(album.images.map(deleteFromCloudinary));
    await this.albumRepository.delete(albumId);
    return null;
  }
}
