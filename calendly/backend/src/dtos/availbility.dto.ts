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
}).refine((data) => {
  // startTime and endTime are string they are checking in alphabet... so '9' < '8' is true only false conditions need to check
  return data.startTime <   data.endTime
}, { message: "start Time must be not be equal or less than end Time" });

//TODO Handle past dates
const availabilityExceptionSchema = z.object({
  type: z.enum(["partial", "full", "available"]),

  date: z.string().regex(/^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/, { message: "invalid date format expected YYYY-MM-DD " }),

  startTime: z.string().regex(/^(?:[0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: "Invalid time format. Expected HH:MM:SS"
  }).optional(),

  endTime: z.string().regex(/^(?:[0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: "Invalid time format. Expected HH:MM:SS"
  }).optional(),

  timezone: z.string().default("UTC").optional(),

  reason: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.type === "partial" || data.type === "available") {
    //check for both start time and end time must be existed if not add validation error
    let isStartTime = data.startTime !== undefined ? true : false;
    let isEndTime = data.endTime !== undefined ? true : false;
    if (!isStartTime) {
      ctx.addIssue({
        code: 'custom',
        path: ['startTime'],
        message: "startTime must exist"
      });
    }
    if (!isEndTime) {
      ctx.addIssue({        code: 'custom',
        path: ['endTime'],
        message: "endTime must exist"
      });
    }
      if ( data.startTime  !== undefined  && data.endTime !== undefined  && data.startTime >=  data.endTime) {
        ctx.addIssue({
          code: 'custom',
          path: ['startTime', 'endTime'],
          message: "startTime must be less than endTime"
        });
      }
  }
});

export const createAvailabilityRuleSchema = availabilityRuleSchema;
export const updateAvailabilityRuleSchema = availabilityRuleSchema.partial();

export const createAvailabilityExceptionSchema = availabilityExceptionSchema;
export const updateAvailabilityExceptionSchema = availabilityExceptionSchema.partial();

export type createAvailbilityRuleDTO = z.infer<typeof createAvailabilityRuleSchema>;
export type updateAvailbilityRuleDTO = z.infer<typeof updateAvailabilityRuleSchema>;

export type createAvailabilityExceptionDTO = z.infer<typeof createAvailabilityExceptionSchema>;
export type updateAvailabilityExceptionDTO = z.infer<typeof updateAvailabilityExceptionSchema>;
