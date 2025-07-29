'use server';

import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { EventService } from '@/modules/event/service/event';
import { 
  eventSuggestionSchema, 
  createEventSuggestionSchema,
  EventSuggestionFormValues 
} from '@/modules/event/schemas/event-suggestion-schema';
import { EventSuggestionResult } from '@/types/event';

export async function createEventSuggestion(
  data: EventSuggestionFormValues
): Promise<EventSuggestionResult> {
  try {
    // Validar dados de entrada
    const validatedData = eventSuggestionSchema.parse(data);
    
    // Verificar se usuário está autenticado (opcional)
    const session = await auth();
    
    // Transformar dados para o formato do banco
    const transformedData = createEventSuggestionSchema.parse(validatedData);
    
    // Criar sugestão
    const result = await EventService.createEventSuggestion(
      transformedData,
      session?.user?.id
    );
    
    if (result.success) {
      revalidatePath('/events');
      revalidatePath('/events/suggest');
    }
    
    return result;
  } catch (error) {
    console.error('Erro na action createEventSuggestion:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return {
        success: false,
        error: { message: 'Dados inválidos fornecidos' }
      };
    }
    
    return {
      success: false,
      error: { message: 'Erro interno do servidor' }
    };
  }
}

export async function getUserEventSuggestions() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: { message: 'Usuário não autenticado' }
      };
    }
    
    return await EventService.getUserEventSuggestions(session.user.id);
  } catch (error) {
    console.error('Erro ao buscar sugestões do usuário:', error);
    return {
      success: false,
      error: { message: 'Erro interno do servidor' }
    };
  }
}

export async function getApprovedEvents() {
  try {
    return await EventService.getApprovedEventSuggestions();
  } catch (error) {
    console.error('Erro ao buscar eventos aprovados:', error);
    return {
      success: false,
      error: { message: 'Erro interno do servidor' }
    };
  }
}

// Action para redirecionar após sucesso (opcional)
export async function createEventSuggestionAndRedirect(
  data: EventSuggestionFormValues
) {
  const result = await createEventSuggestion(data);
  
  if (result.success) {
    redirect('/events?success=true');
  }
  
  return result;
}