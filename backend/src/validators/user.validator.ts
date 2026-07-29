import { z } from "zod";

export const baseUserSchema = z.object({
  id: z.cuid2(),
  firstName: z
    .string({ error: "First name is required" })
    .trim()
    .min(1, "First name cannot be empty")
    .max(25, "First name must be 25 characters or less"),
  lastName: z
    .string({ error: "Last name is required" })
    .trim()
    .min(1, "Last name cannot be empty")
    .max(25, "Last name must be 25 characters or less"),
  email: z
    .email({ error: "Invalid email format or missing email" })
    .trim()
    .toLowerCase()
    .max(255, "Email must be 255 characters or less"),
  password: z
    .string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must be 64 characters or less")
    .refine(
      (val) => new TextEncoder().encode(val).length <= 72,
      "Password must be 72 bytes or less",
    ),
  avatarUrl: z.string().nullable().optional(),
  role: z.enum(["user", "admin"]),
  lastLogin: z.date().nullable().optional(),
  isVerified: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const contentTypeSchema = z.enum(["avatars", "photos", "albums"], {
  error: "Content type is required and must be valid",
});

export const idInputSchema = z.object({
  id: z.cuid2(),
});

export const userResponseSchema = baseUserSchema.pick({
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  avatarUrl: true,
  role: true,
});

export const userProfileSchema = userResponseSchema.extend({
  isCurrentUser: z.boolean(),
  isFollowee: z.boolean(),
  numPhotos: z.number().int().nonnegative(),
  numAlbums: z.number().int().nonnegative(),
  numFollowers: z.number().int().nonnegative(),
  numFollowees: z.number().int().nonnegative(),
});

export const userPublicProfileSchema = userProfileSchema.omit({
  email: true,
});

export const userUpdateSchema = baseUserSchema
  .pick({
    firstName: true,
    lastName: true,
    email: true,
  })
  .extend({
    imageUrl: z.string(),
    deleteAvatar: z.preprocess((val) => val === "true", z.boolean()),
    currentPassword: baseUserSchema.shape.password,
    newPassword: baseUserSchema.shape.password,
    passwordConfirmation: baseUserSchema.shape.password,
  })
  .partial();

export const adminUserDataSchema = baseUserSchema.pick({
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  avatarUrl: true,
  role: true,
  lastLogin: true,
  isActive: true,
});

export type UserResponse = z.infer<typeof userResponseSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type UserPublicProfile = z.infer<typeof userPublicProfileSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
export type contentType = z.infer<typeof contentTypeSchema>;
export type IdInput = z.infer<typeof idInputSchema>;
export type AdminUserData = z.infer<typeof adminUserDataSchema>;
