import express from "express";
import { PhotoController } from "../controllers/photo.controller";
import { optionalAuth, requireAuth } from "../middlewares/auth";
import { parseUpload } from "../middlewares/parseUpload";
import { validate } from "../middlewares/validate";
import { PhotoRepository } from "../repositories/photo.repository";
import { UserRepository } from "../repositories/user.repository";
import { PhotoService } from "../services/photo.service";
import {
  createPhotoBodySchema,
  updatePhotoBodySchema,
} from "../validators/photo.validator";
import { idInputSchema } from "../validators/user.validator";

export const photoRouter = express.Router();

const userRepository = new UserRepository();
const photoRepository = new PhotoRepository();
const photoService = new PhotoService(photoRepository, userRepository);
const photoController = new PhotoController(photoService);

photoRouter
  .route("/")
  .post(
    requireAuth,
    parseUpload("photos"),
    validate({ body: createPhotoBodySchema }),
    photoController.create.bind(photoController),
  );

photoRouter
  .route("/:id/like")
  .post(
    validate({ params: idInputSchema }),
    requireAuth,
    photoController.like.bind(photoController),
  )
  .delete(
    validate({ params: idInputSchema }),
    requireAuth,
    photoController.unlike.bind(photoController),
  );

photoRouter
  .route("/:id")
  .get(
    validate({ params: idInputSchema }),
    optionalAuth,
    photoController.get.bind(photoController),
  )
  .delete(
    validate({ params: idInputSchema }),
    requireAuth,
    photoController.delete.bind(photoController),
  )
  .patch(
    requireAuth,
    parseUpload("photos"),
    validate({ params: idInputSchema, body: updatePhotoBodySchema }),
    photoController.update.bind(photoController),
  );
