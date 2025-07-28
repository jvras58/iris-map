"use client";

import { Location } from "../actions/mockData";
import { useState, useRef, useCallback } from "react";
import Map from "@/modules/map/components/Map";
import LocationUserComponent from "@/modules/map/components/LocationUserMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Plus, Calendar, Users, Navigation } from "lucide-react";
import FilterPanel from "./FilterPanel";

interface MapClientProps {
  locations: Location[];
}

export default function MapClient({ locations }: MapClientProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [actualUserLocation, setActualUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showLgbtqOnly, setShowLgbtqOnly] = useState(false);
  const [showSafeOnly, setShowSafeOnly] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [locationPermission, setLocationPermission] = useState<"pending" | "granted" | "denied">("pending");
  const mapRef = useRef<any>(null);

  const handleLocationChange = useCallback(
    (location: { lat: number; lng: number } | null) => {
      if (
        location &&
        userLocation &&
        location.lat === userLocation.lat &&
        location.lng === userLocation.lng
      ) {
        return;
      }

      setUserLocation(location);
      setIsLoadingLocation(false);

      if (location && !(location.lat === -23.5505 && location.lng === -46.6333)) {
        setActualUserLocation(location);
        setLocationPermission("granted");
      } else {
        setLocationPermission("denied");
      }
    },
    [userLocation]
  );

  const handleCenterOnUser = useCallback(() => {
    if (actualUserLocation && mapRef.current) {
      mapRef.current.setView([actualUserLocation.lat, actualUserLocation.lng], 15, {
        animate: true,
        duration: 1,
      });
    }
  }, [actualUserLocation]);

  const filteredLocations = locations.filter((location) => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(location.category);
    const lgbtqiaMatch = !showLgbtqOnly || location.lgbtqOwned;
    const safetyMatch = !showSafeOnly || location.safetyRating === "safe";
    return categoryMatch && lgbtqiaMatch && safetyMatch;
  });

  const categories = ["Restaurantes", "Bares", "Hospedagem", "Saúde", "Educação", "Entretenimento", "Serviços"];
  const categoryStats = categories.reduce((acc, category) => {
    acc[category] = filteredLocations.filter((loc) => loc.category === category).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <LocationUserComponent
        onLocationChange={handleLocationChange}
        defaultLocation={{ lat: -23.5505, lng: -46.6333 }}
        autoRequest={true}
        showFloatingButton={true}
        showBanner={false}
        onCenterOnUser={handleCenterOnUser}
      />

      {locationPermission === "pending" && (
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Navigation className="h-5 w-5 text-primary" />
              <span className="text-primary/80">Solicitando permissão para acessar sua localização...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {locationPermission === "denied" && (
        <Card className="mb-6 border-destructive/20 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Navigation className="h-5 w-5 text-destructive" />
                <span className="text-destructive/80">
                  Permissão de localização negada. Para uma melhor experiência, permita o acesso à localização.
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.geolocation.getCurrentPosition(
                  (pos) => handleLocationChange({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                  () => setLocationPermission("denied")
                )}
                className="text-destructive border-destructive/30"
              >
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <FilterPanel
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
            showLgbtqOnly={showLgbtqOnly}
            onLgbtqOnlyChange={setShowLgbtqOnly}
            showSafeOnly={showSafeOnly}
            onSafeOnlyChange={setShowSafeOnly}
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resultados da Busca</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-2xl font-bold text-primary">
                {filteredLocations.length} locais encontrados
              </div>

              {actualUserLocation && (
                <div className="text-sm text-chart-4 flex items-center gap-2">
                  <Navigation className="h-4 w-4" />
                  <span>Sua localização detectada</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCenterOnUser}
                    className="text-chart-4 hover:text-chart-4/80 p-1 h-auto"
                  >
                    📍 Centralizar
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                {Object.entries(categoryStats).map(([category, count]) =>
                  count > 0 && (
                    <div key={category} className="flex justify-between text-sm">
                      <span>{category}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  )
                )}
              </div>

              <div className="space-y-2 pt-4">
                <Link href="/sugerir">
                  <Button className="w-full" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Sugerir Local
                  </Button>
                </Link>
                <Link href="/suggest">
                  <Button variant="outline" className="w-full" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Sugerir Evento
                  </Button>
                </Link>
                <Link href="/eventos">
                  <Button variant="outline" className="w-full" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Ver Eventos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] overflow-hidden sticky top-8">
            <CardContent className="p-0 h-full">
              <div className="w-full h-full relative">
                <Map
                  ref={mapRef}
                  locations={filteredLocations}
                  selectedCategories={selectedCategories}
                  userLocation={userLocation}
                  isLoadingLocation={isLoadingLocation}
                  onLocationSelect={setSelectedLocation}
                />

                {/* Location Details Modal - Inside Map Container */}
                {selectedLocation && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-[1000]">
                    <div className="w-full max-w-md bg-background rounded-lg border shadow-lg">
                      <div className="flex items-center justify-between p-6 pb-0">
                        <h2 className="text-lg font-semibold leading-none tracking-tight">
                          {selectedLocation.name}
                        </h2>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedLocation(null)}
                          className="h-6 w-6 p-0"
                        >
                          ×
                        </Button>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {selectedLocation.tags?.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Avaliações</h4>
                          <div className="text-sm text-muted-foreground">
                            Avaliação de segurança: {selectedLocation.safetyRating}
                          </div>
                          <div className="text-sm text-muted-foreground mt-2">
                            {selectedLocation.description}
                          </div>
                        </div>
                        {selectedLocation.lgbtqOwned && (
                          <div className="bg-primary/5 p-3 rounded-lg">
                            <div className="text-sm text-primary">
                              🏳️‍🌈 Estabelecimento LGBTQIA+ friendly
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}