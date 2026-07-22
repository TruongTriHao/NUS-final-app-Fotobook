import fs from "fs/promises";
import path from "path";
import { Prisma } from "../generated/prisma/client";
import type { UserRepository } from "../repositories/user.repository";
import { AppError } from "../utils/AppError";
import { hashPassword } from "../utils/password";
import {
  userProfileSchema,
  userResponseSchema,
  type UserProfile,
  type UserResponse,
  type UserUpdate,
  type UserUpdateAvatar,
} from "../validators/user.validator";

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
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
    });
  }

  async updateProfile(userId: string, data: UserUpdate): Promise<UserResponse> {
    const updatedData = { ...data };
    if (updatedData.password) {
      updatedData.password = await hashPassword(updatedData.password);
    }

    try {
      const updatedUser = await this.userRepository.update(userId, updatedData);
      return userResponseSchema.parse(updatedUser);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") throw new AppError("User not found", 404);
        if (error.code === "P2002")
          throw new AppError("Email already in use", 400);
      }
      throw error;
    }
  }

  async updateAvatar(
    userId: string,
    data: UserUpdateAvatar,
  ): Promise<UserResponse> {
    try {
      const currentUser = await this.userRepository.findById(userId);
      const oldAvatarUrl = currentUser?.avatarUrl;

      const updatedUser = await this.userRepository.update(userId, {
        avatarUrl: data.data,
      });

      if (oldAvatarUrl && oldAvatarUrl !== data.data) {
        const absolutePath = path.join(process.cwd(), oldAvatarUrl);
        fs.unlink(absolutePath).catch((err: unknown) => {
          const errorMessage = err instanceof Error ? err.message : String(err);
          console.error(
            `[error] failed to delete ${absolutePath}: ${errorMessage}`,
          );
        });
      }
      return userResponseSchema.parse(updatedUser);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") throw new AppError("User not found", 404);
      }
      throw error;
    }
  }

  async deleteAvatar(userId: string): Promise<UserResponse> {
    try {
      const currentUser = await this.userRepository.findById(userId);
      const oldAvatarUrl = currentUser?.avatarUrl;

      const updatedUser = await this.userRepository.update(userId, {
        avatarUrl: null,
      });

      if (oldAvatarUrl) {
        const absolutePath = path.join(process.cwd(), oldAvatarUrl);
        fs.unlink(absolutePath).catch((err: unknown) => {
          const errorMessage = err instanceof Error ? err.message : String(err);
          console.error(
            `[error] failed to delete ${absolutePath}: ${errorMessage}`,
          );
        });
      }
      return userResponseSchema.parse(updatedUser);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") throw new AppError("User not found", 404);
      }
      throw error;
    }
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
    });
  }
}
