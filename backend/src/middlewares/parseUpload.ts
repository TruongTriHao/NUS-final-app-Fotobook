import type { NextFunction, Request, Response } from "express";
import { upload } from "../config/multer";
import type { UploadType } from "../validators/user.validator";

const MAX_NUM_PHOTOS_PER_ALBUM = 25;

type UploadBody = {
  data?: string | string[];
  [key: string]: unknown;
};

export function parseUpload(fieldName: UploadType) {
  const multerMiddleware =
    fieldName === "albums"
      ? upload.array("albums", MAX_NUM_PHOTOS_PER_ALBUM)
      : upload.single(fieldName);

  return (req: Request, res: Response, next: NextFunction) => {
    multerMiddleware(req, res, (err) => {
      if (err) {
        next(err);
        return;
      }
      const body = req.body as UploadBody;
      if (req.file) {
        body.data = `/uploads/${fieldName}/${req.file.filename}`;
      }
      if (req.files && Array.isArray(req.files)) {
        body.data = req.files.map((file) => `/uploads/albums/${file.filename}`);
      }
      next();
    });
  };
}
