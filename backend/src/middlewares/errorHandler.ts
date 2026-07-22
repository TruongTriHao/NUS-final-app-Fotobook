import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const error = err instanceof Error ? err : new Error(String(err));
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const isDevelopment = process.env.NODE_ENV === "development";
  const message =
    error instanceof AppError || isDevelopment
      ? error.message
      : "Internal Server Error";

  let formattedStack: string | string[] | undefined;
  if (isDevelopment && error.stack) {
    formattedStack = error.stack
      .split("\n")
      .map((line) => line.trim())
      .filter(
        (line) =>
          !line.includes("node_modules") && !line.includes("node:internal"),
      );
  }

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    data: null,
    ...(isDevelopment && { stack: formattedStack }),
  });
};
