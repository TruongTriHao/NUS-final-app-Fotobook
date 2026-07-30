import { z } from "zod";

export const infiniteLoadQuerySchema = z.object({
  cursor: z.string().trim().nullable().default(null),
  limit: z.coerce
    .number("Limit must be a number")
    .int("Limit must be an integer")
    .positive("Limit must be greater than 0")
    .max(100, "Limit cannot exceed 100")
    .optional()
    .default(20),
  search: z.string().trim().default(""),
});

export type InfiniteLoadQuery = z.infer<typeof infiniteLoadQuerySchema>;
