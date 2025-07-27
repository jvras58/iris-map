import { z } from 'zod';

export const RegisterformSchema = z
  .object({
    name: z.string().min(2, {
      message: 'O nome deve ter pelo menos 2 caracteres.',
    }),
    email: z.email({
      message: 'Digite um email válido.',
    }),
    password: z.string().min(6, {
      message: 'A senha deve ter pelo menos 6 caracteres.',
    }),
    confirmPassword: z.string().min(6, {
      message: 'A confirmação de senha deve ter pelo menos 6 caracteres.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],

  });

export type RegisterFormValues = z.infer<typeof RegisterformSchema>;
export type RegisterFormData = z.infer<typeof RegisterformSchema>;