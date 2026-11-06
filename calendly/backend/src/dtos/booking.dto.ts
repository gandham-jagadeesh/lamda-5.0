import { z } from "zod";

const dateSchema = z.string().regex(
  /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  { message: "Invalid date format, expected YYYY-MM-DD" }
);

export const bookingSchema = z.object({
  slot_id: z.uuid(),
  inviteeEmail: z.email(),
  inviteeName: z.string().min(1),
});

export const bookingsHostSearchSchema = z.object({
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  status:  z.enum(["CONFIRMED","CANCELLED","AVAILABLE"]).optional()
});


export const createBookingSchema = bookingSchema.extend({
  inviteeNotes: z.string().min(1) .optional()
});

const createBookingExtendedSchema = createBookingSchema.extend({
  slot_id: z.uuid(),
  eventType_id: z.int(),
  host_id: z.int(),
  status: z.string()
});

export type createBookingDTO = z.infer<typeof createBookingSchema>;
export type createBookingExtendedDTO = z.infer<typeof createBookingExtendedSchema>;
export type bookingHostSearchDTO = z.infer<typeof bookingsHostSearchSchema>;
