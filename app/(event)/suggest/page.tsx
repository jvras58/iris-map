
import EventSuggestionForm from "@/modules/event/components/EventSuggestionForm";
import { EventService } from "@/modules/event/service/event";
import { Calendar } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sugerir Evento",
};


export default async function SuggestEventPage() {
  const categories = await EventService.getCategories();

  if (categories.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">
            Erro ao carregar categorias de eventos
          </p>
          <p className="text-sm text-gray-500">
            Tente novamente mais tarde
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Sugerir Evento</h1>
          </div>
          <EventSuggestionForm categories={categories} />
        </div>
      </div>
    </div>
  );
}