import type { FeedRepository } from "../repositories/feed.repository";
import { AppError } from "../utils/AppError";
import { getCloudinaryImageUrl } from "../utils/cloudinary";
import { type AlbumWithOwner } from "../validators/album.validator";
import { type PhotoWithOwner } from "../validators/photo.validator";

export class FeedService {
  private feedRepository: FeedRepository;

  constructor(feedRepository: FeedRepository) {
    this.feedRepository = feedRepository;
  }

  async getFeedPhotos(
    cursor: string | null,
    limit: number,
    currentUserId: string,
  ): Promise<{ photos: PhotoWithOwner[]; nextCursor: string | null }> {
    if (!currentUserId) {
      throw new AppError("User ID is required to fetch feed photos", 400);
    }
    const { photos, nextCursor } = await this.feedRepository.getPhotos(
      "feed",
      limit,
      cursor,
      currentUserId,
    );
    return {
      photos: photos.map((photo) => ({
        ...photo,
        imageUrl: getCloudinaryImageUrl(photo.imageUrl),
      })),
      nextCursor,
    };
  }

  async getFeedAlbums(
    cursor: string | null,
    limit: number,
    currentUserId: string,
  ): Promise<{ albums: AlbumWithOwner[]; nextCursor: string | null }> {
    if (!currentUserId) {
      throw new AppError("User ID is required to fetch feed albums", 400);
    }
    const { albums, nextCursor } = await this.feedRepository.getAlbums(
      "feed",
      limit,
      cursor,
      currentUserId,
    );
    return {
      albums: albums.map((album) => ({
        ...album,
        images: album.images.map(getCloudinaryImageUrl),
      })),
      nextCursor,
    };
  }

  async getDiscoverPhotos(
    cursor: string | null,
    limit: number,
    currentUserId: string,
  ): Promise<{ photos: PhotoWithOwner[]; nextCursor: string | null }> {
    const { photos, nextCursor } = await this.feedRepository.getPhotos(
      "discover",
      limit,
      cursor,
      currentUserId,
    );
    return {
      photos: photos.map((photo) => ({
        ...photo,
        imageUrl: getCloudinaryImageUrl(photo.imageUrl),
      })),
      nextCursor,
    };
  }

  async getDiscoverAlbums(
    cursor: string | null,
    limit: number,
    currentUserId: string,
  ): Promise<{ albums: AlbumWithOwner[]; nextCursor: string | null }> {
    const { albums, nextCursor } = await this.feedRepository.getAlbums(
      "discover",
      limit,
      cursor,
      currentUserId,
    );
    return {
      albums: albums.map((album) => ({
        ...album,
        images: album.images.map(getCloudinaryImageUrl),
      })),
      nextCursor,
    };
  }
}
