import type { Request, Response } from "express";
import type { UserService } from "../services/user.service";
import type {
  UserGetPublicProfile,
  UserUpdate,
  UserUpdateAvatar,
} from "../validators/user.validator";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
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

  async updateAvatar(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id ?? "";
    const updatedUser = await this.userService.updateAvatar(
      userId,
      req.body as UserUpdateAvatar,
    );

    res.status(200).json({
      status: "success",
      message: "User avatar updated successfully",
      data: { user: updatedUser },
    });
  }

  async deleteAvatar(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id ?? "";
    const updatedUser = await this.userService.deleteAvatar(userId);

    res.status(200).json({
      status: "success",
      message: "User avatar deleted successfully",
      data: { user: updatedUser },
    });
  }

  async getPublicProfile(req: Request, res: Response): Promise<void> {
    const { id: userId } = req.params as UserGetPublicProfile;
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
}
