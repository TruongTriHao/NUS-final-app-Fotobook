import jwt from "jsonwebtoken";
import type { JwtPayload } from "../validators/auth.validator";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

if (!process.env.JWT_EMAIL_VERIFY_SECRET) {
  throw new Error(
    "JWT_EMAIL_VERIFY_SECRET environment variable is not defined",
  );
}

if (!process.env.JWT_PASSWORD_RESET_SECRET) {
  throw new Error(
    "JWT_PASSWORD_RESET_SECRET environment variable is not defined",
  );
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
const JWT_EMAIL_VERIFY_SECRET = process.env.JWT_EMAIL_VERIFY_SECRET;
const JWT_EMAIL_VERIFY_EXPIRES_IN =
  process.env.JWT_EMAIL_VERIFY_EXPIRES_IN || "1d";
const JWT_PASSWORD_RESET_SECRET = process.env.JWT_PASSWORD_RESET_SECRET;
const JWT_PASSWORD_RESET_EXPIRES_IN =
  process.env.JWT_PASSWORD_RESET_EXPIRES_IN || "1h";

type TimeUnit = "s" | "m" | "h" | "d";
const MULTIPLIERS: Record<TimeUnit, number> = {
  s: 1000,
  m: 60000,
  h: 3600000,
  d: 86400000,
};

export function generateToken(
  payload: Omit<JwtPayload, "iat" | "exp">,
): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function generateEmailVerifyToken(userId: string): string {
  return jwt.sign({ sub: userId }, JWT_EMAIL_VERIFY_SECRET, {
    expiresIn: JWT_EMAIL_VERIFY_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function generatePasswordResetToken(
  userId: string,
  hashedPassword: string,
): string {
  return jwt.sign({ sub: userId }, JWT_PASSWORD_RESET_SECRET + hashedPassword, {
    expiresIn: JWT_PASSWORD_RESET_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function decodeUnverifiedResetToken(
  token: string,
): { sub: string } | null {
  try {
    return jwt.decode(token) as { sub: string } | null;
  } catch {
    return null;
  }
}

// export function verifyToken(token: string): JwtPayload | null {
//   try {
//     return jwt.verify(token, JWT_SECRET) as JwtPayload;
//   } catch {
//     return null;
//   }
// }

export function verifyEmailToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_EMAIL_VERIFY_SECRET) as {
      sub: string;
    };
    return decoded.sub;
  } catch {
    return null;
  }
}

export function verifyEmailTokenIgnoreExpiration(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_EMAIL_VERIFY_SECRET, {
      ignoreExpiration: true,
    }) as { sub: string };
    return decoded.sub;
  } catch {
    return null;
  }
}

export function verifyPasswordResetToken(
  token: string,
  hashedPassword: string,
): boolean {
  try {
    jwt.verify(token, JWT_PASSWORD_RESET_SECRET + hashedPassword);
    return true;
  } catch {
    return false;
  }
}

export function convertJwtExpiresToMaxAge(
  expiresIn: string | number,
): number | undefined {
  if (typeof expiresIn === "number") {
    return expiresIn * 1000;
  }

  const match = expiresIn.match(/^(\d+)\s*(s|m|h|d)$/i);
  if (!match) {
    return undefined;
  }

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase() as TimeUnit;

  return value * MULTIPLIERS[unit];
}
