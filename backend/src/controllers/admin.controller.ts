import type { Request, Response } from "express";
import type { AlbumService } from "../services/album.service";
import type { PhotoService } from "../services/photo.service";
import type { UserService } from "../services/user.service";
import type {
  PaginationQuery,
  UpdateAdminUserBody,
} from "../validators/admin.validator";
import type { IdInput } from "../validators/user.validator";

export class AdminController {
  private userService: UserService;
  private photoService: PhotoService;
  private albumService: AlbumService;

  constructor(
    userService: UserService,
    photoService: PhotoService,
    albumService: AlbumService,
  ) {
    this.userService = userService;
    this.photoService = photoService;
    this.albumService = albumService;
  }

  async getUsers(req: Request, res: Response): Promise<void> {
    const { page, limit } = req.validatedQuery as PaginationQuery;
    const users = await this.userService.getAdminUsers(page, limit);
    res.status(200).json({
      status: "success",
      message: "Users retrieved successfully",
      data: users,
    });
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    const { id } = req.validatedParams as IdInput;
    const user = await this.userService.getAdminUserById(id);
    res.status(200).json({
      status: "success",
      message: "User retrieved successfully",
      data: { user },
    });
  }

  async getPhotos(req: Request, res: Response): Promise<void> {
    const { page, limit } = req.validatedQuery as PaginationQuery;
    const photos = await this.photoService.getAdminPhotos(page, limit);
    res.status(200).json({
      status: "success",
      message: "Photos retrieved successfully",
      data: photos,
    });
  }

  async getAlbums(req: Request, res: Response): Promise<void> {
    const { page, limit } = req.validatedQuery as PaginationQuery;
    const albums = await this.albumService.getAdminAlbums(page, limit);
    res.status(200).json({
      status: "success",
      message: "Albums retrieved successfully",
      data: albums,
    });
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const { id } = req.validatedParams as IdInput;
    const updateData = req.body as UpdateAdminUserBody;
    await this.userService.updateAdminUser(id, updateData);
    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: null,
    });
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    const { id } = req.validatedParams as IdInput;
    await this.userService.deleteUser(id);
    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
      data: null,
    });
  }
}
