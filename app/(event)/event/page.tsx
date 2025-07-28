import { mockEvents, eventCategoryLabels } from "@/modules/event/actions/mockData";
import EventFilter from "@/modules/event/components/EventFilter";
import EventTabsClient from "@/modules/event/components/EventTabsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eventos",
};

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;
  const selectedCategory = params.category || "all";
  const filteredEvents =
    selectedCategory === "all"
      ? mockEvents
      : mockEvents.filter((event) => event.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 bg-rainbow-gradient bg-clip-text text-transparent animate-rainbow-shift bg-[length:200%_200%]">
            Eventos LGBTQIA+
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubra eventos inclusivos, celebrações da diversidade e encontros da comunidade.
          </p>
        </div>

        {/* Category Filter */}
        <EventFilter selectedCategory={selectedCategory} categories={Object.keys(eventCategoryLabels)} />

        {/* Event Tabs */}
        <EventTabsClient events={filteredEvents} />
      </div>
    </div>
  );
}