import { Request , Response , NextFunction } from "express";
import { createEvent as createEventByService , removeEvent as removeEventByService , updateEvent as updateEventByService , getAllEvents as getAllActiveEventsByService , getEventById as getEventByIdByService , getPublicAllActiveEvents as getPublicAllActiveEventsByService } from "../services/eventType.service.js";
import { successResponse } from "../utils/api-success-response.js";

export interface eventTypeParam{
  eventId:string
}

export interface eventTypeHostParam{
  hostId:string
}

export async function createEventType(req: Request, res: Response, _next: NextFunction) {
  const userId = req.userId;
  const event = req.body;
  const createdEvent = await createEventByService(userId, event);
  return successResponse(res, createdEvent, 201, "event created successfully");
}

export async function removeEventType(req: Request<eventTypeParam>, res: Response, _next: NextFunction) {
  const userId = req.userId;
  const { eventId } = req.params;
  const transformedEventId = Number.parseInt(eventId);
  const removedEvent = await removeEventByService(transformedEventId, userId);
  return successResponse(res, removedEvent, 200, "event removed successfully");
}


export async function updateEventType(req: Request<eventTypeParam>, res: Response, _next: NextFunction) {
  const userId = req.userId;
  const { eventId } = req.params;
  const transformedEventId = Number.parseInt(eventId);
  const event = req.body;
  const updatedEvent = await updateEventByService(event, transformedEventId, userId);
  return successResponse(res, updatedEvent, 200, "updated event successfully");
}

export async function getAllEvents(req: Request, res: Response, _next: NextFunction) {
  const userId = req.userId;
  const allEvents = await getAllActiveEventsByService(userId);
  successResponse(res,allEvents,200);
}

export async function getAllActiveEvents(req: Request<eventTypeHostParam>, res: Response, _next: NextFunction) {
  const { hostId } = req.params;
  const transformedhostId = Number.parseInt(hostId);
  const allActiveEventsOfHost = await getAllActiveEventsByService(transformedhostId);
  successResponse(res,allActiveEventsOfHost,200);
}


export async function getEventByEventId(req:Request<eventTypeParam> , res:Response , _next:NextFunction) {
  const { eventId } = req.params;
  const transformedEventId = Number.parseInt(eventId);
  const event = await getEventByIdByService(transformedEventId);
  successResponse(res,event,200);
}
