import type { NextFunction, Request, RequestHandler, Response } from "express";
import { z } from "zod";
import { AppError } from "../utils/AppError";

type Schema = {
  body?: z.ZodType;
  query?: z.ZodType;
  params?: z.ZodType;
};

export function validate(schema: Schema): RequestHandler {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const result = await z
        .object({
          body: schema.body ?? z.unknown(),
          query: schema.query ?? z.unknown(),
          params: schema.params ?? z.unknown(),
        })
        .safeParseAsync({
          body: req.body as unknown,
          query: req.query,
          params: req.params,
        });

      if (!result.success) {
        const errorMessages = result.error.issues
          .map((issue) => issue.message)
          .join(", ");
        next(new AppError(errorMessages, 400));
        return;
      }

      if (schema.body) {
        req.body = result.data.body;
      }
      if (schema.query) {
        req.query = result.data.query as Request["query"];
      }
      if (schema.params) {
        req.params = result.data.params as Request["params"];
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
