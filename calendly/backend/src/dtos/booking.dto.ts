import { z } from "zod";

const bookingSchema = z.object({
  slot_id: z.uuid(),
  inviteeEmail: z.email(),
  inviteeName: z.string().min(1),
});


const createBookingSchema = bookingSchema.extend({
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
