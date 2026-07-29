import type { NextFunction, Request, Response } from "express";
import { upload } from "../config/multer";
import { uploadToCloudinary } from "../utils/cloudinary";
import type { contentType } from "../validators/user.validator";

const MAX_NUM_PHOTOS_PER_ALBUM = 25;

type UploadBody = {
  imageUrl?: string;
  images?: string[];
  [key: string]: unknown;
};

export function parseUpload(fieldName: contentType) {
  const multerMiddleware =
    fieldName === "albums"
      ? upload.array("albums", MAX_NUM_PHOTOS_PER_ALBUM)
      : upload.single(fieldName);

  return (req: Request, res: Response, next: NextFunction): void => {
    multerMiddleware(req, res, (err) => {
      void (async () => {
        if (err) {
          next(err);
          return;
        }
        try {
          const body = req.body as UploadBody;
          body.imageUrl = undefined;
          body.images = undefined;
          if (req.file) {
            const result = await uploadToCloudinary(req.file, fieldName);
            body.imageUrl = result.public_id;
          }
          if (req.files && Array.isArray(req.files)) {
            const uploads = await Promise.all(
              req.files.map((file) => uploadToCloudinary(file, fieldName)),
            );
            body.images = uploads.map((upload) => upload.public_id);
          }
          next();
        } catch (error) {
          next(error);
        }
      })();
    });
  };
}
