import { prisma } from "../config/database.js";
import { createEventTypeDTO, updateEventTypeDTO } from "../dtos/eventType.dto.js";

// need to take care of the slug
export async function create(event: createEventTypeDTO & {slug:string}) {
  const createdEvent = await prisma.eventType.create({
    data:event
  });
  return createdEvent;
} //create a event type

export async function update(id: number, event: updateEventTypeDTO) {
  const updatedUser = await prisma.eventType.update({
    where: {
      id: id
    },
    data: event
  });
  return updatedUser;
};
 // update an event type

export async function remove(id:number) {
  const removedUser = await prisma.eventType.delete({
    where: {
      id: id
    }
  });
  return removedUser;
} //remove an event type

// events of that user
export async function allEvents(userId:number) {
  const allEvents = await prisma.eventType.findMany({
    where: {
      host_id: userId
    }
  });
  return allEvents;
} // get all events of that user

export async function allActiveEvents(userId: number) {
  const allUsers = await prisma.eventType.findMany({
    where: {
      isActive: true,
      host_id:userId
    }
  });
  return allUsers;
} // get all active events of user

export async function onlineEvents(hostId:number) {
  const allOnlineEvents = await prisma.eventType.findMany({
    where: {
      locationType: "online",
      host_id:hostId
    }
  });
  return allOnlineEvents;
} //get all online events of user

export async function eventsBySlug(slug: string, userId: number) {
  const allEvents = await prisma.eventType.findMany({
    where: {
      slug: slug,
      host_id:userId
    }
  });
  return allEvents;
} // get all events by slug of user
