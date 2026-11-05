import { NextFunction , Request , Response } from "express";
import { notFound } from "../utils/api-error.js";

export function noRouteHandler(_req: Request, _res: Response, next: NextFunction) {
  console.log(`[url] :`,_req.originalUrl);
  next(notFound("Route Not Found"));
}
