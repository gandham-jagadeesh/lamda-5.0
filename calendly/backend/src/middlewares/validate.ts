import { Request, Response, NextFunction } from "express";
import { ZodObject  } from "zod";
import { badRequest } from "../utils/api-error.js";

export function validate(zodSchema: ZodObject) {
  return async function createUserMiddleware(req: Request<{ eventId: string }>, _res: Response, next: NextFunction) {
    const user = zodSchema.safeParse(req.body);
    console.log(`[validation]`, user.data);
    if (!user.success) {
      throw  badRequest("validation failed", user.error.issues);
    }
    req.body = user.data;
    next();
  }
}
