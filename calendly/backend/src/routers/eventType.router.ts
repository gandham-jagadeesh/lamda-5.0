import { Router } from "express";
import { createEventType, removeEventType , getAllEvents, updateEventType, getAllActiveEvents, getEventByEventId, eventTypeParam} from "../controllers/eventType.controller.js"
import { createEventTypeSchema, updateEventTypeSchema } from "../dtos/eventType.dto.js";
import { validate } from "../middlewares/validate.js";
import { requireUserId } from "../middlewares/require.user.id.js";

export const eventTypeRouter: Router = Router();

eventTypeRouter.use(requireUserId);

eventTypeRouter.get("/",getAllEvents);
eventTypeRouter.post("/", validate(createEventTypeSchema), createEventType);
//TODO use id
eventTypeRouter.delete("/:eventId",removeEventType);
eventTypeRouter.put<eventTypeParam>("/:eventId", validate(updateEventTypeSchema), updateEventType);
eventTypeRouter.get("/:eventId", getEventByEventId);

//public route : get all events of a host by id
eventTypeRouter.get("/host/:hostId", getAllActiveEvents);
