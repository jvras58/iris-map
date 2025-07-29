import { prisma } from "@/lib/prisma";
import { EventCategory } from "@prisma/client";
import { CreateLocationSuggestionInput } from "../schemas/location-suggestion-schema";

export interface LocationSuggestion {
  id: string;
  name: string;
  category: EventCategory;
  user?: { name: string | null; email: string | null };
  address: string;
  description: string | null;
  safetyRating: string;
  lgbtqOwned: boolean;
  phone: string | null;
  website: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LocationSuggestionResult {
  success: boolean;
  data?: LocationSuggestion;
  error?: { message: string; details?: string };
}

export interface LocationListResult {
  success: boolean;
  data?: LocationSuggestion[];
  error?: { message: string; details?: string };
}

export class LocationService {
  // Helper to parse JSON tags
  private static parseTags(tagsJson: string): string[] {
    try {
      const parsed = JSON.parse(tagsJson);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  // Helper to stringify tags
  private static stringifyTags(tags: string[]): string {
    return JSON.stringify(tags || []);
  }

  // Helper to convert Prisma data to app format
  private static convertLocationSuggestion(rawLocation: any): LocationSuggestion {
    return {
      ...rawLocation,
      tags: this.parseTags(rawLocation.tags || "[]"),
      lgbtqOwned: rawLocation.lgbtqOwned ?? false,
    };
  }

  // Get all categories
  static async getCategories(): Promise<EventCategory[]> {
    try {
      return await prisma.eventCategory.findMany({
        orderBy: { label: "asc" },
      });
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      return [];
    }
  }

  // Create a new location suggestion
  static async createLocationSuggestion(
    data: CreateLocationSuggestionInput,
    userId?: string
  ): Promise<LocationSuggestionResult> {
    try {
      // Verify category exists
      const categoryExists = await prisma.eventCategory.findUnique({
        where: { id: data.categoryId },
      });
      if (!categoryExists) {
        return {
          success: false,
          error: { message: "Categoria não encontrada" },
        };
      }

      const createData = {
        name: data.name,
        categoryId: data.categoryId,
        address: data.address,
        description: data.description,
        phone: data.phone,
        website: data.website,
        lgbtqOwned: data.lgbtqOwned,
        safetyRating: data.safetyRating,
        userId: userId || null,
        tags: this.stringifyTags(data.tags),
      };

      const rawLocation = await prisma.location.create({
        data: createData,
        include: {
          category: true,
          User: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      const location = this.convertLocationSuggestion(rawLocation);

      return {
        success: true,
        data: location,
      };
    } catch (error) {
      console.error("Erro ao criar sugestão de local:", error);
      return {
        success: false,
        error: {
          message: "Erro ao criar sugestão de local",
          details: error instanceof Error ? error.message : "Erro desconhecido",
        },
      };
    }
  }

  // Get user location suggestions
  static async getUserLocationSuggestions(userId: string): Promise<LocationListResult> {
    try {
      const rawLocations = await prisma.location.findMany({
        where: { userId },
        include: {
          category: true,
          User: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      const locations = rawLocations.map((raw) => this.convertLocationSuggestion(raw));

      return {
        success: true,
        data: locations,
      };
    } catch (error) {
      console.error("Erro ao buscar sugestões do usuário:", error);
      return {
        success: false,
        error: {
          message: "Erro ao buscar suas sugestões",
          details: error instanceof Error ? error.message : "Erro desconhecido",
        },
      };
    }
  }

  // Get all locations (no status filter, as Location has no status)
  static async getApprovedLocations(): Promise<LocationListResult> {
    try {
      const rawLocations = await prisma.location.findMany({
        include: {
          category: true,
          User: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      });

      const locations = rawLocations.map((raw) => this.convertLocationSuggestion(raw));

      return {
        success: true,
        data: locations,
      };
    } catch (error) {
      console.error("Erro ao buscar locais:", error);
      return {
        success: false,
        error: {
          message: "Erro ao buscar locais",
          details: error instanceof Error ? error.message : "Erro desconhecido",
        },
      };
    }
  }
}