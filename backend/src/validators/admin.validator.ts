import z from "zod";
import { baseUserSchema } from "./user.validator";

export const paginationQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1, "Page must be a positive integer")
    .max(100, "Page must be less than or equal to 100"),
  limit: z.coerce
    .number()
    .int()
    .min(1, "Limit must be a positive integer")
    .max(100, "Limit must be less than or equal to 100"),
});

export const updateAdminUserBodySchema = baseUserSchema
  .pick({
    firstName: true,
    lastName: true,
    email: true,
  })
  .extend({
    password: z.preprocess(
      (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
      baseUserSchema.shape.password.optional(),
    ),
    imageUrl: z.string(),
    isActive: z.preprocess((val) => val === "true", z.boolean()),
    deleteAvatar: z.preprocess((val) => val === "true", z.boolean()),
  })
  .partial();

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type UpdateAdminUserBody = z.infer<typeof updateAdminUserBodySchema>;
