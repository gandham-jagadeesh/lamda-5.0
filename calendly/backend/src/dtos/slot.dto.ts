import {z} from "zod";



const slotSchema = z.object({
  hostId: z.number(),
  eventTypeId: z.number(),
  startAt: z.string(),
  endAt : z.string(),
  status: z.string().default("AVAILABLE")
});



const createSlotSchemaRefined = slotSchema.superRefine((data, ctx) => {

  if (data.startAt > data.endAt) {
    ctx.addIssue({
      code: 'custom',
      path: ['startAt', 'endAt'],
      message:'startAt must be less than endAt'
    })
  }

});


const updateSlotSchemaRefined = slotSchema.extend({
  startAt: z.string().optional(),
  endAt: z.string().optional(),
  status : z.string().optional()
})
