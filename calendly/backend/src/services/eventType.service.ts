import { createEventTypeDTO } from "../dtos/eventType.dto.js";
import {  conflict, notFound, unauthorized } from "../utils/api-error.js";
import { allEvents, create, remove, update, userExistsBySlug , allActiveEvents , getEvent, eventsBySlug} from "../repository/eventType.repository.js";
import slug from "slug";
import { UpdateUserDto } from "../dtos/user.dto.js";

// TODO  unique slug creation , throw error if slug is not url compatabile
export async function createEvent(hostId: number, event: createEventTypeDTO) {
  if (event.slug) {
    const isUserExist = await userExistsBySlug(hostId, event.slug);
    if (isUserExist) {
      throw conflict("An event type with slug already exists, please use a different slug");
    }
  }
  const newSlug = event.slug ? event.slug : slug(event.title, { lower: true });
  if (!newSlug) {
    throw conflict("could not able to create a slug for event type");
  }
  const newEventType = await create(hostId,{ ...event, slug: newSlug });
  return newEventType;
}


export async function removeEvent(id: number, hostId: number) {
  const eventToRemove = await getEvent(id);
  if (!eventToRemove) {
    throw notFound("Event not Found");
  }
  if (eventToRemove.host_id !== hostId) {
    throw notFound("eventType with given id not  Found");
  }
  const removedEvent = await remove(id);
  return removedEvent;
}


export async function updateEvent(event: UpdateUserDto, id: number, userId: number) {
  const existedEvent = await getEvent(id);
  if (!existedEvent) {
    throw notFound("event with given id not Found");
  }
  if (existedEvent.host_id !== userId) {
    throw unauthorized("not have necessary permisson to modify the event");
  }
  if (event.slug && event.slug !== existedEvent.slug) {
    const otherEvents = await eventsBySlug(event.slug, userId);
    if (otherEvents) {
      throw conflict("slug is already existed");
    }
  }
  const updatedEvents = await update(id, event, userId);
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

export async function getEventById(id: number) {
  const event = await getEvent(id);
  if (!event) {
    throw notFound("Event Not Found");
  }
  return event;
}
