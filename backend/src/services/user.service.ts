import type { UserUpdateInput } from "../generated/prisma/models";
import type { AlbumRepository } from "../repositories/album.repository";
import type { PhotoRepository } from "../repositories/photo.repository";
import type { UserRepository } from "../repositories/user.repository";
import { AppError } from "../utils/AppError";
import {
  deleteFromCloudinary,
  getCloudinaryImageUrl,
} from "../utils/cloudinary";
import { comparePassword, hashPassword } from "../utils/password";
import { type UpdateAdminUserBody } from "../validators/admin.validator";
import type { BaseAlbum } from "../validators/album.validator";
import type { BasePhoto } from "../validators/photo.validator";
import {
  adminUserDataSchema,
  userProfileSchema,
  userResponseSchema,
  type AdminUserData,
  type UserProfile,
  type UserResponse,
  type UserUpdate,
} from "../validators/user.validator";

export class UserService {
  private userRepository: UserRepository;
  private photoRepository: PhotoRepository;
  private albumRepository: AlbumRepository;

  constructor(
    userRepository: UserRepository,
    photoRepository: PhotoRepository,
    albumRepository: AlbumRepository,
  ) {
    this.userRepository = userRepository;
    this.photoRepository = photoRepository;
    this.albumRepository = albumRepository;
  }

  async follow(currentUserId: string, targetUserId: string): Promise<boolean> {
    if (currentUserId === targetUserId) {
      throw new AppError("You cannot follow yourself", 400);
    }
    const existingFollow = await this.userRepository.findFollow(
      currentUserId,
      targetUserId,
    );
    if (existingFollow) {
      throw new AppError("You are already following this user", 400);
    }
    await this.userRepository.createFollow(currentUserId, targetUserId);
    return true;
  }

  async getCurrentProfile(userId: string): Promise<UserProfile> {
    const profile = await this.userRepository.findMyProfile(userId);

    if (!profile) {
      throw new AppError("User not found", 404);
    }

    return userProfileSchema.parse({
      ...profile,
      isCurrentUser: true,
      isFollowee: false,
      avatarUrl: getCloudinaryImageUrl(profile.avatarUrl),
    });
  }

  async getPublicProfile(
    userId: string,
    currentUserId: string,
  ): Promise<UserProfile> {
    const profile = await this.userRepository.findPublicProfile(
      userId,
      currentUserId,
    );

    if (!profile) {
      throw new AppError("User not found", 404);
    }

    return userProfileSchema.parse({
      ...profile,
      isCurrentUser: userId === currentUserId,
      avatarUrl: getCloudinaryImageUrl(profile.avatarUrl),
    });
  }

  async getUserPhotos(
    targetUserId: string,
    currentUserId: string,
  ): Promise<BasePhoto[]> {
    const isCurrentUser = targetUserId === currentUserId;
    const photos = await this.photoRepository.findByOwnerId(
      targetUserId,
      isCurrentUser,
    );
    return photos.map((photo) => ({
      ...photo,
      imageUrl: getCloudinaryImageUrl(photo.imageUrl),
    }));
  }

  async getUserAlbums(
    targetUserId: string,
    currentUserId: string,
  ): Promise<BaseAlbum[]> {
    const isCurrentUser = targetUserId === currentUserId;
    const albums = await this.albumRepository.findByOwnerId(
      targetUserId,
      isCurrentUser,
    );
    return albums.map((album) => ({
      ...album,
      images: album.images.map(getCloudinaryImageUrl),
    }));
  }

  async getUserFollowers(
    targetUserId: string,
    currentUserId: string,
  ): Promise<UserProfile[]> {
    const followers = await this.userRepository.getFollowers(
      targetUserId,
      currentUserId,
    );
    return followers.map((follower) => ({
      ...follower,
      avatarUrl: getCloudinaryImageUrl(follower.avatarUrl),
    }));
  }

  async getUserFollowees(
    targetUserId: string,
    currentUserId: string,
  ): Promise<UserProfile[]> {
    const followees = await this.userRepository.getFollowees(
      targetUserId,
      currentUserId,
    );
    return followees.map((followee) => ({
      ...followee,
      avatarUrl: getCloudinaryImageUrl(followee.avatarUrl),
    }));
  }

  async getAdminUsers(
    page: number,
    limit: number,
  ): Promise<{ users: AdminUserData[]; total: number }> {
    const users = await this.userRepository.getUsers(limit, (page - 1) * limit);
    return {
      users: users.data.map((user) =>
        adminUserDataSchema.parse({
          ...user,
          avatarUrl: getCloudinaryImageUrl(user.avatarUrl),
        }),
      ),
      total: users.total,
    };
  }

  async getAdminUserById(userId: string): Promise<AdminUserData> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return adminUserDataSchema.parse({
      ...user,
      avatarUrl: getCloudinaryImageUrl(user.avatarUrl),
    });
  }

  async updateProfile(userId: string, data: UserUpdate): Promise<UserResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    if (data.email && data.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new AppError("Email is already in use", 400);
      }
    }
    const {
      imageUrl,
      deleteAvatar,
      currentPassword,
      newPassword,
      passwordConfirmation,
      ...restData
    } = data;
    const updateData: UserUpdateInput = { ...restData };
    if (currentPassword) {
      const isMatch = await comparePassword(currentPassword, user.password);
      if (!isMatch) {
        throw new AppError("Current password is incorrect", 400);
      }
      if (newPassword) {
        if (newPassword !== passwordConfirmation) {
          throw new AppError("New password and confirmation do not match", 400);
        }
        updateData.password = await hashPassword(newPassword);
      }
    }
    const publicId = user.avatarUrl;
    if (deleteAvatar) {
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
    }
    const updatedUser = await this.userRepository.update(userId, {
      ...updateData,
      avatarUrl: imageUrl ?? (deleteAvatar ? null : publicId),
    });
    return userResponseSchema.parse({
      ...updatedUser,
      avatarUrl: getCloudinaryImageUrl(updatedUser.avatarUrl),
    });
  }

  async updateAdminUser(
    userId: string,
    updateData: UpdateAdminUserBody,
  ): Promise<null> {
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }
    const currentUser = await this.userRepository.findById(userId);
    if (!currentUser) {
      throw new AppError("User not found", 404);
    }
    if (updateData.email && updateData.email !== currentUser.email) {
      const existingUser = await this.userRepository.findByEmail(
        updateData.email,
      );
      if (existingUser) {
        throw new AppError("Email is already in use", 400);
      }
    }
    const publicId = currentUser.avatarUrl;
    const { imageUrl, deleteAvatar, ...data } = updateData;
    if (deleteAvatar) {
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
    }
    await this.userRepository.update(userId, {
      ...data,
      avatarUrl: imageUrl ?? (deleteAvatar ? null : publicId),
    });
    return null;
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const resourcesToDelete = [];
    if (user.avatarUrl) {
      resourcesToDelete.push(user.avatarUrl);
    }
    const photos = await this.photoRepository.findByOwnerId(userId, true);
    for (const photo of photos) {
      resourcesToDelete.push(photo.imageUrl);
    }
    const albums = await this.albumRepository.findByOwnerId(userId, true);
    for (const album of albums) {
      for (const image of album.images) {
        resourcesToDelete.push(image);
      }
    }
    await Promise.all(resourcesToDelete.map(deleteFromCloudinary));
    await this.userRepository.delete(userId);
  }

  async unfollow(
    currentUserId: string,
    targetUserId: string,
  ): Promise<boolean> {
    if (currentUserId === targetUserId) {
      throw new AppError("You cannot unfollow yourself", 400);
    }
    const existingFollow = await this.userRepository.findFollow(
      currentUserId,
      targetUserId,
    );
    if (!existingFollow) {
      throw new AppError("You are not following this user", 400);
    }
    await this.userRepository.deleteFollow(currentUserId, targetUserId);
    return false;
  }
}
