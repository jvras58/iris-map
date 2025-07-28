"use client";

import { useState, useRef } from "react";
import { mockLocations } from "@/modules/map/actions/mockData";
import Map from "@/modules/map/components/Map";
import LocationUserComponent from "@/modules/map/components/LocationUserMap";

export default function MapPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [actualUserLocation, setActualUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<any>(null);

  const handleLocationChange = (location: { lat: number; lng: number } | null) => {
    setUserLocation(location);
    setIsLoadingLocation(false);

    if (location && !(location.lat === -23.5505 && location.lng === -46.6333)) {
      setActualUserLocation(location);
    }
  };

  // Função para centralizar o mapa na localização REAL do usuário
  const handleCenterOnUser = () => {
    if (actualUserLocation && mapRef.current) {
      mapRef.current.setView([actualUserLocation.lat, actualUserLocation.lng], 15, {
        animate: true,
        duration: 1,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Componente de localização do usuário */}
      <LocationUserComponent
        onLocationChange={handleLocationChange}
        defaultLocation={{ lat: -23.5505, lng: -46.6333 }}
        autoRequest={true}
        showFloatingButton={true}
        showBanner={true}
        onCenterOnUser={handleCenterOnUser}
      />

      {/* Componente do mapa */}
      <Map
        ref={mapRef}
        locations={mockLocations}
        selectedCategories={[]}
        userLocation={userLocation}
        isLoadingLocation={isLoadingLocation}
      />
    </div>
  );
}