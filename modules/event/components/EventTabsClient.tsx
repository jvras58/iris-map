"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock } from "lucide-react";
import { EventSuggestion } from "@/types/event";
import EventCard from "./EventCard";
import { Card, CardContent } from "@/components/ui/card";

interface EventTabsClientProps {
  events: EventSuggestion[];
}

export default function EventTabsClient({ events }: EventTabsClientProps) {
  const now = new Date();
  const upcomingEvents = events.filter((event) => new Date(event.date) >= now);
  const pastEvents = events.filter((event) => new Date(event.date) < now);

  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
        <TabsTrigger value="upcoming" className="flex items-center space-x-2">
          <Calendar size={16} />
          <span>Próximos ({upcomingEvents.length})</span>
        </TabsTrigger>
        <TabsTrigger value="past" className="flex items-center space-x-2">
          <Clock size={16} />
          <span>Anteriores ({pastEvents.length})</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming">
        {upcomingEvents.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum evento próximo</h3>
              <p className="text-muted-foreground">Não há eventos programados no momento.</p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="past">
        {pastEvents.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum evento anterior</h3>
              <p className="text-muted-foreground">Não há eventos anteriores para exibir.</p>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
}