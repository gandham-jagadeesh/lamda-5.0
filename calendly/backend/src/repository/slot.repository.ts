import {prisma} from "../config/database.js";
import { createSlotDTO } from "../dtos/slot.dto.js"


// create slot
export async function create(slot:createSlotDTO){
 const createdSlot = await prisma.slot.create({ data: slot});
 return createdSlot;
}


export async function FindBookedSlotsByHostInRange(hostId: number, startDate: Date, endDate: Date) {
  const bookedslots = await prisma.slot.findMany({
    where: {
      host_id: hostId,
      startAt: {
        gte: startDate,
        lte: endDate
      },
      status: "BOOKED"
    }
  });
  return bookedslots;
}


export async function upsertSlots(hostId: number, eventTypeId: number, startAt: Date, endAt: Date) {
  return prisma.slot.upsert({
    where: {
      eventType_id_startAt_endAt: {
        eventType_id: eventTypeId,
        startAt,
        endAt
      },
    },
    create: {
      host_id: hostId,
      eventType_id: eventTypeId,
      startAt: startAt,
      endAt: endAt,
      status: "AVAILABLE"
    },
    update: {
      status: "AVAILABLE"
    }
  });
}


export async function findFutureSlotsByEventTypeInRange(eventTypeId: number, startDate: Date, endDate: Date) {
  return prisma.slot.findMany({
    where: {
      eventType_id: eventTypeId,
      startAt: { gte: startDate, lte: endDate },
      status: { in: ["AVAILABLE", "BLOCKED"] }
    }
  });
}

export async function blockSlot(id: string) {
  prisma.slot.update({
    where: { id: id },
    data:{status:"BLOCKED"},
  })
}
