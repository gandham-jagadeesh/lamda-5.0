import { cancelledMail } from "../../mailer/booking-mail.js"

export async function sendCancelledBookingMailActivity(bookingId: number) {
  await cancelledMail(bookingId);
}
