import { z } from "zod";


const availabilityRuleSchema = z.object({
  weekday: z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]),

  isActive: z.boolean().default(true),

  startTime: z.string().regex(/^(?:[0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: "Invalid time format. Expected HH:MM:SS"
  }),

  endTime: z.string().regex(/^(?:[0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: "Invalid time format. Expected HH:MM:SS"
  }),

  timezone: z.string().default("UTC").optional()
})

const availabilityExceptionSchema = z.object({
  type: z.enum(["partial", "full"]),

  date: z.string().regex(/^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/, { message: "invalid date format expected YYYY-MM-DD " }),

  startTime: z.string().regex(/^(?:[0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: "Invalid time format. Expected HH:MM:SS"
  }).optional(),

  endTime: z.string().regex(/^(?:[0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: "Invalid time format. Expected HH:MM:SS"
  }).optional(),

  timezone: z.string().default("UTC").optional(),

  reason: z.string().optional(),
});


export const createAvailabilityRuleSchema = availabilityRuleSchema;
export const updateAvailabilityRuleSchema = availabilityRuleSchema.partial();

export const createAvailabilityExceptionSchema = availabilityExceptionSchema;
export const updateAvailabilityExceptionSchema = availabilityExceptionSchema.partial();

export type createAvailbilityRuleDTO = z.infer<typeof createAvailabilityRuleSchema>;
export type updateAvailbilityRuleDTO = z.infer<typeof updateAvailabilityRuleSchema>;

export type createAvailabilityExceptionDTO = z.infer<typeof createAvailabilityExceptionSchema>;
export type updateAvailabilityExceptionDTO = z.infer<typeof updateAvailabilityExceptionSchema>;
