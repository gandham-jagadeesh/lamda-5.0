import { createBookingExtendedDTO } from "../dtos/booking.dto.js";
import { DbClient, getDbClient } from "./db-client.js";


export  function createBooking(booking: createBookingExtendedDTO, db?: DbClient) {
  const client = getDbClient(db);
  const booked =  client.booking.create({
    data: booking
  });
  return booked;
}
