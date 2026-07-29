import express from "express";
import { UserController } from "../controllers/user.controller";
import { optionalAuth, requireAuth } from "../middlewares/auth";
import { parseUpload } from "../middlewares/parseUpload";
import { validate } from "../middlewares/validate";
import { AlbumRepository } from "../repositories/album.repository";
import { PhotoRepository } from "../repositories/photo.repository";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";
import { idInputSchema, userUpdateSchema } from "../validators/user.validator";

export const userRouter = express.Router();

const userRepository = new UserRepository();
const photoRepository = new PhotoRepository();
const albumRepository = new AlbumRepository();
const userService = new UserService(
  userRepository,
  photoRepository,
  albumRepository,
);
const userController = new UserController(userService);

userRouter
  .route("/me")
  .get(requireAuth, userController.getCurrentProfile.bind(userController))
  .patch(
    requireAuth,
    parseUpload("avatars"),
    validate({ body: userUpdateSchema }),
    userController.updateProfile.bind(userController),
  );

userRouter.get(
  "/:id",
  validate({ params: idInputSchema }),
  optionalAuth,
  userController.getPublicProfile.bind(userController),
);

userRouter
  .route("/:id/follow")
  .post(
    validate({ params: idInputSchema }),
    requireAuth,
    userController.follow.bind(userController),
  )
  .delete(
    validate({ params: idInputSchema }),
    requireAuth,
    userController.unfollow.bind(userController),
  );

userRouter.get(
  "/:id/photos",
  validate({ params: idInputSchema }),
  optionalAuth,
  userController.getUserPhotos.bind(userController),
);

userRouter.get(
  "/:id/albums",
  validate({ params: idInputSchema }),
  optionalAuth,
  userController.getUserAlbums.bind(userController),
);

userRouter.get(
  "/:id/followers",
  validate({ params: idInputSchema }),
  optionalAuth,
  userController.getUserFollowers.bind(userController),
);

userRouter.get(
  "/:id/following",
  validate({ params: idInputSchema }),
  optionalAuth,
  userController.getUserFollowees.bind(userController),
);
