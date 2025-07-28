"use client";

import { useState, useEffect, useCallback } from 'react';

interface UserLocation {
  lat: number;
  lng: number;
}

interface GeolocationState {
  location: UserLocation | null;
  loading: boolean;
  error: string | null;
  denied: boolean;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  defaultLocation?: UserLocation;
  autoRequest?: boolean;
  onLocationChange?: (location: UserLocation | null) => void;
  onLoadingChange?: (loading: boolean) => void;
}

export const useGeolocation = (options: UseGeolocationOptions = {}) => {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 300000, // 5 minutos
    defaultLocation = { lat: -23.5505, lng: -46.6333 }, // São Paulo
    autoRequest = true,
    onLocationChange,
    onLoadingChange
  } = options;

  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: false,
    error: null,
    denied: false
  });

  useEffect(() => {
    if (onLocationChange) {
      onLocationChange(state.location || defaultLocation);
    }
  }, [state.location, defaultLocation, onLocationChange]);

  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(state.loading);
    }
  }, [state.loading, onLoadingChange]);

  const getCurrentLocation = useCallback(() => {
    setState(prev => ({ ...prev, loading: true, error: null, denied: false }));

    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Geolocalização não é suportada pelo seu navegador"
      }));
      return;
    }

    const geoOptions: PositionOptions = {
      enableHighAccuracy,
      timeout,
      maximumAge
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { lat: latitude, lng: longitude };
        
        setState({
          location: newLocation,
          loading: false,
          error: null,
          denied: false
        });
      },
      (error) => {
        let errorMessage = "Erro ao obter localização";
        let denied = false;

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permissão de localização negada";
            denied = true;
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Localização indisponível";
            break;
          case error.TIMEOUT:
            errorMessage = "Tempo limite esgotado para obter localização";
            break;
          default:
            errorMessage = "Erro desconhecido ao obter localização";
        }

        setState({
          location: null,
          loading: false,
          error: errorMessage,
          denied
        });
      },
      geoOptions
    );
  }, [enableHighAccuracy, timeout, maximumAge]);

  const requestPermission = useCallback(async () => {
    if (!navigator.permissions) {
      getCurrentLocation();
      return;
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      
      if (permission.state === 'granted') {
        getCurrentLocation();
      } else if (permission.state === 'prompt') {
        getCurrentLocation();
      } else {
        setState(prev => ({
          ...prev,
          error: "Permissão de localização negada",
          denied: true
        }));
      }
    } catch {
      // Fallback se a API de permissions não funcionar
      getCurrentLocation();
    }
  }, [getCurrentLocation]);

  // Auto-request location on mount
  useEffect(() => {
    if (autoRequest) {
      // Pequeno delay para evitar corrida de renderização
      const timer = setTimeout(() => {
        requestPermission();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [autoRequest, requestPermission]);

  // Função para limpar erro
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Função para usar localização padrão
  const useDefaultLocation = useCallback(() => {
    setState({
      location: defaultLocation,
      loading: false,
      error: null,
      denied: false
    });
  }, [defaultLocation]);

  return {
    ...state,
    // Localização atual ou padrão
    currentLocation: state.location || defaultLocation,
    // Funções
    getCurrentLocation,
    requestPermission,
    clearError,
    useDefaultLocation,
    // Estados derivados
    hasLocation: !!state.location,
    isUsingDefault: !state.location
  };
};