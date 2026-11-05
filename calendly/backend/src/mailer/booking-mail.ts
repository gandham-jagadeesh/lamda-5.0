import { findBookingById } from "../../src/repository/booking.repository.js";
import { sendEmail } from "../config/nodemail.js";

export async function sendBookedEmail(bookingId: number) {
  const booking = await findBookingById(bookingId);
  if (!booking || booking.status !== "CONFIRMED") return;
  const when = booking.slot.startAt.toISOString();
  sendEmail(booking.inviteeEmail, `booking confirmation : ${booking.id}`, `
    <p>Hello ${booking.inviteeName},</p>
    <p>Your booking for ${booking.eventType.title} on ${when} has been confirmed.</p>
    <p>Thank you for booking with us.</p>
   `);
}
