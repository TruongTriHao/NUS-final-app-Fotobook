import type { Request, Response } from "express";
import type { PhotoService } from "../services/photo.service";
import { getAuthenticatedUser } from "../utils/getAuthenticatedUser";
import type {
  CreatePhotoBody,
  UpdatePhotoBody,
} from "../validators/photo.validator";
import type { IdInput } from "../validators/user.validator";

export class PhotoController {
  private photoService: PhotoService;

  constructor(photoService: PhotoService) {
    this.photoService = photoService;
  }

  async create(req: Request, res: Response): Promise<void> {
    const ownerId = getAuthenticatedUser(req).id;
    await this.photoService.create(req.body as CreatePhotoBody, ownerId);
    res.status(201).json({
      status: "success",
      message: "Photo created successfully",
      data: null,
    });
  }

  async like(req: Request, res: Response): Promise<void> {
    const { id: photoId } = req.validatedParams as IdInput;
    const userId = getAuthenticatedUser(req).id;
    const result = await this.photoService.like(photoId, userId);
    res.status(200).json({
      status: "success",
      message: "Photo liked successfully",
      data: { like: result },
    });
  }

  async get(req: Request, res: Response): Promise<void> {
    const { id: photoId } = req.validatedParams as IdInput;
    const userId = req.user?.id ?? "";
    const photo = await this.photoService.canView(photoId, userId);
    res.status(200).json({
      status: "success",
      message: "Photo retrieved successfully",
      data: { content: photo },
    });
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id: photoId } = req.validatedParams as IdInput;
    const userId = getAuthenticatedUser(req).id;
    const updateData = req.body as UpdatePhotoBody;
    const photo = await this.photoService.canEdit(photoId, userId, updateData);
    res.status(200).json({
      status: "success",
      message: "Photo updated successfully",
      data: { content: photo },
    });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id: photoId } = req.validatedParams as IdInput;
    const userId = getAuthenticatedUser(req).id;
    await this.photoService.canDelete(photoId, userId);
    res.status(200).json({
      status: "success",
      message: "Photo deleted successfully",
      data: null,
    });
  }

  async unlike(req: Request, res: Response): Promise<void> {
    const { id: photoId } = req.validatedParams as IdInput;
    const userId = getAuthenticatedUser(req).id;
    const result = await this.photoService.unlike(photoId, userId);
    res.status(200).json({
      status: "success",
      message: "Photo unliked successfully",
      data: { like: result },
    });
  }
}
