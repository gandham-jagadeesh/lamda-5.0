import { NextFunction,Request,Response } from "express";
import { ApiError } from "../utils/api-error.js";
import { NODE_ENV } from "../config/env.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  const body: Record<string, unknown> = {
    success: false,
    message: "something went wrong"
  }

  if (err instanceof ApiError) {
    if (err.details) body.details = err.details;
    return res.status(err.statusCode).json(body);
  }
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code) body.code = err.code;
  }
  if (NODE_ENV === "development") body.details = err.stack;
  return res.status(500).json(body);
}
