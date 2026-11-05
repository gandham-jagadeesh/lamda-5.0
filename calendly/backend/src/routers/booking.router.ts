import { Router } from "express";
import { requireUserId } from "../middlewares/require.user.id.js";
import {createBooking } from "../controllers/booking.controller.js"
import { validate } from "../middlewares/validate.js";
import { createBookingSchema  } from "../dtos/booking.dto.js";
export const bookingRouter: Router = Router();

bookingRouter.use(requireUserId);


bookingRouter.post("/",validate(createBookingSchema),createBooking);
