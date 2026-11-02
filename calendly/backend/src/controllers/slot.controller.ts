import { Request, Response } from "express";
import { getSlotsByHostAndEvent  } from "../services/slot.service.js";
import { successResponse } from "../utils/api-success-response.js";

export async function getAllSlots(req: Request, res: Response) {
  const eventTypeId = Number(req.params.eventType_id);
  const hostId = Number(req.params.hostId);
  const startAt = req.query.startAt as string;
  const endAt = req.query.endAt as string;
  const allValidSlots = await getSlotsByHostAndEvent(hostId, eventTypeId, startAt, endAt);
  return successResponse(res, allValidSlots, 200);
}
