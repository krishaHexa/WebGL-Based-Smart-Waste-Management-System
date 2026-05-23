import { create } from 'zustand';
import { WasteFacility, OperationalStatus } from '../types';

interface FacilityState {
  facilities: WasteFacility[];
  selectedFacilityId: string | null;
  updateFacilities: (facilities: WasteFacility[]) => void;
  selectFacility: (id: string | null) => void;
  getSelectedFacility: () => WasteFacility | undefined;
}

export const useFacilityStore = create<FacilityState>((set, get) => ({
  facilities: [
    {
      id: 'f1',
      facilityCode: 'FAC-NORTH-01',
      name: 'Riyadh North Landfill',
      type: 'facility',
      status: OperationalStatus.HEALTHY,
      operationalStatus: 'operational',
      location: { lat: 24.8136, lng: 46.7753 },
      lastUpdate: new Date().toISOString(),
      facilityType: 'landfill',
      capacityPercentage: 74.5,
      methaneLevel: 1.2,
      temperature: 42.5,
      energyConsumption: 1250,
      equipmentHealth: 92.0,
      environmentalRisk: 'low',
      activeAlerts: [],
      supportedWasteTypes: ['general', 'organic', 'industrial'],
      queueLoad: 15.4,
      processingCapacity: 450,
      machines: [
        { id: 'm1', name: 'Compactor Alpha', type: 'compactor', status: 'active', health: 95, utilization: 65, lastMaintenance: '2024-03-10' },
        { id: 'm2', name: 'Methane Flare 1', type: 'methane_system', status: 'active', health: 98, utilization: 30, lastMaintenance: '2024-04-15' },
        { id: 'm3', name: 'Mass Shredder', type: 'shredder', status: 'idle', health: 85, utilization: 0, lastMaintenance: '2024-02-20' }
      ]
    },
    {
      id: 'f2',
      facilityCode: 'FAC-WEST-01',
      name: 'Ash-Shifa Transfer Station',
      type: 'facility',
      status: OperationalStatus.WARNING,
      operationalStatus: 'degraded',
      location: { lat: 24.6136, lng: 46.5753 },
      lastUpdate: new Date().toISOString(),
      facilityType: 'transfer_station',
      capacityPercentage: 92.8,
      methaneLevel: 0.5,
      temperature: 38.0,
      energyConsumption: 850,
      equipmentHealth: 78.0,
      environmentalRisk: 'medium',
      activeAlerts: ['High Load Detected'],
      supportedWasteTypes: ['general', 'recyclable'],
      queueLoad: 88.2,
      processingCapacity: 220,
      machines: [
        { id: 'm4', name: 'Conveyor Line A', type: 'conveyor', status: 'active', health: 75, utilization: 95, lastMaintenance: '2024-01-10' },
        { id: 'm5', name: 'Sorting Matrix', type: 'sorting_machine', status: 'fault', health: 45, utilization: 0, lastMaintenance: '2024-05-01' }
      ]
    },
    {
      id: 'f3',
      facilityCode: 'FAC-RECY-01',
      name: 'Sulay Recycling Center',
      type: 'facility',
      status: OperationalStatus.HEALTHY,
      operationalStatus: 'operational',
      location: { lat: 24.7136, lng: 46.8753 },
      lastUpdate: new Date().toISOString(),
      facilityType: 'recycling_center',
      capacityPercentage: 45.2,
      methaneLevel: 0.2,
      temperature: 31.5,
      energyConsumption: 2100,
      equipmentHealth: 95.0,
      environmentalRisk: 'low',
      activeAlerts: [],
      supportedWasteTypes: ['recyclable', 'hazardous'],
      queueLoad: 32.1,
      processingCapacity: 180,
      machines: [
        { id: 'm6', name: 'PET Processor', type: 'recycling_unit', status: 'active', health: 92, utilization: 45, lastMaintenance: '2024-04-10' },
        { id: 'm7', name: 'Paper baler', type: 'recycling_unit', status: 'active', health: 90, utilization: 60, lastMaintenance: '2024-04-05' }
      ]
    }
  ],
  selectedFacilityId: null,
  updateFacilities: (facilities) => set({ facilities }),
  selectFacility: (id) => set({ selectedFacilityId: id }),
  getSelectedFacility: () => {
    const { facilities, selectedFacilityId } = get();
    return facilities.find(f => f.id === selectedFacilityId);
  },
}));
