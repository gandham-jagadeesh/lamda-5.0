import { prisma } from "../config/database.js";
import { createEventTypeDTO, updateEventTypeDTO } from "../dtos/eventType.dto.js";

// need to take care of the slug
export async function create(hostId:number,event: createEventTypeDTO & {slug:string}) {
  const createdEvent = await prisma.eventType.create({
    data: {
      host_id:hostId,
      ...event
    },
  });
  return createdEvent;
} //create a event type

export async function update(eventId: number, event: updateEventTypeDTO,hostId:number) {
  const updatedResults = await prisma.eventType.updateManyAndReturn({
    where: {
      id: eventId,
      host_id:hostId
    },
    data: event
  });
  return updatedResults;
};
 // update an event type

export async function remove(id:number) {
  const event = await prisma.eventType.delete({
    where: {
      id: id
    }
  });
  return event;
} //remove an event type

// events of that user
export async function allEvents(userId:number) {
  const allEvents = await prisma.eventType.findMany({
    where: {
      host_id: userId
    }
  });
  return allEvents  === undefined ? [] : allEvents;
} // get all events of that user

export async function allActiveEvents(userId: number) {
  const allUsers = await prisma.eventType.findMany({
    where: {
      isActive: true,
      host_id:userId
    }
  });
  return allUsers === undefined ? [] : allUsers;
} // get all active events of user

export async function onlineEvents(hostId:number) {
  const allOnlineEvents = await prisma.eventType.findMany({
    where: {
      locationType: "online",
      host_id:hostId
    }
  });
  allOnlineEvents === undefined ? [] : allOnlineEvents;
} //get all online events of user

export async function eventsBySlug(slug: string, hostId: number) {
  const allEvents = await prisma.eventType.findMany({
    where: {
      slug: slug,
      host_id:hostId
    }
  });
  return allEvents;
} // get all events by slug of user


export async function userExistsBySlug(hostId: number, slug: string) {
  const user = await prisma.eventType.findFirst({
    where: {
      host_id: hostId,
      slug: slug
    }
  });
  return user !== undefined;
}

export async function getEvent(eventId: number) {
  const event = await prisma.eventType.findFirst({
    where: {
      id: eventId
    }
  });
  return event;
} // get a event
