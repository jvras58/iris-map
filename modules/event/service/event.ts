import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { 
  EventSuggestion, 
  EventSuggestionRaw,
  CreateEventSuggestionData,
  EventSuggestionResult,
  EventListResult 
} from "@/types/event";
import { CreateEventSuggestionInput } from "@/modules/event/schemas/event-suggestion-schema";
import { EventSuggestionStatus, EventCategory  } from "@prisma/client";

export class EventService {
  // Função helper para converter Decimal para number
  private static convertDecimalToNumber(decimal: Decimal | null): number | null {
    if (decimal === null) return null;
    return decimal.toNumber();
  }

  // Função helper para converter tags JSON string para array
  private static parseTags(tagsJson: string): string[] {
    try {
      const parsed = JSON.parse(tagsJson);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  // Função helper para converter array de tags para JSON string
  private static stringifyTags(tags: string[]): string {
    return JSON.stringify(tags || []);
  }

  // Função helper para converter dados do Prisma para o formato da aplicação
  private static convertEventSuggestion(rawEvent: any): EventSuggestion {
    return {
      ...rawEvent,
      price: this.convertDecimalToNumber(rawEvent.price),
      // Converter tags de JSON string para array
      tags: this.parseTags(rawEvent.tags || "[]"),
      // Garantir que lgbtqFriendly tenha um valor padrão
      lgbtqFriendly: rawEvent.lgbtqFriendly ?? true
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

      // Preparar dados para criação
      const createData = {
        title: data.title,
        categoryId: data.categoryId,
        description: data.description || null,
        date: data.date,
        time: data.time || null,
        location: data.location,
        organizer: data.organizer,
        price: data.price || null,
        userId: userId || null,
        lgbtqFriendly: data.lgbtqFriendly ?? true,
        tags: this.stringifyTags(data.tags || []) // Converter array para JSON string
      };

      const rawEventSuggestion = await prisma.eventSuggestion.create({
        data: createData,
        include: {
          category: true,
          user: {
            select: {
              name: true,
              email: true,
            }
          }
        }
      });

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
      });

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
      });

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
      });

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
      });

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

  // Método adicional: Buscar eventos por filtros
  static async getFilteredEventSuggestions(filters: {
    categoryKey?: string;
    lgbtqFriendly?: boolean;
    tags?: string[];
  }): Promise<EventListResult> {
    try {
      const where: any = { status: EventSuggestionStatus.APPROVED };

      if (filters.categoryKey && filters.categoryKey !== 'all') {
        where.category = { key: filters.categoryKey };
      }

      if (filters.lgbtqFriendly !== undefined) {
        where.lgbtqFriendly = filters.lgbtqFriendly;
      }

      // Para filtrar por tags no SQLite, precisamos usar LIKE
      if (filters.tags && filters.tags.length > 0) {
        const tagConditions = filters.tags.map(tag => ({
          tags: { contains: `"${tag}"` }
        }));
        where.OR = tagConditions;
      }

      const rawSuggestions = await prisma.eventSuggestion.findMany({
        where,
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
      });

      const suggestions = rawSuggestions.map(raw => this.convertEventSuggestion(raw));

      return {
        success: true,
        data: suggestions
      };
    } catch (error) {
      console.error('Erro ao buscar eventos filtrados:', error);
      return {
        success: false,
        error: {
          message: 'Erro ao buscar eventos',
          details: error instanceof Error ? error.message : 'Erro desconhecido'
        }
      };
    }
  }
}