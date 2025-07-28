import { z } from "zod";

export const locationSuggestionSchema = z.object({
  name: z.string().min(1, "O nome do local é obrigatório"),
  category: z.string().min(1, "A categoria é obrigatória"),
  address: z.string().min(1, "O endereço é obrigatório"),
  description: z.string().optional(),
  phone: z.string().optional(),
  website: z
    .url("O website deve ser uma URL válida")
    .optional(),
  lgbtqOwned: z.boolean(),
  safetyRating: z.enum(["safe", "neutral", "unsafe"]),
  publicVisible: z.boolean(),
  tags: z.array(z.string()),
});

export type LocationSuggestionFormValues = z.infer<typeof locationSuggestionSchema>;