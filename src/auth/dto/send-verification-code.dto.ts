import { z } from 'zod';

export const sendVerificationCodeSchema = z.object({
  phone: z.e164()
});

export type SendVerificationCodeDto = z.infer<typeof sendVerificationCodeSchema>;