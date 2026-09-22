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

// TODO Handle empty body scenario
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


export async function createException(req: Request, res: Response, _next: NextFunction) {
  const userId = req.userId;
  const exception = req.body;
  const createdException = await service.createException(exception, userId)
  successResponse(res, createdException, 201);
}


export async function removeException(req: Request, res: Response, _next: NextFunction) {
  const id = req.params.id;
  const transformedId = Number(id);
  const userId = req.userId;
  const removedException = await service.removeException(transformedId, userId);
  successResponse(res, removedException, 200);
}

export async function getAllExceptions(req: Request, res: Response, _next: NextFunction) {
  const userId = req.userId;
  const allExceptions = await service.getAllExceptions(userId);
  successResponse(res, allExceptions, 200);
}

export async function findException(req: Request, res: Response, _next: NextFunction) {
  const id = req.params.id;
  const transformedId = Number(id);
  const userId = req.userId;
  const exception = await service.getException(transformedId, userId);
  successResponse(res, exception, 200);
}

export async function updateException(req: Request, res: Response, _next: NextFunction) {
  const id = req.params.id;
  const transformedId = Number(id);
  const userId = req.userId;
  const exception = req.body;
  const updatedException = await service.updateException(transformedId, exception, userId);
  successResponse(res, updatedException, 200);
}

//TODO add date validation
export async function getExceptionByDate(req: Request, res: Response, _next: NextFunction) {
  const date = req.query.date as string;
  const userId = req.userId;
  const allExceptionsByDate = await service.getbyDate(userId, date);
  successResponse(res, allExceptionsByDate, 200);
}
