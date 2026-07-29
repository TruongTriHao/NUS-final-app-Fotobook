import type { Request, Response } from "express";
import { FeedService } from "../services/feed.service";
import type { InfiniteLoadQuery } from "../validators/feed.validator";

export class FeedController {
  private feedService: FeedService;

  constructor(feedService: FeedService) {
    this.feedService = feedService;
  }

  async getFeedPhotos(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id ?? "";
    const { cursor, limit } = req.validatedQuery as InfiniteLoadQuery;
    const feedPhotos = await this.feedService.getFeedPhotos(
      cursor,
      limit,
      userId,
    );
    res.status(200).json({
      status: "success",
      message: "Feed photos retrieved successfully",
      data: feedPhotos,
    });
  }

  async getFeedAlbums(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id ?? "";
    const { cursor, limit } = req.validatedQuery as InfiniteLoadQuery;
    const feedAlbums = await this.feedService.getFeedAlbums(
      cursor,
      limit,
      userId,
    );
    res.status(200).json({
      status: "success",
      message: "Feed albums retrieved successfully",
      data: feedAlbums,
    });
  }

  async getDiscoverPhotos(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id ?? "";
    const { cursor, limit } = req.validatedQuery as InfiniteLoadQuery;
    const discoverPhotos = await this.feedService.getDiscoverPhotos(
      cursor,
      limit,
      userId,
    );
    res.status(200).json({
      status: "success",
      message: "Discover photos retrieved successfully",
      data: discoverPhotos,
    });
  }

  async getDiscoverAlbums(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id ?? "";
    const { cursor, limit } = req.validatedQuery as InfiniteLoadQuery;
    const discoverAlbums = await this.feedService.getDiscoverAlbums(
      cursor,
      limit,
      userId,
    );
    res.status(200).json({
      status: "success",
      message: "Discover albums retrieved successfully",
      data: discoverAlbums,
    });
  }
}
