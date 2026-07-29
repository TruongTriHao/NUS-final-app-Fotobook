import type { UserResponse } from "../validators/user.validator";

declare module "express-serve-static-core" {
  interface Request {
    user?: UserResponse;
    validatedQuery?: unknown;
    validatedParams?: unknown;
  }
}
