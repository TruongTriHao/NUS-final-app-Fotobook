import express from "express";
import { AdminController } from "../controllers/admin.controller";
import { requireAdmin } from "../middlewares/auth";
import { parseUpload } from "../middlewares/parseUpload";
import { validate } from "../middlewares/validate";
import { AlbumRepository } from "../repositories/album.repository";
import { PhotoRepository } from "../repositories/photo.repository";
import { UserRepository } from "../repositories/user.repository";
import { AlbumService } from "../services/album.service";
import { PhotoService } from "../services/photo.service";
import { UserService } from "../services/user.service";
import {
  paginationQuerySchema,
  updateAdminUserBodySchema,
} from "../validators/admin.validator";
import { idInputSchema } from "../validators/user.validator";

export const adminRouter = express.Router();

const userRepository = new UserRepository();
const photoRepository = new PhotoRepository();
const albumRepository = new AlbumRepository();
const photoService = new PhotoService(photoRepository, userRepository);
const albumService = new AlbumService(albumRepository, userRepository);
const userService = new UserService(
  userRepository,
  photoRepository,
  albumRepository,
);
const adminController = new AdminController(
  userService,
  photoService,
  albumService,
);

adminRouter.get(
  "/users",
  validate({ query: paginationQuerySchema }),
  requireAdmin,
  adminController.getUsers.bind(adminController),
);

adminRouter
  .route("/users/:id")
  .get(
    validate({ params: idInputSchema }),
    requireAdmin,
    adminController.getUserById.bind(adminController),
  )
  .delete(
    validate({ params: idInputSchema }),
    requireAdmin,
    adminController.deleteUser.bind(adminController),
  )
  .patch(
    requireAdmin,
    parseUpload("avatars"),
    validate({ params: idInputSchema, body: updateAdminUserBodySchema }),
    adminController.updateUser.bind(adminController),
  );

adminRouter.get(
  "/photos",
  validate({ query: paginationQuerySchema }),
  requireAdmin,
  adminController.getPhotos.bind(adminController),
);

adminRouter.get(
  "/albums",
  validate({ query: paginationQuerySchema }),
  requireAdmin,
  adminController.getAlbums.bind(adminController),
);
