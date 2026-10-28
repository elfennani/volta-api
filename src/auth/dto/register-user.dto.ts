import { z } from 'zod';

export const registerUserSchema = z.object({
  phone: z.e164(),
  code: z.number(),
});

export type RegisterUserDto = z.infer<typeof registerUserSchema>;
