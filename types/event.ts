import { EventCategory, EventSuggestionStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface EventSuggestion {
  id: string;
  title: string;
  categoryId: string;
  description: string | null;
  date: Date;
  time: string | null;
  location: string;
  organizer: string;
  price: number | null;
  status: EventSuggestionStatus;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
  lgbtqFriendly: boolean;
  tags: string[];
  category: EventCategory;
  user?: {
    name: string | null;
    email: string;
  } | null;
}

// Tipo para o retorno direto do Prisma
export interface EventSuggestionRaw {
  id: string;
  title: string;
  categoryId: string;
  description: string | null;
  date: Date;
  time: string | null;
  location: string;
  organizer: string;
  price: Decimal | null;
  status: EventSuggestionStatus;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
  lgbtqFriendly: boolean;
  tags: string;
  category: EventCategory;
  user?: {
    name: string | null;
    email: string;
  } | null;
}

export interface CreateEventSuggestionData {
  title: string;
  categoryId: string;
  description?: string;
  date: string; // ISO date string from form
  time?: string;
  location: string;
  organizer: string;
  price?: number;
  lgbtqFriendly?: boolean;
  tags?: string[];
}

export interface EventSuggestionResult {
  success: boolean;
  data?: EventSuggestion;
  error?: {
    message: string;
    details?: string;
  };
}

export interface EventListResult {
  success: boolean;
  data?: EventSuggestion[];
  error?: {
    message: string;
    details?: string;
  };
}