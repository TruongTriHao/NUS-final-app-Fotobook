import type { NextFunction, Request, RequestHandler, Response } from "express";
import { passport } from "../config/passport";
import { AppError } from "../utils/AppError";
import type { UserResponse } from "../validators/user.validator";

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  (
    passport.authenticate(
      "jwt",
      { session: false },
      (
        err: Error | null,
        user: UserResponse | false | undefined,
        info: unknown,
      ) => {
        if (err) {
          next(new AppError("Authentication error", 500));
          return;
        }
        if (!user) {
          if (info && typeof info === "object" && "message" in info) {
            if (info.message === "ACCOUNT_INACTIVE") {
              next(new AppError("User account is not active", 403));
              return;
            }
            if (info.message === "INVALID_TOKEN") {
              next(new AppError("Invalid or corrupted token format", 401));
              return;
            }
            if (info.message === "ACCOUNT_NOT_VERIFIED") {
              next(new AppError("User account is not verified", 403));
              return;
            }
          }
          next(new AppError("Unauthorized", 401));
          return;
        }
        if (user.role !== "admin") {
          next(new AppError("Forbidden: Administrator access required", 403));
          return;
        }
        req.user = user;
        next();
      },
    ) as RequestHandler
  )(req, res, next);
}
