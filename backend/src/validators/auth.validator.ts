import { z } from "zod";
import { userResponseSchema } from "./user.validator";

export const registerSchema = z.object({
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
});

export const loginSchema = registerSchema.pick({
  email: true,
  password: true,
});

export const loginResponseSchema = z.object({
  user: userResponseSchema,
  token: z.string(),
});

export const JwtPayloadSchema = z.object({
  sub: z.string(),
  email: z.email(),
  role: z.enum(["user", "admin"]),
  isActive: z.boolean(),
  iat: z.number().int().positive(),
  exp: z.number().int().positive(),
});

export const emailVerifySchema = z.object({
  token: z.string(),
});

export const forgotPasswordSchema = registerSchema.pick({
  email: true,
});

export const resetPasswordSchema = registerSchema
  .pick({
    password: true,
  })
  .extend({
    token: z.string(),
  });

export type Register = z.infer<typeof registerSchema>;
export type Login = z.infer<typeof loginSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type JwtPayload = z.infer<typeof JwtPayloadSchema>;
export type EmailVerify = z.infer<typeof emailVerifySchema>;
export type ForgotPassword = z.infer<typeof forgotPasswordSchema>;
export type ResetPassword = z.infer<typeof resetPasswordSchema>;
