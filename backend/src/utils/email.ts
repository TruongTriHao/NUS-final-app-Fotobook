import { Resend } from "resend";

const {
  RESEND_API_KEY,
  RESEND_FROM = "onboarding@resend.dev",
  RESEND_TO,
  CORS_ORIGIN = "http://localhost:3000",
} = process.env;

const resend = new Resend(RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  token: string,
): Promise<void> {
  const url = `${CORS_ORIGIN}/verify-email/${token}`;

  await resend.emails.send({
    from: RESEND_FROM,
    to: RESEND_TO || email,
    subject: "Verify your Fotobook Account",
    html: `Please click <a href="${url}">here</a> to verify your email.`,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
): Promise<void> {
  const url = `${CORS_ORIGIN}/reset-password/${token}`;

  await resend.emails.send({
    from: RESEND_FROM,
    to: RESEND_TO || email,
    subject: "Reset your Fotobook Password",
    html: `Please click <a href="${url}">here</a> to reset your password.`,
  });
}
