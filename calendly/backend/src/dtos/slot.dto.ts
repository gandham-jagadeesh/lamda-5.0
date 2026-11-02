import {z} from "zod";

const dateSchema = z.string().regex(
  /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  { message: "Invalid date format, expected YYYY-MM-DD" }
);


const slotSchema  = z.object({
  host_id: z.number(),
  eventType_id: z.number(),
  startAt: dateSchema,
  endAt : dateSchema,
  status: z.string().default("AVAILABLE")
});

const searchSlot = slotSchema.extend({
  status: z.string().optional()
});


export type createSlotDTO = z.infer<typeof slotSchema>;
export type updateSlotDTO = z.infer<typeof slotSchema>;
export type searchSlotDTO = z.infer<typeof searchSlot>;
