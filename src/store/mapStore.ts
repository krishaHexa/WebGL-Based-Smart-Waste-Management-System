import { create } from 'zustand';

interface MapLayerVisibility {
  trucks: boolean;
  bins: boolean;
  facilities: boolean;
  cctv: boolean;
  incidents: boolean;
  workforce: boolean;
  routes: boolean;
}

interface MapState {
  center: [number, number];
  zoom: number;
  layers: MapLayerVisibility;
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  toggleLayer: (layer: keyof MapLayerVisibility) => void;
  setLayer: (layer: keyof MapLayerVisibility, visible: boolean) => void;
  focusRegion: (center: [number, number], zoom: number) => void;
}

export const useMapStore = create<MapState>((set) => ({
  center: [24.7136, 46.6753], // Riyadh Center
  zoom: 12,
  layers: {
    trucks: true,
    bins: true,
    facilities: true,
    cctv: true,
    incidents: true,
    workforce: true,
    routes: true,
  },
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  toggleLayer: (layer) => set((state) => ({
    layers: { ...state.layers, [layer]: !state.layers[layer] }
  })),
  setLayer: (layer, visible) => set((state) => ({
    layers: { ...state.layers, [layer]: visible }
  })),
  focusRegion: (center: [number, number], zoom: number) => set({ center, zoom }),
}));
