import express from "express";
import { AlbumController } from "../controllers/album.controller";
import { optionalAuth, requireAuth } from "../middlewares/auth";
import { parseUpload } from "../middlewares/parseUpload";
import { validate } from "../middlewares/validate";
import { AlbumRepository } from "../repositories/album.repository";
import { UserRepository } from "../repositories/user.repository";
import { AlbumService } from "../services/album.service";
import {
  createAlbumBodySchema,
  updateAlbumBodySchema,
} from "../validators/album.validator";
import { idInputSchema } from "../validators/user.validator";

export const albumRouter = express.Router();

const userRepository = new UserRepository();
const albumRepository = new AlbumRepository();
const albumService = new AlbumService(albumRepository, userRepository);
const albumController = new AlbumController(albumService);

albumRouter
  .route("/")
  .post(
    requireAuth,
    parseUpload("albums"),
    validate({ body: createAlbumBodySchema }),
    albumController.create.bind(albumController),
  );

albumRouter
  .route("/:id/like")
  .post(
    validate({ params: idInputSchema }),
    requireAuth,
    albumController.like.bind(albumController),
  )
  .delete(
    validate({ params: idInputSchema }),
    requireAuth,
    albumController.unlike.bind(albumController),
  );

albumRouter
  .route("/:id")
  .get(
    validate({ params: idInputSchema }),
    optionalAuth,
    albumController.get.bind(albumController),
  )
  .delete(
    validate({ params: idInputSchema }),
    requireAuth,
    albumController.delete.bind(albumController),
  )
  .patch(
    requireAuth,
    parseUpload("albums"),
    validate({ params: idInputSchema, body: updateAlbumBodySchema }),
    albumController.update.bind(albumController),
  );
