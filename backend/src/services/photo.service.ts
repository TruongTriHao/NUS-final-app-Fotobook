import type { Photo } from "../generated/prisma/client";
import type { PhotoRepository } from "../repositories/photo.repository";
import type { UserRepository } from "../repositories/user.repository";
import { AppError } from "../utils/AppError";
import {
  deleteFromCloudinary,
  getCloudinaryImageUrl,
} from "../utils/cloudinary";
import {
  type BasePhoto,
  type CreatePhotoBody,
  type UpdatePhotoBody,
} from "../validators/photo.validator";

export class PhotoService {
  private photoRepository: PhotoRepository;
  private userRepository: UserRepository;

  constructor(
    photoRepository: PhotoRepository,
    userRepository: UserRepository,
  ) {
    this.photoRepository = photoRepository;
    this.userRepository = userRepository;
  }

  async create(photo: CreatePhotoBody, ownerId: string): Promise<void> {
    await this.photoRepository.create({
      ...photo,
      owner: { connect: { id: ownerId } },
    });
  }

  async like(photoId: string, userId: string): Promise<boolean> {
    const isLiked = await this.photoRepository.isLiked(userId, photoId);
    if (isLiked) {
      throw new AppError("Photo already liked", 400);
    }
    await this.photoRepository.createLike(userId, photoId);
    return true;
  }

  async unlike(photoId: string, userId: string): Promise<boolean> {
    const isLiked = await this.photoRepository.isLiked(userId, photoId);
    if (!isLiked) {
      throw new AppError("Photo not liked yet", 400);
    }
    await this.photoRepository.deleteLike(userId, photoId);
    return false;
  }

  async getAdminPhotos(
    page: number,
    limit: number,
  ): Promise<{ photos: BasePhoto[]; total: number }> {
    const photos = await this.photoRepository.getAdminPhotos(
      limit,
      (page - 1) * limit,
    );
    return {
      photos: photos.data.map((photo) => ({
        ...photo,
        imageUrl: getCloudinaryImageUrl(photo.imageUrl),
      })),
      total: photos.total,
    };
  }

  async canView(photoId: string, userId: string): Promise<Photo> {
    const photo = await this.photoRepository.findById(photoId);
    const user = await this.userRepository.findById(userId);
    if (
      !photo ||
      (photo.mode === "private" &&
        user?.role !== "admin" &&
        photo.ownerId !== userId)
    ) {
      throw new AppError("Photo not found", 404);
    }
    return { ...photo, imageUrl: getCloudinaryImageUrl(photo.imageUrl) };
  }

  async canEdit(
    photoId: string,
    userId: string,
    updateData: UpdatePhotoBody,
  ): Promise<BasePhoto> {
    const photo = await this.photoRepository.findById(photoId);
    const user = await this.userRepository.findById(userId);
    if (!photo || (user?.role !== "admin" && photo.ownerId !== userId)) {
      throw new AppError("Photo not found", 404);
    }
    if (updateData.imageUrl && updateData.imageUrl !== photo.imageUrl) {
      await deleteFromCloudinary(photo.imageUrl);
    }
    const updatedPhoto = await this.photoRepository.update(photoId, updateData);
    return {
      ...updatedPhoto,
      imageUrl: getCloudinaryImageUrl(updatedPhoto.imageUrl),
    };
  }

  async canDelete(photoId: string, userId: string): Promise<null> {
    const photo = await this.photoRepository.findById(photoId);
    const user = await this.userRepository.findById(userId);
    if (!photo || (user?.role !== "admin" && photo.ownerId !== userId)) {
      throw new AppError("Photo not found", 404);
    }
    await deleteFromCloudinary(photo.imageUrl);
    await this.photoRepository.delete(photoId);
    return null;
  }
}
