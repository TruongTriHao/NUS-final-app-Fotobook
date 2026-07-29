import type { NextFunction, Request, RequestHandler, Response } from "express";
import { passport } from "../config/passport";
import { AppError } from "../utils/AppError";
import type { UserResponse } from "../validators/user.validator";

type AuthMode = "required" | "optional" | "admin";

function createAuthMiddleware(mode: AuthMode): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    (
      passport.authenticate(
        "jwt",
        { session: false },
        (
          err: Error | null,
          user: UserResponse | false | undefined,
          info: unknown,
        ) => {
          const clearAuthCookie = () => {
            res.clearCookie("token", {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite:
                process.env.NODE_ENV === "production" ? "none" : "strict",
            });
          };

          if (err) {
            clearAuthCookie();
            next(new AppError("Authentication error", 500));
            return;
          }

          if (!user) {
            clearAuthCookie();
            if (mode === "optional") {
              next();
              return;
            }
            if (info && typeof info === "object" && "message" in info) {
              const msg = info.message;
              if (msg === "ACCOUNT_INACTIVE") {
                next(new AppError("User account is not active", 403));
                return;
              }
              if (msg === "INVALID_TOKEN") {
                next(new AppError("Invalid or corrupted token format", 401));
                return;
              }
              if (msg === "ACCOUNT_NOT_VERIFIED") {
                next(new AppError("User account is not verified", 403));
                return;
              }
            }
            next(new AppError("Unauthorized", 401));
            return;
          }
          if (mode === "admin" && user.role !== "admin") {
            next(new AppError("Forbidden: Administrator access required", 403));
            return;
          }
          req.user = user;
          next();
        },
      ) as RequestHandler
    )(req, res, next);
  };
}

export const requireAuth = createAuthMiddleware("required");
export const optionalAuth = createAuthMiddleware("optional");
export const requireAdmin = createAuthMiddleware("admin");
