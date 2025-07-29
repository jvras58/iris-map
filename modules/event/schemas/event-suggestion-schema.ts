import { z } from 'zod';

export const eventSuggestionSchema = z.object({
  title: z.string()
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(200, 'O título deve ter no máximo 200 caracteres')
    .trim(),
  
  category: z.string()
    .min(1, 'Selecione uma categoria'),
  
  description: z.string()
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres')
    .trim()
    .optional(),
  
  date: z.string()
    .min(1, 'A data é obrigatória')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'A data deve ser hoje ou no futuro'),
  
  time: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de horário inválido (HH:MM)')
    .optional()
    .or(z.literal('')),
  
  location: z.string()
    .min(3, 'O local deve ter pelo menos 3 caracteres')
    .max(200, 'O local deve ter no máximo 200 caracteres')
    .trim(),
  
  organizer: z.string()
    .min(2, 'O nome do organizador deve ter pelo menos 2 caracteres')
    .max(100, 'O nome do organizador deve ter no máximo 100 caracteres')
    .trim(),
  
  price: z.number()
    .min(0, 'O preço deve ser maior ou igual a zero')
    .max(999999.99, 'O preço deve ser menor que R$ 1.000.000')
    .optional(),
});

// Schema para criação no banco (com transformações)
export const createEventSuggestionSchema = eventSuggestionSchema.transform((data) => ({
  title: data.title,
  categoryId: data.category,
  description: data.description || null,
  date: new Date(data.date),
  time: data.time || null,
  location: data.location,
  organizer: data.organizer,
  price: data.price || null,
}));

export type EventSuggestionFormValues = z.infer<typeof eventSuggestionSchema>;
export type CreateEventSuggestionInput = z.infer<typeof createEventSuggestionSchema>;