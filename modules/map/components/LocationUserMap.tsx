"use client";

import { AlertCircle, Loader2, Navigation, MapPin } from "lucide-react";
import { useGeolocation } from "../hooks/useGeolocation";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

interface LocationUserComponentProps {
  onLocationChange?: (location: { lat: number; lng: number } | null) => void;
  defaultLocation?: { lat: number; lng: number };
  autoRequest?: boolean;
  showFloatingButton?: boolean;
  showBanner?: boolean;
  className?: string;
}

export default function LocationUserComponent({
  onLocationChange,
  defaultLocation = { lat: -23.5505, lng: -46.6333 }, // São Paulo
  autoRequest = true,
  showFloatingButton = true,
  showBanner = true,
  className = ""
}: LocationUserComponentProps) {
  const {
    currentLocation,
    loading,
    error,
    denied,
    hasLocation,
    isUsingDefault,
    getCurrentLocation,
    clearError
  } = useGeolocation({
    autoRequest,
    defaultLocation,
    onLocationChange
  });

  const previousHasLocation = useRef(hasLocation);
  const hasShownSuccessToast = useRef(false);

  // Mostra toast quando a localização é obtida com sucesso - CORRIGIDO
  useEffect(() => {
    // Só mostra o toast se:
    // 1. Temos localização agora
    // 2. Não tínhamos antes
    // 3. Não está carregando
    // 4. Ainda não mostramos o toast
    if (hasLocation && !previousHasLocation.current && !loading && !hasShownSuccessToast.current) {
      toast.success("📍 Localização atualizada!", {
        description: "Sua localização foi obtida com sucesso"
      });
      hasShownSuccessToast.current = true;
    }
    
    // Atualiza a referência apenas quando necessário
    if (previousHasLocation.current !== hasLocation) {
      previousHasLocation.current = hasLocation;
    }
    
    // Reset do flag quando perde a localização
    if (!hasLocation) {
      hasShownSuccessToast.current = false;
    }
  }, [hasLocation, loading]); // Mantém apenas as dependências essenciais

  // Só mostra o banner se houver algo importante para mostrar
  const shouldShowBanner = showBanner && (
    loading || 
    (error && !hasLocation) || 
    (isUsingDefault && !hasLocation && !loading)
  );

  return (
    <div className={className}>
      {/* Banner de status da geolocalização - FIXED POSITION */}
      {shouldShowBanner && (
        <div className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b z-[1002]">
          <div className="max-w-7xl mx-auto px-4 py-2">
            {loading && (
              <div className="flex items-center text-blue-600 py-1">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm">Obtendo sua localização...</span>
              </div>
            )}
            
            {error && !hasLocation && (
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center text-amber-600">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    {error} - Usando localização padrão
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={clearError}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Dispensar
                  </button>
                  {denied && (
                    <button
                      onClick={getCurrentLocation}
                      className="text-sm bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                    >
                      <Navigation className="h-3 w-3 mr-1" />
                      Permitir localização
                    </button>
                  )}
                </div>
              </div>
            )}

            {isUsingDefault && !hasLocation && !loading && !error && (
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">Usando localização padrão (São Paulo)</span>
                </div>
                <button
                  onClick={getCurrentLocation}
                  className="text-sm text-purple-600 hover:text-purple-700 flex items-center"
                >
                  <Navigation className="h-3 w-3 mr-1" />
                  Usar minha localização
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Espaçamento para o banner fixo */}
      {shouldShowBanner && <div className="h-14" />}

      {/* Botões flutuantes */}
      {showFloatingButton && (
        <div className="fixed bottom-6 right-6 z-[1001] flex flex-col space-y-3">
          {/* Botão para atualizar localização */}
          <button
            onClick={getCurrentLocation}
            disabled={loading}
            className="bg-primary hover:bg-primary/90 disabled:bg-primary/60 text-primary-foreground p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 disabled:scale-100"
            title={hasLocation ? "Atualizar minha localização" : "Obter minha localização"}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Navigation className="h-5 w-5" />
            )}
          </button>

          {/* Indicador de status da localização */}
          <div className="bg-card rounded-full p-2 shadow-lg border">
            <div 
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                hasLocation ? 'bg-green-500' : error ? 'bg-destructive' : 'bg-yellow-500'
              }`}
              title={
                hasLocation 
                  ? "Localização obtida" 
                  : error 
                    ? "Erro na localização" 
                    : "Localização padrão"
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};