import { createEventTypeDTO } from "../dtos/eventType.dto.js";
import { badRequest, conflict, notFound } from "../utils/api-error.js";
import { allEvents, create, remove, update, userExistsBySlug , allActiveEvents , getEvent} from "../repository/eventType.repository.js";
import slug from "slug";
import { UpdateUserDto } from "../dtos/user.dto.js";

export async function createEvent(userId: number, event: createEventTypeDTO) {
  if (userId !== event.host_id) {
    throw badRequest("unable to create event invalid host");
  }
  if (event.slug) { // in zod schema add refine or slug regexp logic
    const isUserExist = await userExistsBySlug(userId, event.slug);
    if (isUserExist) {
      throw conflict("slug already exists");
    }
  }
  //need to have slug regex to check the validity if exists -> in middleware
  const newSlug = event.slug ? event.slug : slug(event.title,{lower:true});
  const newEventType = await create({ ...event, slug: newSlug });
  return newEventType;
}


export async function removeEvent(eventId: number, userId: number) {
  const removedEvent = await remove(eventId, userId);  // if logged in user has such an event then remove it else throw not found error
  if (!removedEvent) {
    throw notFound("Event not Found");
  }
  return removedEvent;
}


export async function updateEvent(event: UpdateUserDto, eventId: number, userId: number) {
  const updatedEvents = await update(eventId, event, userId); // run findmany to update all events whose matching with userid and eventid ofcourse its unique
  if (updatedEvents.length === 0) {
    throw notFound("Event not Found");
  }
  return updatedEvents[0];
}

//user specific events : get all the events of logged in user
export async function getAllEvents(userId:number) {
  const events = await allEvents(userId);
  return events;
}

// get events of speific user which are active : public api
export async function getPublicAllActiveEvents(id:number) {
  const userPubliEvents = await allActiveEvents(id)
  return userPubliEvents;
}

export async function getEventById(eventId: number) {
  const event = await getEvent(eventId);
  if (!event) {
    throw notFound("Event Not Found");
  }
  return event;
}
