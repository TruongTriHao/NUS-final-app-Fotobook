import { UserRepository } from "../repositories/user.repository";
import { AppError } from "../utils/AppError";
import { sendPasswordResetEmail, sendVerificationEmail } from "../utils/email";
import {
  decodeUnverifiedResetToken,
  generateEmailVerifyToken,
  generatePasswordResetToken,
  generateToken,
  verifyEmailToken,
  verifyEmailTokenIgnoreExpiration,
  verifyPasswordResetToken,
} from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/password";
import type {
  Login,
  LoginResponse,
  Register,
} from "../validators/auth.validator";
import { userResponseSchema } from "../validators/user.validator";

export class AuthService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async register(data: Register): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError("User with this email already exists", 409);
    }

    const hashedPassword = await hashPassword(data.password);
    const newUser = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });
    const token = generateEmailVerifyToken(newUser.id);
    void sendVerificationEmail(newUser.email, token);
  }

  async login(data: Login): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError("Email not found", 401);
    }
    if (!user.isActive) {
      throw new AppError("User account is not active", 403);
    }
    if (!user.isVerified) {
      throw new AppError("User email is not verified", 403);
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid password", 401);
    }

    await this.userRepository.update(user.id, {
      lastLogin: new Date(),
    });

    const token = generateToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });

    return {
      user: userResponseSchema.parse(user),
      token,
    };
  }

  async verifyEmail(token: string): Promise<void> {
    const userId = verifyEmailToken(token);
    if (!userId) {
      throw new AppError("Invalid or expired email verification token", 401);
    }
    const user = await this.userRepository.findById(userId);
    if (!user || !user.isActive) {
      throw new AppError("User not found or account is not active", 404);
    }
    await this.userRepository.update(userId, { isVerified: true });
  }

  async resendVerifyEmail(token: string): Promise<void> {
    const userId = verifyEmailTokenIgnoreExpiration(token);
    if (!userId) {
      throw new AppError("Invalid email verification token", 401);
    }
    const user = await this.userRepository.findById(userId);
    if (!user || !user.isActive) {
      throw new AppError("User not found or account is not active", 404);
    }
    const newToken = generateEmailVerifyToken(user.id);
    void sendVerificationEmail(user.email, newToken);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.isActive || !user.isVerified) {
      return;
    }
    const token = generatePasswordResetToken(user.id, user.password);
    void sendPasswordResetEmail(user.email, token);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const decoded = decodeUnverifiedResetToken(token);
    if (!decoded || !decoded.sub) {
      throw new AppError("Invalid or expired password reset token", 401);
    }
    const user = await this.userRepository.findById(decoded.sub);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    if (!user.isActive || !user.isVerified) {
      throw new AppError(
        "User account is not active or email is not verified",
        403,
      );
    }
    const isValid = verifyPasswordResetToken(token, user.password);
    if (!isValid) {
      throw new AppError("Invalid or expired password reset token", 401);
    }
    const hashedPassword = await hashPassword(newPassword);
    await this.userRepository.update(user.id, { password: hashedPassword });
  }
}
