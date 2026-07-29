import type { Request, Response } from "express";
import type { UserService } from "../services/user.service";
import type { IdInput, UserUpdate } from "../validators/user.validator";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async follow(req: Request, res: Response): Promise<void> {
    const currentUserId = req.user?.id ?? "";
    const { id: targetUserId } = req.params as IdInput;
    const result = await this.userService.follow(currentUserId, targetUserId);
    res.status(200).json({
      status: "success",
      message: "Followed user successfully",
      data: { follow: result },
    });
  }

  async getCurrentProfile(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id ?? "";
    const profile = await this.userService.getCurrentProfile(userId);

    res.status(200).json({
      status: "success",
      message: "Current profile retrieved successfully",
      data: { user: profile },
    });
  }

  async getPublicProfile(req: Request, res: Response): Promise<void> {
    const { id: userId } = req.validatedParams as IdInput;
    const currentUserId = req.user?.id ?? "";
    const profile = await this.userService.getPublicProfile(
      userId,
      currentUserId,
    );

    res.status(200).json({
      status: "success",
      message: "User public profile retrieved successfully",
      data: { user: profile },
    });
  }

  async getUserPhotos(req: Request, res: Response): Promise<void> {
    const { id: targetUserId } = req.validatedParams as IdInput;
    const currentUserId = req.user?.id ?? "";
    const photos = await this.userService.getUserPhotos(
      targetUserId,
      currentUserId,
    );
    res.status(200).json({
      status: "success",
      message: "User photos retrieved successfully",
      data: { photos },
    });
  }

  async getUserAlbums(req: Request, res: Response): Promise<void> {
    const { id: targetUserId } = req.validatedParams as IdInput;
    const currentUserId = req.user?.id ?? "";
    const albums = await this.userService.getUserAlbums(
      targetUserId,
      currentUserId,
    );
    res.status(200).json({
      status: "success",
      message: "User albums retrieved successfully",
      data: { albums },
    });
  }

  async getUserFollowers(req: Request, res: Response): Promise<void> {
    const { id: targetUserId } = req.validatedParams as IdInput;
    const currentUserId = req.user?.id ?? "";
    const followers = await this.userService.getUserFollowers(
      targetUserId,
      currentUserId,
    );
    res.status(200).json({
      status: "success",
      message: "User followers retrieved successfully",
      data: { followers },
    });
  }

  async getUserFollowees(req: Request, res: Response): Promise<void> {
    const { id: targetUserId } = req.validatedParams as IdInput;
    const currentUserId = req.user?.id ?? "";
    const followees = await this.userService.getUserFollowees(
      targetUserId,
      currentUserId,
    );
    res.status(200).json({
      status: "success",
      message: "User followees retrieved successfully",
      data: { followees },
    });
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id ?? "";
    const updatedUser = await this.userService.updateProfile(
      userId,
      req.body as UserUpdate,
    );

    res.status(200).json({
      status: "success",
      message: "User profile updated successfully",
      data: { user: updatedUser },
    });
  }

  async unfollow(req: Request, res: Response): Promise<void> {
    const currentUserId = req.user?.id ?? "";
    const { id: targetUserId } = req.params as IdInput;
    const result = await this.userService.unfollow(currentUserId, targetUserId);
    res.status(200).json({
      status: "success",
      message: "Unfollowed user successfully",
      data: { follow: result },
    });
  }
}
