import z from "zod";
import { Visibility } from "../generated/prisma/client";
import { userResponseSchema } from "./user.validator";

const baseAlbumSchema = z.object({
  id: z.cuid2(),
  title: z
    .string({ error: "Title is required." })
    .trim()
    .min(1, { message: "Title cannot be empty." })
    .max(140, { message: "Title cannot be longer than 140 characters." }),
  description: z
    .string({ error: "Description is required." })
    .trim()
    .min(1, { message: "Description cannot be empty." })
    .max(300, { message: "Description cannot be longer than 300 characters." }),
  images: z.array(z.string(), { error: "Images are required." }),
  mode: z.enum(Visibility, {
    error: "Mode must be either 'public' or 'private'.",
  }),
  ownerId: z.cuid2({ error: "Owner ID is required." }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const albumResponseSchema = baseAlbumSchema.extend({
  likeCount: z
    .number()
    .int()
    .nonnegative("Like count must be a non-negative integer.")
    .default(0),
});

export const albumWithOwnerSchema = albumResponseSchema
  .pick({
    id: true,
    title: true,
    description: true,
    images: true,
    mode: true,
    ownerId: true,
    createdAt: true,
    likeCount: true,
  })
  .extend({
    owner: userResponseSchema
      .pick({
        firstName: true,
        lastName: true,
        avatarUrl: true,
      })
      .extend({ isFollowee: z.boolean().default(false) }),
    isLiked: z.boolean().default(false),
  });

export const createAlbumBodySchema = baseAlbumSchema.pick({
  title: true,
  description: true,
  mode: true,
  images: true,
});

export const updateAlbumBodySchema = baseAlbumSchema
  .pick({
    title: true,
    description: true,
    mode: true,
    images: true,
  })
  .extend({
    existingImages: z
      .preprocess((value) => {
        if (typeof value === "string") {
          return JSON.parse(value) as string[];
        }
        return value;
      }, z.array(z.string()))
      .optional(),
  })
  .partial();

export type BaseAlbum = z.infer<typeof baseAlbumSchema>;
export type AlbumWithOwner = z.infer<typeof albumWithOwnerSchema>;
export type CreateAlbumBody = z.infer<typeof createAlbumBodySchema>;
export type UpdateAlbumBody = z.infer<typeof updateAlbumBodySchema>;
