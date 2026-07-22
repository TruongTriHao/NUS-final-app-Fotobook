import express from "express";
import { UserController } from "../controllers/user.controller";
import { optionalAuth } from "../middlewares/optionalAuth";
import { parseUpload } from "../middlewares/parseUpload";
import { requireAuth } from "../middlewares/requireAuth";
import { validate } from "../middlewares/validate";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";
import {
  userGetPublicProfileSchema,
  userUpdateAvatarSchema,
  userUpdateSchema,
} from "../validators/user.validator";

export const userRouter = express.Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

userRouter.get(
  "/me",
  requireAuth,
  userController.getCurrentProfile.bind(userController),
);

userRouter.patch(
  "/me",
  requireAuth,
  validate({ body: userUpdateSchema }),
  userController.updateProfile.bind(userController),
);

userRouter.patch(
  "/me/avatar",
  requireAuth,
  parseUpload("avatars"),
  validate({ body: userUpdateAvatarSchema }),
  userController.updateAvatar.bind(userController),
);

userRouter.delete(
  "/me/avatar",
  requireAuth,
  userController.deleteAvatar.bind(userController),
);

userRouter.get(
  "/:id",
  optionalAuth,
  validate({ params: userGetPublicProfileSchema }),
  userController.getPublicProfile.bind(userController),
);
