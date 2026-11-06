import { createBookingDTO } from "../dtos/booking.dto.js";
import { prisma } from "../config/database.js";
import type { slot } from "../../generated/prisma/client.js";
import { badRequest, notFound } from "../utils/api-error.js";
import { findSlotById, lockSlotForUpdate, markSlotBookedIfAvailable, UpdateSlotConfirmedToAvailable } from "../repository/slot.repository.js";
import { createBooking, findBookingById , cancelBooking } from "../repository/booking.repository.js";
import { markSlotBooked } from "../repository/slot.repository.js";
import { sendEmailBookedWorkFlow } from "../temporal/workflows/slot-booked-mail-workflow.js";
import { runSlotBookedConfirmWorkflow, runSlotGenWorkflow } from "../temporal/client.js";
import  { bookingHostSearchDTO } from  "../dtos/booking.dto.js"
import { DateTime } from "luxon";
import { getHostBookingsinRange } from "../repository/booking.repository.js"
import { unauthorized  } from "../utils/api-error.js"
import { runSlotCancelledConfirmWorkflow } from "../temporal/client.js";
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
  const bookedSlot = await prisma.$transaction(async (tx) => {
    const slot = validateSlot(await findSlotById(createBookingDTO.slot_id, tx));
    const validatedSlot = await markSlotBookedIfAvailable(slot.id);
    if (validatedSlot.count != 1) {
      throw notFound("slot is not available");
    }
    return createBooking({
      slot_id: slot.id,
      eventType_id: slot.eventType_id,
      host_id: userId,
      status: "CONFIRMED",
      inviteeEmail: createBookingDTO.inviteeEmail,
      inviteeName: createBookingDTO.inviteeName,
      inviteeNotes: createBookingDTO.inviteeNotes
    }, tx);
  });
  await runSlotBookedConfirmWorkflow(bookedSlot.id);
  await runSlotGenWorkflow({ hostId: bookedSlot.host_id });
  return bookedSlot;
}

export async function createBookingPessimistically(userId: number, createBookingDTO: createBookingDTO) {
  const bookedSlot = await prisma.$transaction(async (tx) => {
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
  await sendEmailBookedWorkFlow(bookedSlot.id);
  return bookedSlot;
}

//only for logged in User
export async function getHostBookedSlots(userId: number, bookingSearchInput: bookingHostSearchDTO = {}) {
  const startAt = bookingSearchInput.startDate ? DateTime.fromISO(bookingSearchInput.startDate, { zone: "utc" }).startOf('day').toJSDate() : undefined;
  const endAt = bookingSearchInput.endDate ? DateTime.fromISO(bookingSearchInput.endDate, { zone: "utc" }).endOf('day').toJSDate() : undefined;
  const status = bookingSearchInput.status;
  const bookings = await getHostBookingsinRange(userId, { status,startDate:startAt,endDate:endAt});
  return bookings;
}

export async function cancelBookings(user_id: number, bookingId: number) {
  const CancelBookingSlot = await prisma.$transaction(async (tx) => {
    const booking = await findBookingById(user_id, bookingId, tx);
    if (!booking) {
      throw notFound("booking not Found");
    }
    if (booking.status !== "CONFIRMED") {
      throw unauthorized("Booking is not cancellable");
    }
    const cancelledbooking = await cancelBooking(bookingId, tx);
    if (cancelledbooking.count != 1) {
      throw badRequest("Booking has been cancelled or modified");
    }
    const slotreAvailable = await UpdateSlotConfirmedToAvailable(booking.slot_id, tx);
    if (slotreAvailable.count != 1) {
      throw badRequest("unable to release booking slot");
    }
    return { message: "slot sucessfully cancelled", booking_id: booking.id , start: booking.slot.startAt.toISOString() }
  });
  await runSlotGenWorkflow({ hostId: user_id, to: CancelBookingSlot.start });
  await runSlotCancelledConfirmWorkflow(bookingId);
  return CancelBookingSlot;
}
