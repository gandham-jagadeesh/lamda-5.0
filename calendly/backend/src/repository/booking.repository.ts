import { prisma } from "../config/database.js";
import { createBookingExtendedDTO } from "../dtos/booking.dto.js";
import { DbClient, getDbClient } from "./db-client.js";


export  function createBooking(booking: createBookingExtendedDTO, db?: DbClient) {
  const client = getDbClient(db);
  const booked =  client.booking.create({
    data: booking
  });
  return booked;
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
