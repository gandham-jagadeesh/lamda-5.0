import { NextFunction , Request , Response } from "express";
import * as service from "../services/availability.service.js"
import { successResponse } from "../utils/api-success-response.js";

export async function createRule(req: Request, res: Response, _next: NextFunction) {
  const rule = req.body;
  const userId = req.userId;
  const data = await service.createRule(userId, rule);
  successResponse(res, data,201,"rule created sucessfully");
}

// TODO add validation layer at middleware
export async function removeRule(req: Request, res: Response, _next: NextFunction) {
  const id = Number(req.params.id);
  const userId = req.userId;
  const data = await service.removeRule(id, userId);
  successResponse(res, data, 200,"rule removed successfully");
}


export async function updateRule(req: Request, res: Response, _next: NextFunction) {
  const id = Number(req.params.id);
  const userId = req.userId;
  const rule = req.body;
  const data = await service.updateRule(id, rule, userId);
  successResponse(res, data, 200, "rule updated sucessfully");
}

// TODO pagination
export async function getRules(req: Request, res: Response, _next: NextFunction) {
  const userId = req.userId;
  const data = await service.getRules(userId);
  successResponse(res, data, 200);
}


export async function getRule(req: Request, res: Response, _next: NextFunction) {
  const id = Number(req.params.id);
  const userId = req.userId;
  const data = await service.getRule(id, userId);
  successResponse(res, data);
}
