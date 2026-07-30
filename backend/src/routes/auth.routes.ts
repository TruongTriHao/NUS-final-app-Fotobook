import express from "express";
import { AuthController } from "../controllers/auth.controller";
import { optionalAuth, requireAuth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { UserRepository } from "../repositories/user.repository";
import { AuthService } from "../services/auth.service";
import {
  emailVerifySchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validators/auth.validator";

export const authRouter = express.Router();

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

authRouter.get("/me", optionalAuth, authController.getMe.bind(authController));

authRouter.post(
  "/register",
  validate({ body: registerSchema }),
  authController.register.bind(authController),
);

authRouter.post(
  "/login",
  validate({ body: loginSchema }),
  authController.login.bind(authController),
);

authRouter.post(
  "/logout",
  requireAuth,
  authController.logout.bind(authController),
);

authRouter.post(
  "/verify-email",
  validate({ body: emailVerifySchema }),
  authController.verifyEmail.bind(authController),
);

authRouter.post(
  "/resend-verify-email",
  validate({ body: emailVerifySchema }),
  authController.resendVerifyEmail.bind(authController),
);

authRouter.post(
  "/forgot-password",
  validate({ body: forgotPasswordSchema }),
  authController.forgotPassword.bind(authController),
);

authRouter.post(
  "/reset-password",
  validate({ body: resetPasswordSchema }),
  authController.resetPassword.bind(authController),
);
