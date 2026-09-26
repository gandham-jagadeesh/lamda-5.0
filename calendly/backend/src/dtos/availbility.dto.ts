import { z } from "zod";


const availabilityRuleBaseSchema = z.object({
  weekday: z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]),

  isActive: z.boolean(),

  startTime: z.string().regex(/^(?:[0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: "Invalid time format. Expected HH:MM:SS"
  }),

  endTime: z.string().regex(/^(?:[0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: "Invalid time format. Expected HH:MM:SS"
  }),

  timezone: z.string()
});


export const createAvailabilityRuleValidationSchema = availabilityRuleBaseSchema.extend({
  isActive: z.boolean().default(true),
  timezone: z.string().default("UTC")
}).refine((data) => {
  // startTime and endTime are string they are checking in alphabet... so '9' < '8' is true only false conditions need to check
  return data.startTime <   data.endTime
}, { message: "start Time always less than the  end Time" });


export const updateAvailabilityRuleValidationSchema = availabilityRuleBaseSchema.partial().superRefine((data, ctx) => {

  const hasWeek = data.weekday !== undefined;
  const hasStart = data.startTime !== undefined;
  const hasEnd = data.endTime !== undefined;

  if (Object.keys(data).length === 0) {
    ctx.addIssue({
      code: 'custom',
      message:"at least one field must be provided"
    });
  }

  if (hasStart !== hasEnd) {
    ctx.addIssue({
      code: 'custom',
      path: ['startTime', 'endTime'],
      message:'startTime and endTime both must be present'
    })
  }

  if (hasWeek && (!hasStart || !hasEnd)) {
    ctx.addIssue({
      code: 'custom',
      path: ['startTime', 'endTime'],
      message:'startTime end Time both be present when updating a week'
   })
  }

  if (hasStart && hasEnd && data.startTime! >= data.endTime!) {
    ctx.addIssue({
      code: 'custom',
      path: ['startTime', 'endTime'],
      message:'startTime must be less than endTime'
    })
  }

});


const availabilityExceptionBaseSchema = z.object({

  type: z.enum(["partial", "full", "available"]),

  date: z.string().regex(/^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/, { message: "invalid date format expected YYYY-MM-DD " }),

  startTime: z.string().regex(/^(?:[0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: "Invalid time format. Expected HH:MM:SS"
  }),

  endTime: z.string().regex(/^(?:[0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: "Invalid time format. Expected HH:MM:SS"
  }),

  timezone: z.string(),

  reason: z.string()

});

//invalid create data scenarios
// type full with  startTime and endTime
// startTime is greater than endTime : when  partial and available types are there
// what if date is too future or too old like yesterday soo thats an issue -- not related to schema service level whats is today dont want zod to check that
// wrong time zone format being used in timezone //dont worry for now
// random weird reason data need to use reg ex  // dont worry for now dont use regex for every thing

export const createAvailabilityExceptionValidationSchema = availabilityExceptionBaseSchema.extend({
  startTime: z.string().regex(/^(?:[0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: "Invalid time format. Expected HH:MM:SS"
  }).optional(),

  endTime: z.string().regex(/^(?:[0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: "Invalid time format. Expected HH:MM:SS"
  }).optional(),

  timezone: z.string().default("UTC"),

  reason: z.string().optional()
}).superRefine((data, ctx) => {

  if (data.type === "full") {
    const  isStartTime = data.startTime !== undefined;
    const  isEndTime = data.endTime !== undefined;
    if (isStartTime || isEndTime) {
      ctx.addIssue({
        code: 'custom',
        path: ['startTime', 'endTime'],
        message:'full exception cannot have  startTime and endTime'
      })
    }
  }

  if (data.type === "partial" || data.type === "available") {
    let isStartTime = data.startTime !== undefined;
    let isEndTime = data.endTime !== undefined;
    if (!isStartTime) {
      ctx.addIssue({
        code: 'custom',
        path: ['startTime'],
        message: "startTime must exist"
      });
  }
    if (!isEndTime) {
      ctx.addIssue({
        code: 'custom',
        path: ['endTime'],
        message: "endTime must exist"
      });
    }
      if ( data.startTime !== undefined &&   data.endTime !== undefined  && data.startTime >=  data.endTime) {
        ctx.addIssue({
          code: 'custom',
          path: ['startTime', 'endTime'],
          message: "startTime must be less than endTime"
        });
      }
  }
});


export const updateAvailabilityExceptionValidationSchema = availabilityExceptionBaseSchema.partial().superRefine((data, ctx) => {

  if (Object.keys(data).length === 0) {
    ctx.addIssue({
      code: 'custom',
      message:"at least one field must be provided"
    });
  }

  if (data.type === "full" && (data.startTime !== undefined || data.endTime !== undefined)) {
    ctx.addIssue({
      code: "custom",
      path: ["startTime", "endTime"],
      message: "Full exception cannot have startTime or endTime",
    });
  }
  if (data.type === "partial" || data.type === "available") {
    let isStartTime = data.startTime !== undefined;
    let isEndTime = data.endTime !== undefined;
    if (!isStartTime) {
      ctx.addIssue({
        code: 'custom',
        path: ['startTime'],
        message: "startTime must exist"
      });
    }
    if (!isEndTime) {
      ctx.addIssue({
        code: 'custom',
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



export type createAvailbilityRuleDTO = z.infer<typeof createAvailabilityRuleValidationSchema>;
export type updateAvailbilityRuleDTO = z.infer<typeof updateAvailabilityRuleValidationSchema>;

export type createAvailabilityExceptionDTO = z.infer<typeof createAvailabilityExceptionValidationSchema>;
export type updateAvailabilityExceptionDTO = z.infer<typeof updateAvailabilityExceptionValidationSchema>;
