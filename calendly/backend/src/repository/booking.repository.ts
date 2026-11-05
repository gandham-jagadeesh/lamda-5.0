import { createBookingExtendedDTO } from "../dtos/booking.dto.js";
import { DbClient, getDbClient } from "./db-client.js";
import { prisma } from "../config/env.js";

interface bookingHostSearch{
  startDate?: Date,
  endDate?: Date,
  status?:string
}

export  function createBooking(booking: createBookingExtendedDTO, db?: DbClient) {
  const client = getDbClient(db);
  const booked =  client.booking.create({
    data: booking
  });
  return booked;
}

export async function getHostBookingsinRange(userId: number, search: bookingHostSearch = {}) {
  const startAt: { gte?: Date, lte?: Date } = {};
  if (search.startDate) {
    startAt.gte = search.startDate;
  }

  if (search.endDate) {
    startAt.lte = search.endDate;
  }

  const bookings = await prisma.booking.findMany({
    where: {
      host_id: userId,
      ...(search.status && { status: search.status }),
      ...(Object.keys(startAt).length > 0 && { slot: { startAt: startAt } })
    },
    select: {
      slot: true,
      eventType: {
        select: {
          id: true,
          slug: true,
          title: true,
        }
      }
    },
    orderBy: {
      slot:{startAt:'asc'}
    }
  });
  return bookings;
}

export async  function findBookingById(bookingId: number) {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId
    },
    include: {
      slot: true,
      eventType: true,
      host:true
    }
  });
  return booking;
}

// check whether logged in user booking slot is that
export async function cancelBooking(bookingId: number, dbclient?: DbClient){
const prisma = getDbClient(dbclient);
  const bookingCancelled = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      status: "CANCELLED"
    },
  });
  return bookingCancelled;
}
