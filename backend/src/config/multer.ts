import type { Request } from "express";
import fs from "fs";
import multer, { type FileFilterCallback } from "multer";
import path from "path";
import { AppError } from "../utils/AppError";
import {
  uploadTypeSchema,
  type UploadType,
} from "../validators/user.validator";

type TypeBody = {
  type?: UploadType;
  [key: string]: unknown;
};

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const result = uploadTypeSchema.safeParse((req.body as TypeBody).type);
    const type = result.success ? result.data : "photos";
    const uploadPath = path.join(process.cwd(), "uploads", type);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now().toString()}-${Math.round(Math.random() * 1e9).toString()}`;
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Invalid file type. Only JPEG, PNG, and GIF are allowed.",
        400,
      ),
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
