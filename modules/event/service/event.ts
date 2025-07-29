import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { 
  EventSuggestion, 
  EventSuggestionRaw,
  EventCategory, 
  CreateEventSuggestionData,
  EventSuggestionResult,
  EventListResult 
} from "@/types/event";
import { CreateEventSuggestionInput } from "@/modules/event/schemas/event-suggestion-schema";
import { EventSuggestionStatus } from "@prisma/client";

export class EventService {
  // Função helper para converter Decimal para number
  private static convertDecimalToNumber(decimal: Decimal | null): number | null {
    if (decimal === null) return null;
    return decimal.toNumber();
  }

  // Função helper para converter dados do Prisma para o formato da aplicação
  private static convertEventSuggestion(rawEvent: EventSuggestionRaw): EventSuggestion {
    return {
      ...rawEvent,
      price: this.convertDecimalToNumber(rawEvent.price),
    };
  }

  // Buscar todas as categorias
  static async getCategories(): Promise<EventCategory[]> {
    try {
      const categories = await prisma.eventCategory.findMany({
        orderBy: { label: 'asc' }
      });
      return categories;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }
  }

  // Criar nova sugestão de evento
  static async createEventSuggestion(
    data: CreateEventSuggestionInput,
    userId?: string
  ): Promise<EventSuggestionResult> {
    try {
      // Verificar se a categoria existe
      const categoryExists = await prisma.eventCategory.findUnique({
        where: { id: data.categoryId }
      });

      if (!categoryExists) {
        return {
          success: false,
          error: { message: 'Categoria não encontrada' }
        };
      }

      const rawEventSuggestion = await prisma.eventSuggestion.create({
        data: {
          ...data,
          userId: userId || null,
        },
        include: {
          category: true,
          user: {
            select: {
              name: true,
              email: true,
            }
          }
        }
      }) as EventSuggestionRaw;

      const eventSuggestion = this.convertEventSuggestion(rawEventSuggestion);

      return {
        success: true,
        data: eventSuggestion
      };
    } catch (error) {
      console.error('Erro ao criar sugestão de evento:', error);
      return {
        success: false,
        error: {
          message: 'Erro ao criar sugestão de evento',
          details: error instanceof Error ? error.message : 'Erro desconhecido'
        }
      };
    }
  }

  // Buscar sugestões do usuário
  static async getUserEventSuggestions(userId: string): Promise<EventListResult> {
    try {
      const rawSuggestions = await prisma.eventSuggestion.findMany({
        where: { userId },
        include: {
          category: true,
          user: {
            select: {
              name: true,
              email: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }) as EventSuggestionRaw[];

      const suggestions = rawSuggestions.map(raw => this.convertEventSuggestion(raw));

      return {
        success: true,
        data: suggestions
      };
    } catch (error) {
      console.error('Erro ao buscar sugestões do usuário:', error);
      return {
        success: false,
        error: {
          message: 'Erro ao buscar suas sugestões',
          details: error instanceof Error ? error.message : 'Erro desconhecido'
        }
      };
    }
  }

  // Buscar todas as sugestões aprovadas (para listagem pública)
  static async getApprovedEventSuggestions(): Promise<EventListResult> {
    try {
      const rawSuggestions = await prisma.eventSuggestion.findMany({
        where: { status: EventSuggestionStatus.APPROVED },
        include: {
          category: true,
          user: {
            select: {
              name: true,
              email: true,
            }
          }
        },
        orderBy: { date: 'asc' }
      }) as EventSuggestionRaw[];

      const suggestions = rawSuggestions.map(raw => this.convertEventSuggestion(raw));

      return {
        success: true,
        data: suggestions
      };
    } catch (error) {
      console.error('Erro ao buscar eventos aprovados:', error);
      return {
        success: false,
        error: {
          message: 'Erro ao buscar eventos',
          details: error instanceof Error ? error.message : 'Erro desconhecido'
        }
      };
    }
  }

  // Buscar sugestão por ID
  static async getEventSuggestionById(id: string): Promise<EventSuggestionResult> {
    try {
      const rawSuggestion = await prisma.eventSuggestion.findUnique({
        where: { id },
        include: {
          category: true,
          user: {
            select: {
              name: true,
              email: true,
            }
          }
        }
      }) as EventSuggestionRaw | null;

      if (!rawSuggestion) {
        return {
          success: false,
          error: { message: 'Sugestão não encontrada' }
        };
      }

      const suggestion = this.convertEventSuggestion(rawSuggestion);

      return {
        success: true,
        data: suggestion
      };
    } catch (error) {
      console.error('Erro ao buscar sugestão:', error);
      return {
        success: false,
        error: {
          message: 'Erro ao buscar sugestão',
          details: error instanceof Error ? error.message : 'Erro desconhecido'
        }
      };
    }
  }

  // Atualizar status da sugestão (para admin)
  static async updateEventSuggestionStatus(
    id: string,
    status: EventSuggestionStatus
  ): Promise<EventSuggestionResult> {
    try {
      const rawSuggestion = await prisma.eventSuggestion.update({
        where: { id },
        data: { status },
        include: {
          category: true,
          user: {
            select: {
              name: true,
              email: true,
            }
          }
        }
      }) as EventSuggestionRaw;

      const suggestion = this.convertEventSuggestion(rawSuggestion);

      return {
        success: true,
        data: suggestion
      };
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      return {
        success: false,
        error: {
          message: 'Erro ao atualizar status',
          details: error instanceof Error ? error.message : 'Erro desconhecido'
        }
      };
    }
  }
}