"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { LocationService } from "@/modules/event/service/location";
import {
  locationSuggestionSchema,
  createLocationSuggestionSchema,
  LocationSuggestionFormValues,
} from "@/modules/event/schemas/location-suggestion-schema";
import { LocationListResult, LocationSuggestionResult } from "../service/location";


export async function createLocationSuggestion(
  data: LocationSuggestionFormValues
): Promise<LocationSuggestionResult> {
  try {
    // Validate input data
    const validatedData = locationSuggestionSchema.parse(data);

    // Check authentication (optional)
    const session = await auth();

    // Transform data for database
    const transformedData = createLocationSuggestionSchema.parse(validatedData);

    // Create suggestion
    const result = await LocationService.createLocationSuggestion(
      transformedData,
      session?.user?.id
    );

    if (result.success) {
      revalidatePath("/map");
      revalidatePath("/suggest");
    }

    return result;
  } catch (error) {
    console.error("Erro na action createLocationSuggestion:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return {
        success: false,
        error: { message: "Dados inválidos fornecidos" },
      };
    }

    return {
      success: false,
      error: { message: "Erro interno do servidor" },
    };
  }
}

export async function getUserLocationSuggestions(): Promise<LocationListResult> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: { message: "Usuário não autenticado" },
      };
    }

    return await LocationService.getUserLocationSuggestions(session.user.id);
  } catch (error) {
    console.error("Erro ao buscar sugestões do usuário:", error);
    return {
      success: false,
      error: { message: "Erro interno do servidor" },
    };
  }
}

export async function getApprovedLocations(): Promise<LocationListResult> {
  try {
    return await LocationService.getApprovedLocations();
  } catch (error) {
    console.error("Erro ao buscar locais aprovados:", error);
    return {
      success: false,
      error: { message: "Erro interno do servidor" },
    };
  }
}

export async function createLocationSuggestionAndRedirect(
  data: LocationSuggestionFormValues
) {
  const result = await createLocationSuggestion(data);

  if (result.success) {
    redirect("/map?");
  }

  return result;
}