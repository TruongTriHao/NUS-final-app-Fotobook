import cookieParser from "cookie-parser";
import cors from "cors";
import type { NextFunction, Request, Response } from "express";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { passport } from "./config/passport";
import { errorHandler } from "./middlewares/errorHandler";
import { adminRouter } from "./routes/admin.routes";
import { albumRouter } from "./routes/album.routes";
import { authRouter } from "./routes/auth.routes";
import { feedRouter } from "./routes/feed.routes";
import { photoRouter } from "./routes/photo.routes";
import { userRouter } from "./routes/user.routes";
import { AppError } from "./utils/AppError";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  handler: (_req: Request, _res: Response, next: NextFunction) => {
    next(new AppError("Too many requests. Please try again later.", 429));
  },
});

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(limiter);
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/photos", photoRouter);
app.use("/api/albums", albumRouter);
app.use("/api/main", feedRouter);
app.use("/api/admin", adminRouter);

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError("Not Found", 404));
});

app.use(errorHandler);
