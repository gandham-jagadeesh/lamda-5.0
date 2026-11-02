import {prisma} from "../config/database.js";
import { createSlotDTO, searchSlotDTO } from "../dtos/slot.dto.js"
import { DbClient, getDbClient } from "./db-client.js";


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

export async function markSlotBookedIfAvailable(id: string, db?: DbClient) {
  const client = getDbClient(db);
  const slots  = client.slot.updateMany({
    where: {
      id: id
    },
    data: {
      status: "BOOKED"
    }
  });
  return slots;
}

export async function lockSlotForUpdate(id: string, db?: DbClient) {
  const client = getDbClient(db);
  const slots = await client.$queryRaw<{ id: string }[]>` select * from slots where id = ${id} for update`;
  return slots;
}

export async function findSlotById(id: string, db?: DbClient) {
  const client = getDbClient(db);
  return client.slot.findFirst({
    where: {
      id: id
     }
  });
}

export async function blockSlot(id: string) {
  return prisma.slot.update({
    where: { id: id },
    data:{status:"BLOCKED"},
  })
}

export async function markSlotBooked(id: string,db?:DbClient) {
  const client = getDbClient(db);
  return client.slot.update({
    where: { id: id, status: "AVAILABLE" },
    data: { status: "BOOKED" }
  });
}


export async function getAllSlots(host_id: number , eventType_id: number , startAt: Date ,  endAt: Date ) {
  const allValidSlots = await prisma.slot.findMany({
    where: {
      host_id: host_id,
      eventType_id: eventType_id,
      startAt: { gte: startAt },
      endAt: { lte: endAt },
    }
  });
  return allValidSlots;
}
