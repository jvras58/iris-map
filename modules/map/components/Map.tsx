"use client";

import { useEffect, useRef, useMemo, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { Location, categoryLabels } from "../actions/mockData";

// Import Leaflet types
import type { Map as LeafletMap, LayerGroup, Marker as LeafletMarker, DivIcon, LatLngTuple } from 'leaflet';

interface MapProps {
  locations: Location[];
  selectedCategories: string[];
  onLocationSelect?: (location: Location) => void;
  userLocation?: { lat: number; lng: number } | null;
  centerOnUser?: () => void;
  isLoadingLocation?: boolean;
}

export interface MapRef {
  setView: (center: [number, number], zoom: number, options?: any) => void;
}

const Map = forwardRef<MapRef, MapProps>(({ 
  locations, 
  selectedCategories, 
  onLocationSelect, 
  userLocation,
  isLoadingLocation = false 
}, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LayerGroup | null>(null);
  const userMarkerRef = useRef<LeafletMarker | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const hasInitializedLocation = useRef(false);
  const previousUserLocation = useRef<{ lat: number; lng: number } | null>(null);

  useImperativeHandle(ref, () => ({
    setView: (center: [number, number], zoom: number, options?: any) => {
      if (map.current) {
        map.current.setView(center, zoom, options);
      }
    }
  }), []);

  // Load Leaflet CSS and JS
  useEffect(() => {
    const loadLeaflet = async () => {
      // Inject Leaflet CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);
      }

      // Wait for CSS to load before initializing
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      // Dynamically import Leaflet
      const L = (await import('leaflet')).default;
      
      // Fix for default Leaflet markers
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      setLeafletLoaded(true);
    };

    loadLeaflet();
  }, []);

  // Initialize map only when we have user location or after timeout
  useEffect(() => {
    if (!leafletLoaded || !mapContainer.current || map.current) return;
    
    // Wait for user location or initialize with default after 3 seconds
    const shouldInitialize = userLocation || !isLoadingLocation;
    
    if (!shouldInitialize) return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      
      // Use user location as initial center, fallback to São Paulo if needed
      const initialCenter: LatLngTuple = userLocation 
        ? [userLocation.lat, userLocation.lng] 
        : [-23.5505, -46.6333];
      
      // Create map with proper options
      const leafletMap = L.map(mapContainer.current!, {
        center: initialCenter,
        zoom: userLocation ? 15 : 12, // Closer zoom if we have user location
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        dragging: true,
        touchZoom: true
      });
      
      map.current = leafletMap;

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(leafletMap);

      // Create a new LayerGroup for markers
      markersRef.current = L.layerGroup().addTo(leafletMap);

      // Wait for map to be fully initialized
      leafletMap.whenReady(() => {
        setIsMapReady(true);
        // Force a resize to ensure proper rendering
        setTimeout(() => {
          leafletMap.invalidateSize();
        }, 100);
      });
    };

    initMap();

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        setIsMapReady(false);
        hasInitializedLocation.current = false;
        previousUserLocation.current = null;
      }
    };
  }, [leafletLoaded, userLocation, isLoadingLocation]);

  // Function to calculate distance between two points (in meters)
  const calculateDistance = useCallback((lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lng2-lng1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }, []);

  // Update markers when locations or categories change
  useEffect(() => {
    if (!isMapReady || !map.current || !markersRef.current) return;

    const updateMarkers = async () => {
      const L = (await import('leaflet')).default;
      
      // Clear existing markers
      markersRef.current?.clearLayers();

      // Filter locations
      const filteredLocations = locations.filter(
        (location) => selectedCategories.length === 0 || selectedCategories.includes(location.category)
      );

      // Add markers
      filteredLocations.forEach((location) => {
        const icon = createCustomIcon(L, location.category, location.safetyRating, location.lgbtqOwned);

        const marker = L.marker([location.latitude, location.longitude], { icon })
          .bindPopup(createPopupContent(location))
          .on("click", () => {
            if (onLocationSelect) {
              onLocationSelect(location);
            }
          });

        markersRef.current?.addLayer(marker);
      });
    };

    updateMarkers();
  }, [isMapReady, locations, selectedCategories, onLocationSelect]);

  // Update user location marker
  useEffect(() => {
    if (!isMapReady || !map.current || !userLocation) return;

    const updateUserMarker = async () => {
      const L = (await import('leaflet')).default;
      
      // For the first initialization, we don't need to recenter since map was already centered on user
      if (!hasInitializedLocation.current) {
        hasInitializedLocation.current = true;
        previousUserLocation.current = { ...userLocation };
      } else {
        // Check if location changed significantly (more than 50 meters for better precision)
        const shouldRecenter = previousUserLocation.current &&
          calculateDistance(
            userLocation.lat, 
            userLocation.lng, 
            previousUserLocation.current.lat, 
            previousUserLocation.current.lng
          ) > 50;

        // Center map on user if significant distance change
        if (shouldRecenter) {
          map.current?.setView([userLocation.lat, userLocation.lng], 15);
        }

        // Update previous location reference
        previousUserLocation.current = { ...userLocation };
      }

      // Remove previous user marker
      if (userMarkerRef.current && map.current) {
        map.current.removeLayer(userMarkerRef.current);
      }

      // Create user icon with pulsing animation
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <!-- Pulsing ring -->
            <div style="
              position: absolute;
              background-color: rgba(59, 130, 246, 0.3);
              width: 40px;
              height: 40px;
              border-radius: 50%;
              animation: pulse 2s infinite;
            "></div>
            <!-- Main marker -->
            <div style="
              background-color: #3b82f6;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              border: 3px solid #ffffff;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
              z-index: 2;
            ">
              <div style="
                color: white;
                font-size: 10px;
                font-weight: bold;
              ">
                📍
              </div>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      // Add user marker
      if (map.current) {
        userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
          .bindPopup(`
            <div style="text-align: center; font-family: system-ui;">
              <strong>📍 Sua localização atual</strong>
              <br>
              <small style="color: #6b7280;">
                ${userLocation.lat.toFixed(6)}, ${userLocation.lng.toFixed(6)}
              </small>
            </div>
          `)
          .addTo(map.current);
      }
    };

    updateUserMarker();
  }, [isMapReady, userLocation, calculateDistance]);

  // Memoize custom icon creation
  const createCustomIcon = useMemo(
    () => (L: any, category: string, safetyRating: string, lgbtqOwned: boolean): DivIcon => {
      const color = getSafetyColor(safetyRating);
      const size = lgbtqOwned ? [30, 40] : [25, 35];

      return L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: ${color};
            width: ${size[0]}px;
            height: ${size[1]}px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid ${lgbtqOwned ? "#a855f7" : "#ffffff"};
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          ">
            <div style="
              transform: rotate(45deg);
              color: white;
              font-size: 12px;
              font-weight: bold;
            ">
              ${getCategoryIcon(category)}
            </div>
          </div>
        `,
        iconSize: [size[0], size[1]] as [number, number],
        iconAnchor: [size[0] / 2, size[1]] as [number, number],
        popupAnchor: [0, -size[1]] as [number, number],
      });
    },
    []
  );

  const getSafetyColor = (rating: string) => {
    switch (rating) {
      case "safe":
        return "#22c55e";
      case "unsafe":
        return "#ef4444";
      default:
        return "#f59e0b";
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      Restaurantes: "🍽️",
      Bares: "🍻",
      Hospedagem: "🏨",
      Saúde: "🏥",
      Educação: "📚",
      Entretenimento: "🎭",
      Serviços: "🔧",
    };
    return icons[category] || "📍";
  };

  const createPopupContent = (location: Location) => {
    const safetyIcon =
      location.safetyRating === "safe" ? "🛡️" : location.safetyRating === "unsafe" ? "⚠️" : "⚡";

    return `
      <div style="min-width: 200px; font-family: system-ui;">
        <h3 style="margin: 0 0 8px 0; color: #7c3aed; font-weight: bold;">
          ${location.name}
          ${location.lgbtqOwned ? " 🏳️‍🌈" : ""}
        </h3>
        <p style="margin: 4px 0; font-size: 14px; color: #6b7280;">
          <strong>${categoryLabels[location.category]}</strong>
        </p>
        <p style="margin: 4px 0; font-size: 13px;">
          ${safetyIcon} ${location.safetyRating === "safe" ? "Espaço Seguro" : location.safetyRating === "unsafe" ? "Atenção" : "Neutro"}
        </p>
        <p style="margin: 4px 0; font-size: 12px; color: #6b7280;">
          📍 ${location.address}
        </p>
        <p style="margin: 8px 0 4px 0; font-size: 13px;">
          ${location.description}
        </p>
        ${location.phone ? `<p style="margin: 4px 0; font-size: 12px;">📞 ${location.phone}</p>` : ""}
        ${location.website ? `<p style="margin: 4px 0; font-size: 12px;"><a href="${location.website}" target="_blank" style="color: #7c3aed;">🌐 Website</a></p>` : ""}
        <div style="margin-top: 8px;">
          ${location.tags
            .map(
              (tag) => `<span style="
                background: #e0e7ff; 
                color: #5b21b6; 
                padding: 2px 6px; 
                border-radius: 12px; 
                font-size: 11px; 
                margin-right: 4px;
              ">${tag}</span>`
            )
            .join("")}
        </div>
      </div>
    `;
  };

  // Show different loading states
  const showLocationLoading = isLoadingLocation && !userLocation;
  const showMapLoading = !isMapReady && !showLocationLoading;

  return (
    <>
      {/* CSS para animação de pulso */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            opacity: 1;
          }
          70% {
            transform: scale(1);
            opacity: 0.7;
          }
          100% {
            transform: scale(1.05);
            opacity: 0;
          }
        }
        
        .custom-marker:hover div {
          transform: rotate(-45deg) scale(1.1) !important;
        }
      `}</style>
      
      <div className="w-full h-full relative overflow-hidden">
        {/* Loading indicator for location */}
        {showLocationLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-700 text-lg font-medium mb-2">Aguardando sua localização...</p>
              <p className="text-gray-500 text-sm">O mapa será inicializado com sua posição atual</p>
            </div>
          </div>
        )}

        {/* Loading indicator for map */}
        {showMapLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">Carregando mapa...</p>
            </div>
          </div>
        )}
        
        {/* Map container */}
        <div
          ref={mapContainer}
          className="w-full h-full rounded-lg"
          style={{ 
            height: "100%", 
            minHeight: "400px", 
            position: "relative",
            visibility: isMapReady ? 'visible' : 'hidden'
          }}
        />
        
        {/* Legend */}
        {isMapReady && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg z-[1000] max-w-[120px]">
            <div className="text-xs font-semibold text-gray-700 mb-2">Legenda</div>
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-xs text-gray-600">Seguro</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></div>
                <span className="text-xs text-gray-600">Neutro</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                <span className="text-xs text-gray-600">Atenção</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 border border-purple-500 rounded-full flex-shrink-0"></div>
                <span className="text-xs text-gray-600">LGBTQIA+</span>
              </div>
              {userLocation && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 animate-pulse"></div>
                  <span className="text-xs text-gray-600">Você</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
});

Map.displayName = 'Map';

export default Map;