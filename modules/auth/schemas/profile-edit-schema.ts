import { email, z } from 'zod';

export const ProfileFormSchema = z.object({
  name: z.string()
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres')
    .trim(),
  email: z.string().optional(),
  sexual_orientation: z.string().optional(),
  city: z.string()
    .max(100, 'A cidade deve ter no máximo 100 caracteres')
    .trim()
    .optional(),
});

export type ProfileFormValues = z.infer<typeof ProfileFormSchema>;