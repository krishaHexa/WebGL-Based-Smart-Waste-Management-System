import { create } from 'zustand';
import { FleetVehicle, OperationalStatus, TruckStatus } from '../types';

interface FleetState {
  vehicles: FleetVehicle[];
  selectedVehicleId: string | null;
  selectedVehicleIds: string[];
  isBatchMode: boolean;
  filters: {
    status: string | 'all';
    search: string;
  };
  updateVehicles: (vehicles: FleetVehicle[]) => void;
  updateVehicleRoute: (vehicleId: string, routeName: string) => void;
  batchDispatch: (vehicleIds: string[], routeName: string) => void;
  setVehicleStatus: (vehicleId: string, status: TruckStatus) => void;
  selectVehicle: (id: string | null) => void;
  toggleVehicleSelection: (id: string) => void;
  setBatchMode: (active: boolean) => void;
  setFilters: (filters: Partial<FleetState['filters']>) => void;
  getSelectedVehicle: () => FleetVehicle | undefined;
  scheduleMaintenance: (vehicleId: string, status: TruckStatus) => void;
}

export const useFleetStore = create<FleetState>((set, get) => ({
  vehicles: [
    {
      id: 'v1',
      vehicleCode: 'TRK-RIY-001',
      name: 'Riyadh Waste Collector 01',
      driverName: 'Mohammed Al-Saud',
      type: 'truck',
      status: OperationalStatus.HEALTHY,
      operationalStatus: 'ACTIVE',
      operationalState: 'collecting',
      wasteType: 'general',
      location: { lat: 24.7136, lng: 46.6753 },
      capacity: 15.2,
      currentLoad: 12.4,
      loadPercentage: 81.57,
      speed: 45.2,
      heading: 120,
      fuelLevel: 65.4,
      currentRoute: 'NORTH-COLLECTION-01',
      assignedRouteId: 'r1',
      alertState: 'normal',
      lastUpdate: new Date().toISOString()
    },
    {
      id: 'v2',
      vehicleCode: 'TRK-RIY-002',
      name: 'Riyadh Waste Collector 02',
      driverName: 'Abdullah Al-Fahad',
      type: 'truck',
      status: OperationalStatus.WARNING,
      operationalStatus: 'ACTIVE',
      operationalState: 'transporting',
      wasteType: 'recyclable',
      location: { lat: 24.7236, lng: 46.6853 },
      capacity: 15.2,
      currentLoad: 14.8,
      loadPercentage: 97.36,
      speed: 32.5,
      heading: 45,
      fuelLevel: 22.1,
      currentRoute: 'SOUTH-COLLECTION-04',
      assignedRouteId: 'r2',
      destinationFacilityId: 'f1',
      alertState: 'warning',
      lastUpdate: new Date().toISOString()
    },
    {
      id: 'v3',
      vehicleCode: 'TRK-RIY-003',
      name: 'Riyadh Heavy Lifter 01',
      driverName: 'Ahmed Al-Rashid',
      type: 'truck',
      status: OperationalStatus.HEALTHY,
      operationalStatus: 'ACTIVE',
      operationalState: 'unloading',
      wasteType: 'industrial',
      location: { lat: 24.7036, lng: 46.6653 },
      capacity: 25.0,
      currentLoad: 18.2,
      loadPercentage: 72.8,
      speed: 5.0,
      heading: 270,
      fuelLevel: 88.5,
      currentRoute: 'EAST-TRANSFER-02',
      assignedRouteId: 'r3',
      destinationFacilityId: 'f2',
      alertState: 'normal',
      lastUpdate: new Date().toISOString()
    },
    {
      id: 'v4',
      vehicleCode: 'TRK-RIY-004',
      name: 'Riyadh Waste Collector 03',
      driverName: 'Khalid Al-Hassan',
      type: 'truck',
      status: OperationalStatus.CRITICAL,
      operationalStatus: 'MAINTENANCE',
      operationalState: 'maintenance',
      wasteType: 'general',
      location: { lat: 24.7336, lng: 46.6953 },
      capacity: 15.2,
      currentLoad: 0,
      loadPercentage: 0,
      speed: 0,
      heading: 0,
      fuelLevel: 45.0,
      currentRoute: 'NONE',
      alertState: 'critical',
      lastUpdate: new Date().toISOString()
    },
    {
      id: 'v5',
      vehicleCode: 'TRK-RIY-005',
      name: 'Riyadh Recyclables 01',
      driverName: 'Salman Al-Otaibi',
      type: 'truck',
      status: OperationalStatus.HEALTHY,
      operationalStatus: 'AVAILABLE',
      operationalState: 'idle',
      wasteType: 'recyclable',
      location: { lat: 24.7436, lng: 46.7053 },
      capacity: 12.0,
      currentLoad: 1.2,
      loadPercentage: 10.0,
      speed: 55.0,
      heading: 180,
      fuelLevel: 75.0,
      currentRoute: 'WEST-RECYCLE-01',
      assignedRouteId: 'r4',
      alertState: 'normal',
      lastUpdate: new Date().toISOString()
    },
    {
      id: 'v6',
      vehicleCode: 'TRK-RIY-006',
      name: 'Riyadh Hazardous 01',
      driverName: 'Fahad Al-Aziz',
      type: 'truck',
      status: OperationalStatus.HEALTHY,
      operationalStatus: 'ACTIVE',
      operationalState: 'transporting',
      wasteType: 'hazardous',
      location: { lat: 24.6536, lng: 46.6253 },
      capacity: 8.0,
      currentLoad: 6.5,
      loadPercentage: 81.25,
      speed: 42.0,
      heading: 15,
      fuelLevel: 55.0,
      currentRoute: 'HAZMAT-PATH-01',
      assignedRouteId: 'r5',
      destinationFacilityId: 'f3',
      alertState: 'normal',
      lastUpdate: new Date().toISOString()
    },
    {
      id: 'v7',
      vehicleCode: 'TRK-RIY-007',
      name: 'Riyadh Compactor 04',
      driverName: 'Ziad Al-Harbi',
      type: 'truck',
      status: OperationalStatus.CRITICAL,
      operationalStatus: 'INSPECTION',
      operationalState: 'idle',
      wasteType: 'general',
      location: { lat: 24.6636, lng: 46.6353 },
      capacity: 18.0,
      currentLoad: 0,
      loadPercentage: 0,
      speed: 0,
      heading: 0,
      fuelLevel: 30.0,
      currentRoute: 'NONE',
      alertState: 'critical',
      lastUpdate: new Date().toISOString()
    }
  ],
  selectedVehicleId: null,
  selectedVehicleIds: [],
  isBatchMode: false,
  filters: {
    status: 'all',
    search: '',
  },
  updateVehicles: (vehicles) => set({ vehicles }),
  updateVehicleRoute: (vehicleId, routeName) => set(state => ({
    vehicles: state.vehicles.map(v => 
      v.id === vehicleId ? { 
        ...v, 
        currentRoute: routeName, 
        operationalStatus: routeName === 'NONE' ? 'AVAILABLE' : 'ACTIVE',
        operationalState: routeName === 'NONE' ? 'idle' : 'collecting'
      } : v
    )
  })),
  batchDispatch: (vehicleIds, routeName) => set(state => ({
    vehicles: state.vehicles.map(v => 
      vehicleIds.includes(v.id) ? {
        ...v,
        currentRoute: routeName,
        operationalStatus: 'ACTIVE',
        operationalState: 'collecting'
      } : v
    ),
    isBatchMode: false,
    selectedVehicleIds: []
  })),
  setVehicleStatus: (vehicleId, status) => set(state => ({
    vehicles: state.vehicles.map(v => v.id === vehicleId ? { 
      ...v, 
      operationalStatus: status,
      currentRoute: ['MAINTENANCE', 'INSPECTION', 'OFFLINE'].includes(status) ? 'NONE' : v.currentRoute,
      operationalState: status === 'MAINTENANCE' ? 'maintenance' : (status === 'AVAILABLE' ? 'idle' : v.operationalState)
    } : v)
  })),
  scheduleMaintenance: (vehicleId, status) => set(state => ({
    vehicles: state.vehicles.map(v => v.id === vehicleId ? { 
      ...v, 
      operationalStatus: status,
      currentRoute: 'NONE',
      operationalState: status === 'MAINTENANCE' ? 'maintenance' : 'idle'
    } : v)
  })),
  selectVehicle: (id) => set({ selectedVehicleId: id }),
  toggleVehicleSelection: (id) => set(state => ({
    selectedVehicleIds: state.selectedVehicleIds.includes(id) 
      ? state.selectedVehicleIds.filter(vid => vid !== id) 
      : [...state.selectedVehicleIds, id]
  })),
  setBatchMode: (active) => set({ isBatchMode: active, selectedVehicleIds: [] }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  getSelectedVehicle: () => {
    const { vehicles, selectedVehicleId } = get();
    return vehicles.find(v => v.id === selectedVehicleId);
  },
}));
