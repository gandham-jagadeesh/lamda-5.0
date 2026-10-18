import {z} from "zod";



const slotSchema  = z.object({
  host_id: z.number(),
  eventType_id: z.number(),
  startAt: z.string(),
  endAt : z.string(),
  status: z.string().default("AVAILABLE")
});


export type createSlotDTO = z.infer<typeof slotSchema>;
export type updateSlotDTO = z.infer<typeof slotSchema>;
