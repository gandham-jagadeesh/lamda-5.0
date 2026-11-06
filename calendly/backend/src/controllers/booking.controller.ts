import { Request, Response } from "express";
import { createBookingOptimistically } from "../services/booking.service.js";
import { successResponse } from "../utils/api-success-response.js";
import { getHostBookedSlots } from "../services/booking.service.js"
import { cancelBookings } from "../services/booking.service.js";
export async function createBooking(req: Request, res: Response) {
  const userid = req.userId;
  const bookingDTO = req.body;
  const booked = await createBookingOptimistically(userid, bookingDTO);
  successResponse(res, booked, 201, "sucessfully booked slot");
}


export async function listSlotsByfilterAndDate(req: Request, res: Response) {
  const userid = req.userId;
  const searchQueryParams = req.query;
  const hostSlots = await getHostBookedSlots(userid, searchQueryParams);
  successResponse(res, hostSlots, 200, "host bookings ");
}


export async function cancelBooking(req: Request, res: Response) {
  const userid = req.userId;
  const bookingId = Number(req.params.booking_id);
  const cancelledBookings = await cancelBookings(userid, bookingId);
  return successResponse(res, {}, 200, cancelledBookings.message);
}
