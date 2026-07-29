import type { Request } from "express";
import passport from "passport";
import { Strategy, type StrategyOptions } from "passport-jwt";
import { UserRepository } from "../repositories/user.repository";
import { JwtPayloadSchema } from "../validators/auth.validator";
import { userResponseSchema } from "../validators/user.validator";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

const userRepository = new UserRepository();

function cookieExtractor(req: Request): string | null {
  return (req.cookies["token"] as string | undefined) ?? null;
}

const options: StrategyOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new Strategy(options, (rawPayload: unknown, done): void => {
    const parsed = JwtPayloadSchema.safeParse(rawPayload);
    if (!parsed.success) {
      done(null, false, { message: "INVALID_TOKEN" });
      return;
    }
    const jwtPayload = parsed.data;

    userRepository
      .findById(jwtPayload.sub)
      .then((user) => {
        if (!user) {
          done(null, false);
          return;
        }
        if (!user.isActive) {
          done(null, false, { message: "ACCOUNT_INACTIVE" });
          return;
        }
        if (!user.isVerified) {
          done(null, false, { message: "ACCOUNT_NOT_VERIFIED" });
          return;
        }
        const userWithoutPassword = userResponseSchema.parse(user);
        done(null, userWithoutPassword);
      })
      .catch((error: unknown) => {
        done(error, false);
      });
  }),
);

export { passport };
