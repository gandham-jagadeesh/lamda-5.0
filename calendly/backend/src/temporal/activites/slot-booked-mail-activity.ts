import { sendBookedEmail } from "../../mailer/booking-mail.js";

export async function sendBookedEmailCofirmationActivity(bookinId:number) {
  sendBookedEmail(bookinId);
}
