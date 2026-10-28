import { z } from 'zod';

export const setupUserDetailsSchema = z.object({
  firstName: z.string().trim().min(2).max(128),
  lastName: z.string().trim().min(2).max(128),
  email: z.email(),
});

export type SetupUserDetailsDto = z.infer<typeof setupUserDetailsSchema>;
