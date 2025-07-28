import { z } from "zod";

export const eventSuggestionSchema = z.object({
  title: z.string().min(1, "O nome do evento é obrigatório"),
  category: z.string().min(1, "A categoria é obrigatória"),
  description: z.string().optional(),
  date: z.string().min(1, "A data é obrigatória").refine((val) => !isNaN(Date.parse(val)), {
    message: "Data inválida",
  }),
  time: z.string().optional(),
  location: z.string().min(1, "O local é obrigatório"),
  organizer: z.string().min(1, "O organizador é obrigatório"),
  price: z
    .number()
    .min(0, "O preço não pode ser negativo")
    .optional(),
});

export type EventSuggestionFormValues = z.infer<typeof eventSuggestionSchema>;