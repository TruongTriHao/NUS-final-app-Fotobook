import type { Request, Response } from "express";
import type { AlbumService } from "../services/album.service";
import { getAuthenticatedUser } from "../utils/getAuthenticatedUser";
import type {
  CreateAlbumBody,
  UpdateAlbumBody,
} from "../validators/album.validator";
import type { IdInput } from "../validators/user.validator";

export class AlbumController {
  private albumService: AlbumService;

  constructor(albumService: AlbumService) {
    this.albumService = albumService;
  }

  async create(req: Request, res: Response): Promise<void> {
    const ownerId = getAuthenticatedUser(req).id;
    await this.albumService.create(req.body as CreateAlbumBody, ownerId);
    res.status(201).json({
      status: "success",
      message: "Album created successfully",
      data: null,
    });
  }

  async like(req: Request, res: Response): Promise<void> {
    const { id: albumId } = req.validatedParams as IdInput;
    const userId = getAuthenticatedUser(req).id;
    const result = await this.albumService.like(albumId, userId);
    res.status(200).json({
      status: "success",
      message: "Album liked successfully",
      data: { like: result },
    });
  }

  async get(req: Request, res: Response): Promise<void> {
    const { id: albumId } = req.validatedParams as IdInput;
    const userId = req.user?.id ?? "";
    const album = await this.albumService.canView(albumId, userId);
    res.status(200).json({
      status: "success",
      message: "Album retrieved successfully",
      data: { content: album },
    });
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id: albumId } = req.validatedParams as IdInput;
    const userId = getAuthenticatedUser(req).id;
    const updateData = req.body as UpdateAlbumBody;
    const album = await this.albumService.canEdit(albumId, userId, updateData);
    res.status(200).json({
      status: "success",
      message: "Album updated successfully",
      data: { content: album },
    });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id: albumId } = req.validatedParams as IdInput;
    const userId = getAuthenticatedUser(req).id;
    await this.albumService.canDelete(albumId, userId);
    res.status(200).json({
      status: "success",
      message: "Album deleted successfully",
      data: null,
    });
  }

  async unlike(req: Request, res: Response): Promise<void> {
    const { id: albumId } = req.validatedParams as IdInput;
    const userId = getAuthenticatedUser(req).id;
    const result = await this.albumService.unlike(albumId, userId);
    res.status(200).json({
      status: "success",
      message: "Album unliked successfully",
      data: { like: result },
    });
  }
}
