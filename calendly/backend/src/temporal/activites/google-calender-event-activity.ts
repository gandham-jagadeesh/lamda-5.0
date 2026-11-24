import { googleCalenderEvent } from "../../services/googleCalender.service.js";

interface calenderEventInput{
  bookingId: number,
  userId: number
}

export async function googleCalenderEventCreationActivity(input:calenderEventInput) {
  await googleCalenderEvent(input.userId, input.bookingId);
}
