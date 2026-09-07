import { Request, Response, NextFunction } from "express";
import { ZodObject  } from "zod";
import { badRequest } from "../utils/api-error.js";

export  function validate(zodSchema:ZodObject) {
  return async function createUserMiddleware(req: Request, _res: Response, next: NextFunction) {
    const user = zodSchema.safeParse(req.body);
    if (!user.success) {
      throw  badRequest("validation failed", user.error.issues);
    }
    req.body = user.data;
    next();
  }
}
