import { createId } from "@paralleldrive/cuid2";
import type { UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";
import { cloudinary } from "../config/cloudinary";
import { AppError } from "./AppError";

export function uploadToCloudinary(
  file: Express.Multer.File,
  folder: string,
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: createId(),
        resource_type: "image",
        type: "authenticated",
      },
      (error, result) => {
        if (error) {
          reject(
            new AppError(error.message || "Upload to Cloudinary failed.", 500),
          );
          return;
        }
        resolve(result as UploadApiResponse);
      },
    );
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<unknown> {
  if (!publicId) {
    return null;
  }
  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      type: "authenticated",
    });
  } catch (error) {
    console.error(
      `[Cloudinary Error] Failed to delete image with publicId ${publicId} from Cloudinary:`,
      error,
    );
    return null;
  }
}

export function getCloudinaryImageUrl(
  publicId: string | null | undefined,
  expiresInSeconds: number = 3600,
): string {
  if (!publicId) {
    return "";
  }

  // For development purposes, if the publicId is a full URL, return it directly without signing. As the seed data uses publicly accessible images.
  if (
    process.env.NODE_ENV !== "production" &&
    (publicId.startsWith("http://") || publicId.startsWith("https://"))
  ) {
    return publicId;
  }
  const expirationTime = Math.floor(Date.now() / 1000) + expiresInSeconds;
  try {
    return cloudinary.url(publicId, {
      signed: true,
      sign_url: true,
      expires_at: expirationTime,
      resource_type: "image",
      type: "authenticated",
    });
  } catch (error) {
    throw new AppError(
      error instanceof Error ? error.message : "Failed to generate image URL.",
      500,
    );
  }
}
