import { Request, Response } from "express";
import { createBookingOptimistically } from "../services/booking.service.js";
import { successResponse } from "../utils/api-success-response.js";

export async function createBooking(req: Request, res: Response) {
  const userid = req.userId;
  const bookingDTO = req.body;
  const booked = await createBookingOptimistically(userid, bookingDTO);
  successResponse(res, booked, 201, "sucessfully booked slot");
}
