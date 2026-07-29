import type { Request } from "express";
import { AppError } from "../utils/AppError";
import type { UserResponse } from "../validators/user.validator";

export function getAuthenticatedUser(req: Request): UserResponse {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }
  return req.user;
}
