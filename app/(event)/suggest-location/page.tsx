import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { categoryLabels } from "@/modules/event/actions/mockData";
import LocationSuggestionForm from "@/modules/event/components/LocationSuggestionForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sugerir Local",
};

export default function SuggestLocationPage() {
  const popularTags = [
    "pet-friendly",
    "wifi",
    "estacionamento",
    "acessível",
    "eventos",
    "karaoke",
    "drag-show",
    "musica-ao-vivo",
    "comida-vegana",
    "bebidas-especiais",
    "arte",
    "workshops",
    "terapia",
    "grupo-apoio",
    "consultoria",
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 bg-rainbow-gradient bg-clip-text text-transparent animate-rainbow-shift bg-[length:200%_200%]">
            Sugerir Local Seguro
          </h1>
          <p className="text-lg text-muted-foreground">
            Ajude a construir uma rede de espaços seguros e acolhedores para nossa comunidade.
          </p>
        </div>

        <LocationSuggestionForm categories={Object.entries(categoryLabels)} popularTags={popularTags} />

        {/* Info Card */}
        <Card className="mt-6 bg-accent/50 border-accent animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Sparkles className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Sua contribuição é valiosa!</p>
                <p>
                  Todas as sugestões são revisadas por nossa equipe para garantir a qualidade e
                  segurança das informações. Agradecemos por ajudar a construir uma comunidade mais
                  inclusiva.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}