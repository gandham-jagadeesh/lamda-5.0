import { z } from "zod";

 const userSchema  = z.object({
  first_name: z.string().min(1).max(100).optional(),
  last_name: z.string().min(1).max(100).optional(),
  email: z.email(),
  password: z.string().min(1).max(100),
  slug: z.string().min(1).max(200).optional()

});

export const createUserSchema = userSchema;
export const updateUserSchema = userSchema.partial()
  .refine((data) => {
    return !data.email === undefined && !data.password === undefined
  }, {message:'At least one field must be provided'},);

export type createUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
