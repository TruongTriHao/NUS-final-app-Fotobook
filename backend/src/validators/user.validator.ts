import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  firstName: z
    .string({ error: "First name is required" })
    .max(25, "First name must be 25 characters or less"),
  lastName: z
    .string({ error: "Last name is required" })
    .max(25, "Last name must be 25 characters or less"),
  email: z
    .email({ error: "Invalid email format or missing email" })
    .max(255, "Email must be 255 characters or less"),
  password: z
    .string({ error: "Password is required" })
    .max(64, "Password must be 64 characters or less"),
  avatarUrl: z.string({ error: "Invalid avatar path" }).nullable().optional(),
  role: z.enum(["user", "admin"]),
  lastLogin: z.date().nullable().optional(),
  isActive: z.boolean().default(true),
});

export const uploadTypeSchema = z.enum(["avatars", "photos", "albums"], {
  error: "Upload type is required and must be valid",
});

export const userResponseSchema = userSchema.omit({
  password: true,
  lastLogin: true,
  isActive: true,
});

export const userProfileSchema = userResponseSchema.extend({
  isCurrentUser: z.boolean(),
  isFollowee: z.boolean(),
  numPhotos: z.number().int().nonnegative(),
  numAlbums: z.number().int().nonnegative(),
  numFollowers: z.number().int().nonnegative(),
  numFollowees: z.number().int().nonnegative(),
});

export const userUpdateSchema = userSchema
  .omit({
    id: true,
    avatarUrl: true,
    role: true,
    lastLogin: true,
    isActive: true,
  })
  .partial();

export const userUpdateAvatarSchema = z.object({
  data: z.string({ error: "Avatar file path is required" }),
});

export const userGetPublicProfileSchema = userSchema.pick({
  id: true,
});

export type UserResponse = z.infer<typeof userResponseSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
export type UserUpdateAvatar = z.infer<typeof userUpdateAvatarSchema>;
export type UploadType = z.infer<typeof uploadTypeSchema>;
export type UserGetPublicProfile = z.infer<typeof userGetPublicProfileSchema>;
