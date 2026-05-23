import { create } from 'zustand';
import { DashboardMetrics } from '../types';

interface DashboardState {
  metrics: DashboardMetrics;
  updateMetrics: (metrics: Partial<DashboardMetrics>) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  metrics: {
    totalAssets: 450,
    activeVehicles: 42,
    alertCount: 12,
    collectionEfficiency: 88.4,
    activeTrucks: 38,
    trucksDelivering: 5,
    facilityQueueLoad: 42.5,
    facilityProcessingCapacity: 85.0,
    totalWasteCollectedToday: 1250.45,
    activeWorkforceUnits: 156,
    routeOptimizationConflicts: 3,
    overflowRiskZones: 8,
    activeEnvironmentalAlerts: 2,
    activeCCTVAlerts: 4,
  },
  updateMetrics: (newMetrics) => set((state) => ({
    metrics: { ...state.metrics, ...newMetrics }
  })),
}));
