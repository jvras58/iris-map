import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  locationSuggestionSchema,
  LocationSuggestionFormValues,
} from "../schemas/location-suggestion-schema";
import { createLocationSuggestion } from "../actions/location";
import { EventCategory } from "@prisma/client";

interface UseLocationSuggestionFormProps {
  categories: EventCategory[];
  onSuccess?: () => void;
}

export function useLocationSuggestionForm({ categories, onSuccess }: UseLocationSuggestionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<LocationSuggestionFormValues>({
    resolver: zodResolver(locationSuggestionSchema),
    defaultValues: {
      name: "",
      category: "",
      address: "",
      description: "",
      phone: "",
      website: "",
      lgbtqOwned: false,
      safetyRating: "safe",
      publicVisible: true,
      tags: [],
    },
  } as any); // [REFACTOR] Ajustar o tipo de form para evitar any

  const handleSubmit = async (data: LocationSuggestionFormValues) => {
    setIsSubmitting(true);

    try {
      const result = await createLocationSuggestion(data);

      if (result.success) {
        toast.success("Sugestão enviada com sucesso!", {
          description: "Sua sugestão será analisada em breve.",
        });

        form.reset();

        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/map");
        }
      } else {
        toast.error("Erro ao enviar sugestão", {
          description: result.error?.message || "Tente novamente mais tarde.",
        });
      }
    } catch (error) {
      toast.error("Erro inesperado", {
        description: "Ocorreu um erro inesperado. Tente novamente.",
      });
      console.error("Erro no submit:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    form.reset();
  };

  const formatCategoriesForSelect = () => {
    return categories.map((category) => [category.id, category.label] as [string, string]);
  };

  const addTag = (tag: string) => {
    const currentTags = form.getValues("tags") || [];
    if (tag.trim() && !currentTags.includes(tag.trim())) {
      form.setValue("tags", [...currentTags, tag.trim()]);
    }
  };

  const removeTag = (index: number) => {
    const currentTags = form.getValues("tags") || [];
    const newTags = currentTags.filter((_, i) => i !== index);
    form.setValue("tags", newTags);
  };

  return {
    form,
    isSubmitting,
    handleSubmit,
    handleReset,
    formatCategoriesForSelect,
    addTag,
    removeTag,
  };
}