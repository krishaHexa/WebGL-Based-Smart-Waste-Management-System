import { create } from 'zustand';
import { SmartBin, OperationalStatus } from '../types';

interface BinState {
  bins: SmartBin[];
  selectedBinId: string | null;
  filters: {
    wasteType: string | 'all';
    priority: string | 'all';
    search: string;
  };
  updateBins: (bins: SmartBin[]) => void;
  selectBin: (id: string | null) => void;
  setFilters: (filters: Partial<BinState['filters']>) => void;
  getSelectedBin: () => SmartBin | undefined;
}

export const useBinStore = create<BinState>((set, get) => ({
  bins: [
    {
      id: 'b1',
      binCode: 'BIN-CENT-001',
      name: 'Riyadh Square North',
      type: 'bin',
      status: OperationalStatus.HEALTHY,
      operationalStatus: 'active',
      location: { lat: 24.7116, lng: 46.6733 },
      lastUpdate: new Date().toISOString(),
      fillLevel: 85.0,
      wasteType: 'general',
      collectionPriority: 'high',
      temperature: 32.5,
      batteryLevel: 92.0,
      lastCollected: '2026-05-13T04:00:00Z',
      alertState: 'warning'
    },
    {
      id: 'b2',
      binCode: 'BIN-CENT-002',
      name: 'Riyadh Square South',
      type: 'bin',
      status: OperationalStatus.CRITICAL,
      operationalStatus: 'active',
      location: { lat: 24.7156, lng: 46.6773 },
      lastUpdate: new Date().toISOString(),
      fillLevel: 98.4,
      wasteType: 'general',
      collectionPriority: 'urgent',
      temperature: 38.2,
      batteryLevel: 88.0,
      lastCollected: '2026-05-13T03:00:00Z',
      alertState: 'critical'
    },
    {
      id: 'b3',
      binCode: 'BIN-RECY-001',
      name: 'King Fahad Road Recyclable',
      type: 'bin',
      status: OperationalStatus.HEALTHY,
      operationalStatus: 'active',
      location: { lat: 24.7216, lng: 46.6833 },
      lastUpdate: new Date().toISOString(),
      fillLevel: 42.0,
      wasteType: 'recyclable',
      collectionPriority: 'low',
      temperature: 28.5,
      batteryLevel: 95.0,
      lastCollected: '2026-05-12T22:00:00Z',
      alertState: 'normal'
    },
    {
      id: 'b4',
      binCode: 'BIN-OFF-001',
      name: 'Diplomatic Quarter Gate 2',
      type: 'bin',
      status: OperationalStatus.OFFLINE,
      operationalStatus: 'offline',
      location: { lat: 24.6916, lng: 46.6533 },
      lastUpdate: new Date().toISOString(),
      fillLevel: 0,
      wasteType: 'general',
      collectionPriority: 'medium',
      temperature: 0,
      batteryLevel: 5.0,
      lastCollected: '2026-05-11T12:00:00Z',
      alertState: 'critical'
    },
    {
      id: 'b5',
      binCode: 'BIN-CITY-005',
      name: 'Tahlia Street East',
      type: 'bin',
      status: OperationalStatus.HEALTHY,
      operationalStatus: 'active',
      location: { lat: 24.7016, lng: 46.6633 },
      lastUpdate: new Date().toISOString(),
      fillLevel: 65.2,
      wasteType: 'general',
      collectionPriority: 'medium',
      temperature: 31.0,
      batteryLevel: 99.0,
      lastCollected: '2026-05-13T01:00:00Z',
      alertState: 'normal'
    }
  ],
  selectedBinId: null,
  filters: {
    wasteType: 'all',
    priority: 'all',
    search: '',
  },
  updateBins: (bins) => set({ bins }),
  selectBin: (id) => set({ selectedBinId: id }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  getSelectedBin: () => {
    const { bins, selectedBinId } = get();
    return bins.find(b => b.id === selectedBinId);
  },
}));
