import { NextFunction,Request,Response } from "express";
import { ApiError } from "../utils/api-error.js";
import { NODE_ENV } from "../config/env.js"
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {

  if (err instanceof ApiError) {
    const body : Record<string, unknown> = {
      success: false,
      message: err.message
    }
    if (err.details) body.details = err.details;
    res.status(err.statusCode).json(body);
  }
  console.log("[error]", err);
  const body: Record<string, unknown> = {
    success: false,
    message: "something went wrong"
  }
  if (NODE_ENV === "development") body.details = err.stack;
  return res.status(500).json(body);
}
