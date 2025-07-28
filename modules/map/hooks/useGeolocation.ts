"use client";

import { useState, useEffect, useCallback } from "react";

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
    maximumAge = 300000,
    defaultLocation = { lat: -23.5505, lng: -46.6333 },
    autoRequest = true,
    onLocationChange,
    onLoadingChange,
  } = options;

  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: false,
    error: null,
    denied: false,
  });

  const getCurrentLocation = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true, error: null, denied: false }));

    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Geolocalização não é suportada pelo seu navegador",
      }));
      return;
    }

    const geoOptions: PositionOptions = {
      enableHighAccuracy,
      timeout,
      maximumAge,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { lat: latitude, lng: longitude };

        setState((prev) => {
          // Only update if location has changed
          if (
            prev.location &&
            prev.location.lat === newLocation.lat &&
            prev.location.lng === newLocation.lng
          ) {
            return prev;
          }
          return {
            location: newLocation,
            loading: false,
            error: null,
            denied: false,
          };
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

        setState((prev) => ({
          ...prev,
          location: null,
          loading: false,
          error: errorMessage,
          denied,
        }));
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
      const permission = await navigator.permissions.query({ name: "geolocation" });

      if (permission.state === "granted" || permission.state === "prompt") {
        getCurrentLocation();
      } else {
        setState((prev) => ({
          ...prev,
          error: "Permissão de localização negada",
          denied: true,
        }));
      }
    } catch {
      getCurrentLocation();
    }
  }, [getCurrentLocation]);

  useEffect(() => {
    if (autoRequest) {
      const timer = setTimeout(() => {
        requestPermission();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [autoRequest, requestPermission]);

  useEffect(() => {
    if (onLocationChange && state.location !== null) {
      onLocationChange(state.location);
    } else if (onLocationChange && state.error && !state.location) {
      onLocationChange(defaultLocation);
    }
  }, [state.location, state.error, defaultLocation, onLocationChange]);

  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(state.loading);
    }
  }, [state.loading, onLoadingChange]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const useDefaultLocation = useCallback(() => {
    setState({
      location: defaultLocation,
      loading: false,
      error: null,
      denied: false,
    });
  }, [defaultLocation]);

  return {
    ...state,
    currentLocation: state.location || defaultLocation,
    getCurrentLocation,
    requestPermission,
    clearError,
    useDefaultLocation,
    hasLocation: !!state.location,
    isUsingDefault: !state.location,
  };
};