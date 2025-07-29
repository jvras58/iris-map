import { z } from "zod";

export const locationSuggestionSchema = z.object({
  name: z
    .string()
    .min(3, "O nome do local deve ter pelo menos 3 caracteres")
    .max(200, "O nome do local deve ter no máximo 200 caracteres")
    .trim(),
  category: z.string().min(1, "A categoria é obrigatória"),
  address: z
    .string()
    .min(3, "O endereço deve ter pelo menos 3 caracteres")
    .max(200, "O endereço deve ter no máximo 200 caracteres")
    .trim(),
  description: z
    .string()
    .max(1000, "A descrição deve ter no máximo 1000 caracteres")
    .trim()
    .optional(),
  phone: z
    .string()
    .regex(/^(\(?0?[1-9]{2}\)?)?\s?[0-9]{8,9}$/, "Formato de telefone inválido")
    .optional()
    .or(z.literal("")),
  website: z
    .url("O website deve ser uma URL válida")
    .optional()
    .or(z.literal("")),
  lgbtqOwned: z.boolean().default(false),
  safetyRating: z.enum(["safe", "neutral", "unsafe"]),
  publicVisible: z.boolean().default(true),
  tags: z
    .array(z.string().trim().min(1, "Tag não pode estar vazia"))
    .max(10, "Máximo de 10 tags permitidas")
    .transform((tags) => tags.filter((tag) => tag.length > 0)),
});

export const createLocationSuggestionSchema = locationSuggestionSchema.transform((data) => ({
  name: data.name,
  categoryId: data.category,
  address: data.address,
  description: data.description || null,
  phone: data.phone || null,
  website: data.website || null,
  lgbtqOwned: data.lgbtqOwned ?? false,
  safetyRating: data.safetyRating,
  tags: data.tags || [],
}));

export type LocationSuggestionFormValues = z.infer<typeof locationSuggestionSchema>;
export type CreateLocationSuggestionInput = z.infer<typeof createLocationSuggestionSchema>;