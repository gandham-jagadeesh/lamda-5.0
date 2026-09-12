import { createEventTypeDTO } from "../dtos/eventType.dto.js";
import { conflict, notFound } from "../utils/api-error.js";
import { allEvents, create, remove, update, userExistsBySlug , allActiveEvents , getEvent} from "../repository/eventType.repository.js";
import slug from "slug";
import { UpdateUserDto } from "../dtos/user.dto.js";

//@Todo: slug : url compatabile : check then insert if not then throw error bad request
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
  const newEventType = await create({ ...event, slug: newSlug });
  return newEventType;
}


export async function removeEvent(id: number, hostId: number) {
  const removedEvent = await remove(id, hostId);
  if (!removedEvent) {
    throw notFound("Event not Found");
  }
  return removedEvent;
}

// in update need to check : fields : slu

export async function updateEvent(event: UpdateUserDto, id: number, userId: number) {
  //get the event and check whether we can't allow some data and throw bunch of errors and then resolve those then
  const updatedEvents = await update(id, event, userId); // run findmany to update all events whose matching with userid and id ofcourse its unique
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
