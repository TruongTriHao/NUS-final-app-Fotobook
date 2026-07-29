import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { convertJwtExpiresToMaxAge } from "../utils/jwt";
import type {
  EmailVerify,
  ForgotPassword,
  Login,
  Register,
  ResetPassword,
} from "../validators/auth.validator";

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async register(req: Request, res: Response): Promise<void> {
    await this.authService.register(req.body as Register);
    res.status(201).json({
      status: "success",
      message:
        "User registered successfully, please check your email to verify your account",
      data: null,
    });
  }

  async login(req: Request, res: Response): Promise<void> {
    const result = await this.authService.login(req.body as Login);
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: convertJwtExpiresToMaxAge(process.env.JWT_EXPIRES_IN || "1d"),
    });
    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      data: { user: result.user },
    });
  }

  logout(_req: Request, res: Response): void {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({
      status: "success",
      message: "User logged out successfully",
      data: null,
    });
  }

  async verifyEmail(req: Request, res: Response): Promise<void> {
    const { token } = req.body as EmailVerify;
    await this.authService.verifyEmail(token);
    res.status(200).json({
      status: "success",
      message: "Email verified successfully. You can now log in.",
      data: null,
    });
  }

  async resendVerifyEmail(req: Request, res: Response): Promise<void> {
    const { token } = req.body as EmailVerify;
    await this.authService.resendVerifyEmail(token);
    res.status(200).json({
      status: "success",
      message:
        "Verification email resent successfully. Please check your email.",
      data: null,
    });
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body as ForgotPassword;
    await this.authService.forgotPassword(email);
    res.status(200).json({
      status: "success",
      message:
        "If an account with that email exists, a password reset link has been sent.",
      data: null,
    });
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    const { token, password } = req.body as ResetPassword;
    await this.authService.resetPassword(token, password);
    res.status(200).json({
      status: "success",
      message: "Password reset successfully. You can now log in.",
      data: null,
    });
  }
}
