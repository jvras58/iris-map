import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, Heart, DollarSign, Shield } from "lucide-react";
import { EventSuggestion } from "@/types/event";

interface EventCardProps {
  event: EventSuggestion;
}

function formatDate(date: Date) {
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
            <CardTitle className="text-lg leading-tight flex items-center">
              {event.title}
              <span className="ml-2 text-love-pink">🏳️‍🌈</span>
              {event.lgbtqFriendly && (
                <Shield className="ml-2 h-4 w-4 text-safe-green" />
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="w-fit">
                {event.category.label}
              </Badge>
              {event.lgbtqFriendly && (
                <Badge variant="outline" className="bg-safe-green/10 text-safe-green border-safe-green/30">
                  LGBTQ+ Friendly
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            {event.price === null || event.price === 0 ? (
              <Badge
                variant="outline"
                className="bg-safe-green/10 text-safe-green border-safe-green/30"
              >
                Gratuito
              </Badge>
            ) : (
              <span className="font-medium">R$ {event.price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {event.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {event.description}
          </p>
        )}

        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4 text-primary" />
            <span>{formatDate(event.date)}</span>
          </div>
          
          {event.time && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-2 h-4 w-4 text-primary" />
              <span>{event.time}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4 text-primary" />
            <div>
              <div className="font-medium">{event.location}</div>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="mr-2 h-4 w-4 text-primary" />
            <span>Organizado por {event.organizer}</span>
          </div>

          {event.price !== null && event.price > 0 && (
            <div className="flex items-center text-sm text-muted-foreground">
              <DollarSign className="mr-2 h-4 w-4 text-primary" />
              <span>R$ {event.price.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {event.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
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