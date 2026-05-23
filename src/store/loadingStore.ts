import { create } from 'zustand';

interface LoadingState {
  isMapReady: boolean;
  isThreeReady: boolean;
  isSocketConnected: boolean;
  isTelemetryInitialized: boolean;
  isRouteLoading: boolean;
  setMapReady: (ready: boolean) => void;
  setThreeReady: (ready: boolean) => void;
  setSocketConnected: (connected: boolean) => void;
  setTelemetryInitialized: (ready: boolean) => void;
  setRouteLoading: (loading: boolean) => void;
  isSystemReady: () => boolean;
}

export const useLoadingStore = create<LoadingState>((set, get) => ({
  isMapReady: false,
  isThreeReady: false,
  isSocketConnected: false,
  isTelemetryInitialized: false,
  isRouteLoading: false,
  setMapReady: (ready) => set({ isMapReady: ready }),
  setThreeReady: (ready) => set({ isThreeReady: ready }),
  setSocketConnected: (connected) => set({ isSocketConnected: connected }),
  setTelemetryInitialized: (ready) => set({ isTelemetryInitialized: ready }),
  setRouteLoading: (loading) => set({ isRouteLoading: loading }),
  isSystemReady: () => {
    const { isMapReady, isSocketConnected, isTelemetryInitialized } = get();
    return isMapReady && isSocketConnected && isTelemetryInitialized;
  }
}));
