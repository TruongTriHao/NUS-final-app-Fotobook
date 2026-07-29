import z from "zod";
import { Visibility } from "../generated/prisma/client";
import { userResponseSchema } from "./user.validator";

const basePhotoSchema = z.object({
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
  imageUrl: z.string({ error: "Image URL is required." }),
  mode: z.enum(Visibility, {
    error: "Mode must be either 'public' or 'private'.",
  }),
  ownerId: z.cuid2({ error: "Owner ID is required." }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const photoResponseSchema = basePhotoSchema.extend({
  likeCount: z
    .number()
    .int()
    .nonnegative("Like count must be a non-negative integer.")
    .default(0),
});

export const photoWithOwnerSchema = photoResponseSchema
  .pick({
    id: true,
    title: true,
    description: true,
    imageUrl: true,
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

export const createPhotoBodySchema = basePhotoSchema.pick({
  title: true,
  description: true,
  mode: true,
  imageUrl: true,
});

export const updatePhotoBodySchema = basePhotoSchema
  .pick({
    title: true,
    description: true,
    mode: true,
    imageUrl: true,
  })
  .partial();

export type BasePhoto = z.infer<typeof basePhotoSchema>;
export type PhotoWithOwner = z.infer<typeof photoWithOwnerSchema>;
export type CreatePhotoBody = z.infer<typeof createPhotoBodySchema>;
export type UpdatePhotoBody = z.infer<typeof updatePhotoBodySchema>;
