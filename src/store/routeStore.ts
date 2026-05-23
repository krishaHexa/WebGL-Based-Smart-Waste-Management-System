import { create } from 'zustand';
import { GeoLocation } from '../types';

export interface Route {
  id: string;
  routeName: string;
  routeCode: string;
  type: string;
  status: 'active' | 'completed' | 'pending' | 'conflict' | 'delayed';
  efficiencyRating: number;
  estimatedTime: string;
  stops: GeoLocation[];
  path: GeoLocation[];
  assignedVehicleId?: string;
  needsOptimization?: boolean;
}

interface RouteState {
  routes: Route[];
  selectedRouteId: string | null;
  optimizationStatus: 'idle' | 'running' | 'completed';
  setRoutes: (routes: Route[]) => void;
  selectRoute: (id: string | null) => void;
  runOptimization: () => void;
  importLayer: (file: File) => Promise<void>;
  updateRouteStatus: (id: string, status: Route['status']) => void;
  deleteRoute: (id: string) => void;
  syncWithFleet: (vehicles: any[]) => void;
  createOptimizedRoute: (data: { 
    name: string; 
    vehicleId: string; 
    region: string; 
  }) => Promise<void>;
}

export const useRouteStore = create<RouteState>((set, get) => ({
  routes: [
    {
      id: 'r1',
      routeName: 'North District - Al Olaya Primary',
      routeCode: 'RD-OL-01',
      type: 'collection',
      status: 'active',
      efficiencyRating: 94.2,
      estimatedTime: '3h 45m',
      assignedVehicleId: 'v1',
      stops: [
        { lat: 24.7136, lng: 46.6753 },
        { lat: 24.7336, lng: 46.6853 },
        { lat: 24.7536, lng: 46.7053 }
      ],
      path: [
        { lat: 24.7136, lng: 46.6753 },
        { lat: 24.7236, lng: 46.6803 },
        { lat: 24.7336, lng: 46.6853 },
        { lat: 24.7436, lng: 46.6953 },
        { lat: 24.7536, lng: 46.7053 }
      ]
    },
    {
      id: 'r2',
      routeName: 'Diplomatic Quarter Logistics',
      routeCode: 'RD-DQ-04',
      type: 'collection',
      status: 'active',
      efficiencyRating: 88.5,
      estimatedTime: '2h 15m',
      assignedVehicleId: 'v2',
      stops: [
        { lat: 24.6916, lng: 46.6533 },
        { lat: 24.6816, lng: 46.6433 }
      ],
      path: [
        { lat: 24.6916, lng: 46.6533 },
        { lat: 24.6866, lng: 46.6483 },
        { lat: 24.6816, lng: 46.6433 }
      ]
    },
    {
      id: 'r3',
      routeName: 'King Fahd Hwy - Industrial Link',
      routeCode: 'RD-KF-02',
      type: 'transfer',
      status: 'active',
      efficiencyRating: 72.4,
      estimatedTime: '5h 10m',
      assignedVehicleId: 'v3',
      stops: [
        { lat: 24.7036, lng: 46.6653 },
        { lat: 24.8136, lng: 46.7753 }
      ],
      path: [
        { lat: 24.7036, lng: 46.6653 },
        { lat: 24.7536, lng: 46.7153 },
        { lat: 24.8136, lng: 46.7753 }
      ]
    },
    {
      id: 'r4',
      routeName: 'Southern Logistics Corridor',
      routeCode: 'RD-SO-05',
      type: 'transfer',
      status: 'pending',
      efficiencyRating: 91.0,
      estimatedTime: '4h 00m',
      assignedVehicleId: 'v5',
      stops: [
        { lat: 24.6136, lng: 46.5753 },
        { lat: 24.7136, lng: 46.8753 }
      ],
      path: [
        { lat: 24.6136, lng: 46.5753 },
        { lat: 24.6636, lng: 46.7253 },
        { lat: 24.7136, lng: 46.8753 }
      ]
    },
    {
      id: 'r5',
      routeName: 'Industrial Sector - High Conflict',
      routeCode: 'RD-IND-09',
      type: 'collection',
      status: 'delayed',
      efficiencyRating: 62.4,
      estimatedTime: '6h 30m',
      assignedVehicleId: 'v4',
      stops: [
        { lat: 24.5836, lng: 46.8553 },
        { lat: 24.6036, lng: 46.8853 }
      ],
      path: [
        { lat: 24.5836, lng: 46.8553 },
        { lat: 24.5936, lng: 46.8703 },
        { lat: 24.6036, lng: 46.8853 }
      ]
    }
  ],
  selectedRouteId: null,
  optimizationStatus: 'idle',
  setRoutes: (routes) => set({ routes }),
  selectRoute: (id) => set({ selectedRouteId: id }),
  updateRouteStatus: (id, status) => set(state => ({
    routes: state.routes.map(r => r.id === id ? { ...r, status } : r)
  })),
  deleteRoute: (id) => {
    const route = get().routes.find(r => r.id === id);
    if (route?.assignedVehicleId) {
      import('./fleetStore').then(({ useFleetStore }) => {
        useFleetStore.getState().updateVehicleRoute(route.assignedVehicleId!, 'NONE');
      });
    }
    set(state => ({
      routes: state.routes.filter(r => r.id !== id),
      selectedRouteId: state.selectedRouteId === id ? null : state.selectedRouteId
    }));
  },
  createOptimizedRoute: async ({ name, vehicleId, region }) => {
    set({ optimizationStatus: 'running' });
    
    // Simulate complex optimization delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const regionCoords: Record<string, { lat: number, lng: number }> = {
      'Riyadh Central': { lat: 24.7136, lng: 46.6753 },
      'Riyadh North': { lat: 24.7736, lng: 46.6753 },
      'Riyadh South': { lat: 24.6336, lng: 46.7153 },
      'Industrial Zone': { lat: 24.5836, lng: 46.8553 },
      'Landfill Corridor': { lat: 24.8136, lng: 46.7753 },
      'Diplomatic Quarter': { lat: 24.6916, lng: 46.6533 }
    };

    const base = regionCoords[region] || regionCoords['Riyadh Central'];
    const newId = `r-${Date.now()}`;

    // Generate a more realistic operational path
    const pathCount = 8 + Math.floor(Math.random() * 5);
    const path: GeoLocation[] = [];
    
    let currentLat = base.lat;
    let currentLng = base.lng;

    for (let i = 0; i < pathCount; i++) {
        path.push({ 
            lat: currentLat + (Math.random() - 0.5) * 0.02, 
            lng: currentLng + (Math.random() - 0.5) * 0.02 
        });
        currentLat = path[path.length - 1].lat;
        currentLng = path[path.length - 1].lng;
    }

    const newRoute: Route = {
      id: newId,
      routeName: name,
      routeCode: `OPT-${Math.floor(Math.random() * 9000) + 1000}`,
      type: 'collection',
      status: 'active',
      efficiencyRating: 95 + Math.random() * 4,
      estimatedTime: `${1 + Math.floor(Math.random() * 3)}h ${Math.floor(Math.random() * 60)}m`,
      stops: [path[0], path[Math.floor(pathCount/2)], path[pathCount - 1]],
      path: path,
      assignedVehicleId: vehicleId
    };

    set(state => ({
      routes: [newRoute, ...state.routes],
      selectedRouteId: newId,
      optimizationStatus: 'completed'
    }));

    // Explicitly update vehicle status in fleet store
    try {
      const { useFleetStore } = await import('./fleetStore');
      useFleetStore.getState().updateVehicleRoute(vehicleId, newRoute.routeName);
    } catch (e) {
      console.error("Fleet sync failed", e);
    }
  },
  syncWithFleet: (vehicles) => {
    const currentRoutes = get().routes;
    const updatedRoutes = currentRoutes.map(route => {
      const assignedTrucks = vehicles.filter(v => v.currentRoute === route.routeCode || v.currentRoute === route.routeName);
      
      let status: Route['status'] = route.status;
      let needsOptimization = false;

      if (assignedTrucks.length > 1) {
        status = 'conflict';
        needsOptimization = true;
      } else if (assignedTrucks.length === 1) {
        const vehicle = assignedTrucks[0];
        if (vehicle.operationalStatus === 'ACTIVE') {
          status = 'active';
        } else if (vehicle.operationalStatus === 'MAINTENANCE' || vehicle.operationalStatus === 'OFFLINE') {
          status = 'delayed'; 
        } else {
          status = 'pending';
        }
      } else {
        status = 'pending';
      }

      return {
        ...route,
        status,
        needsOptimization,
        assignedVehicleId: assignedTrucks[0]?.id
      };
    });
    set({ routes: updatedRoutes });
  },
  runOptimization: () => {
    set({ optimizationStatus: 'running' });
    setTimeout(() => {
      set({ optimizationStatus: 'completed' });
    }, 2000);
  },
  importLayer: async (file) => {
    console.log('Importing layer:', file.name);
    // Simulation of import
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
}));
