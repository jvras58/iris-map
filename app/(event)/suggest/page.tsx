
import { eventCategoryLabels } from "@/modules/event/actions/mockData";
import EventSuggestionForm from "@/modules/event/components/EventSuggestionForm";
import { Calendar } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sugerir Evento",
};


export default function SuggestEventPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Sugerir Evento</h1>
          </div>
          <EventSuggestionForm categories={Object.entries(eventCategoryLabels)} />
        </div>
      </div>
    </div>
  );
}