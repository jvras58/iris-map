"use client";

import { useState } from "react";
import { mockLocations } from "@/modules/map/actions/mockData";
import Map from "@/modules/map/components/Map";
import LocationUserComponent from "@/modules/map/components/LocationUserMap";

export default function MapPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleLocationChange = (location: { lat: number; lng: number } | null) => {
    setUserLocation(location);
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
      />

      {/* Componente do mapa */}
      <Map
        locations={mockLocations}
        selectedCategories={[]}
        userLocation={userLocation}
      />
    </div>
  );
}