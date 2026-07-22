import nodemailer from "nodemailer";

const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(
  email: string,
  token: string,
): Promise<void> {
  const url = `${CORS_ORIGIN}/verify-email/${token}`;
  await transporter.sendMail({
    from: '"Fotobook" <no-reply@fotobook.com>',
    to: email,
    subject: "Verify your Fotobook Account",
    html: `Please click <a href="${url}">here</a> to verify your email.`,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
): Promise<void> {
  const url = `${CORS_ORIGIN}/reset-password/${token}`;
  await transporter.sendMail({
    from: '"Fotobook" <no-reply@fotobook.com>',
    to: email,
    subject: "Reset your Fotobook Password",
    html: `Please click <a href="${url}">here</a> to reset your password.`,
  });
}
