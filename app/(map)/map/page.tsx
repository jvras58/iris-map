import { mockLocations } from "@/modules/map/actions/mockData";
import MapClient from "@/modules/map/components/MapClient";
import { MapPin } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mapa de Locais Seguros",
};

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <MapPin className="h-8 w-8 text-purple-600" />
          <h1 className="text-4xl font-bold text-foreground">Mapa de Locais Seguros</h1>
        </div>
        <MapClient locations={mockLocations} />
      </div>
    </div>
  );
}