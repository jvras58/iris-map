import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { 
  eventSuggestionSchema, 
  EventSuggestionFormValues 
} from '@/modules/event/schemas/event-suggestion-schema';
import { createEventSuggestion } from '@/modules/event/actions/event';
import { EventCategory } from '@/types/event';

interface UseEventSuggestionFormProps {
  categories: EventCategory[];
  onSuccess?: () => void;
}

export function useEventSuggestionForm({ 
  categories, 
  onSuccess 
}: UseEventSuggestionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<EventSuggestionFormValues>({
    resolver: zodResolver(eventSuggestionSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      date: "",
      time: "",
      location: "",
      organizer: "",
      price: undefined,
    },
  });

  const handleSubmit = async (data: EventSuggestionFormValues) => {
    setIsSubmitting(true);
    
    try {
      const result = await createEventSuggestion(data);
      
      if (result.success) {
        toast.success('Sugestão enviada com sucesso!', {
          description: 'Sua sugestão será analisada em breve.',
        });
        
        form.reset();
        
        if (onSuccess) {
          onSuccess();
        } else {
          // Redirect padrão para a lista de eventos
          router.push('/events?submitted=true');
        }
      } else {
        toast.error('Erro ao enviar sugestão', {
          description: result.error?.message || 'Tente novamente mais tarde.',
        });
      }
    } catch (error) {
      toast.error('Erro inesperado', {
        description: 'Ocorreu um erro inesperado. Tente novamente.',
      });
      console.error('Erro no submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    form.reset();
  };

  // Função para formatar categorias para o Select
  const formatCategoriesForSelect = () => {
    return categories.map(category => [category.id, category.label] as [string, string]);
  };

  // Função para validar data mínima
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return {
    form,
    isSubmitting,
    handleSubmit,
    handleReset,
    formatCategoriesForSelect,
    getMinDate,
  };
}