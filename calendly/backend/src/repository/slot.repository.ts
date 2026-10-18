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
