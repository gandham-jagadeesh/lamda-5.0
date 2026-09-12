import { z } from "zod";

const eventTypeSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().min(10).max(1000).optional(),
  durationMinutes: z.int().min(15).max(120).default(30),
  locationType: z.enum(["online","in-person"]).default("online"),
  locationValue: z.string().min(10).max(100).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/,"slug may only contain lowercase letters , numbers and hyphens").optional(),
  bufferBeforeMinutes : z.int().min(0).max(120).default(0),
  bufferAfterMinutes: z.int().min(0).max(120).default(0),
  isActive : z.boolean().default(true)
});

export const createEventTypeSchema = eventTypeSchema;
export const updateEventTypeSchema = eventTypeSchema.partial();

export type  createEventTypeDTO = z.infer<typeof createEventTypeSchema>;
export type updateEventTypeDTO = z.infer<typeof updateEventTypeSchema>;
