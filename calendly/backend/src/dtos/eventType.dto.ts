import { z } from "zod";

const eventTypeSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().min(10).max(500).optional(),
  locationType: z.string().optional(),
  locationValue: z.string().min(10).max(100).optional(),
  slug: z.string().min(1).max(100).optional(),
  host_id: z.int(),
  durationMinutes: z.int().min(15).max(90),
  bufferBeforeMinutes : z.int().optional(),
  bufferAfterMinutes: z.int().optional(),
  isActive : z.boolean().default(true)
});

export const createEventTypeSchema = eventTypeSchema;
export const updateEventTypeSchema = eventTypeSchema.partial().refine((data) => data.title === undefined &&   data.host_id === undefined && data.durationMinutes === undefined , {message:"no parameters to update event type schema"});

export type  createEventTypeDTO = z.infer<typeof createEventTypeSchema>;
export type updateEventTypeDTO = z.infer<typeof updateEventTypeSchema>;
