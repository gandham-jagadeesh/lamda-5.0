import { createBookingDTO } from "../dtos/booking.dto.js";
import { prisma } from "../config/database.js";
import type { slot } from "../../generated/prisma/client.js";
import { badRequest, notFound } from "../utils/api-error.js";
import { findSlotById, lockSlotForUpdate, markSlotBookedIfAvailable } from "../repository/slot.repository.js";
import { createBooking } from "../repository/booking.repository.js";
import { markSlotBooked } from "../repository/slot.repository.js";

export function validateSlot(slot: slot | null) {
  if (!slot) {
    throw notFound("slot Not Found");
  }
  if (slot.status != "AVAILABLE") {
    throw badRequest("slot is not available");
  }
  if (slot.startAt <= new Date()) {
    throw badRequest("slot already started");
  }
  return slot;
}

export async function createBookingOptimistically(userId:number,createBookingDTO: createBookingDTO) {
  const bookedSlot = prisma.$transaction(async (tx) => {
    const slot = validateSlot(await findSlotById(createBookingDTO.slot_id, tx));
    const validatedSlot = await markSlotBookedIfAvailable(slot.id);
    if (validatedSlot.count != 1) {
      throw notFound("slot is not available");
    }
    return createBooking({
      slot_id: slot.id,
      eventType_id: slot.eventType_id,
      host_id: userId,
      status: slot.status,
      inviteeEmail: createBookingDTO.inviteeEmail,
      inviteeName: createBookingDTO.inviteeName,
      inviteeNotes: createBookingDTO.inviteeNotes
    }, tx);
  });
  return bookedSlot;
}

export async function createBookingPessimistically(userId: number, createBookingDTO: createBookingDTO) {
  const bookedSlot = prisma.$transaction(async (tx) => {
    const lockedSlots = await  lockSlotForUpdate(createBookingDTO.slot_id,tx);
    if (lockedSlots.length === 0) {
      throw notFound("slot not Found");
    }
    const validatedSlot = validateSlot(await findSlotById(createBookingDTO.slot_id, tx));
    const markedSlot = await markSlotBooked(validatedSlot.id, tx);
    return createBooking({
      slot_id: validatedSlot.id,
      eventType_id: validatedSlot.eventType_id,
      host_id: userId,
      status: markedSlot.status,
      inviteeEmail: createBookingDTO.inviteeEmail,
      inviteeName: createBookingDTO.inviteeName,
      inviteeNotes: createBookingDTO.inviteeNotes
    },tx);
  });
  return bookedSlot;
}
