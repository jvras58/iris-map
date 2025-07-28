import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, Tag, Heart } from "lucide-react";
import { Event, eventCategoryLabels } from "../actions/mockData";

interface EventCardProps {
  event: Event;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-glow transition-all duration-300 animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg leading-tight">
              {event.title}
              {event.lgbtqFriendly && <span className="ml-2 text-love-pink">🏳️‍🌈</span>}
            </CardTitle>
            <Badge variant="secondary" className="w-fit">
              {eventCategoryLabels[event.category]}
            </Badge>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            {event.price === 0 ? (
              <Badge
                variant="outline"
                className="bg-safe-green/10 text-safe-green border-safe-green/30"
              >
                Gratuito
              </Badge>
            ) : (
              <span className="font-medium">R$ {event.price}</span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4 text-primary" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4 text-primary" />
            <span>
              {event.startTime} - {event.endTime}
            </span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4 text-primary" />
            <div>
              <div className="font-medium">{event.location}</div>
              <div className="text-xs">{event.address}</div>
            </div>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="mr-2 h-4 w-4 text-primary" />
            <span>Organizado por {event.organizer}</span>
          </div>
        </div>

        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {event.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                <Tag className="mr-1 h-3 w-3" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button className="flex-1" size="sm">
            <Heart className="mr-1 h-4 w-4" />
            Interessado
          </Button>
          <Button variant="outline" size="sm">
            <MapPin className="mr-1 h-4 w-4" />
            Ver no Mapa
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}