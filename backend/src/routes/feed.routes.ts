import express from "express";
import { FeedController } from "../controllers/feed.controller";
import { optionalAuth, requireAuth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { FeedRepository } from "../repositories/feed.repository";
import { FeedService } from "../services/feed.service";
import { infiniteLoadQuerySchema } from "../validators/feed.validator";

export const feedRouter = express.Router();

const feedRepository = new FeedRepository();
const feedService = new FeedService(feedRepository);
const feedController = new FeedController(feedService);

feedRouter.get(
  "/feed/photos",
  validate({ query: infiniteLoadQuerySchema }),
  requireAuth,
  feedController.getFeedPhotos.bind(feedController),
);

feedRouter.get(
  "/feed/albums",
  validate({ query: infiniteLoadQuerySchema }),
  requireAuth,
  feedController.getFeedAlbums.bind(feedController),
);

feedRouter.get(
  "/discover/photos",
  validate({ query: infiniteLoadQuerySchema }),
  optionalAuth,
  feedController.getDiscoverPhotos.bind(feedController),
);

feedRouter.get(
  "/discover/albums",
  validate({ query: infiniteLoadQuerySchema }),
  optionalAuth,
  feedController.getDiscoverAlbums.bind(feedController),
);
