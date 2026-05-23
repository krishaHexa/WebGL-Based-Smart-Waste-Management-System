import { create } from 'zustand';
import { SurveillanceCamera, SurveillanceAlert } from '../types';

interface SurveillanceStore {
  cameras: SurveillanceCamera[];
  alerts: SurveillanceAlert[];
  selectedCameraId: string | null;
  isLoading: boolean;
  
  setCameras: (cameras: SurveillanceCamera[]) => void;
  updateCamera: (id: string, updates: Partial<SurveillanceCamera>) => void;
  selectCamera: (id: string | null) => void;
  addAlert: (alert: SurveillanceAlert) => void;
  setLoading: (loading: boolean) => void;
}

export const useSurveillanceStore = create<SurveillanceStore>((set) => ({
  cameras: [
    {
      id: 'c1',
      cameraCode: 'CAM-LND-001',
      cameraName: 'Landfill Entry Gate North',
      location: { lat: 24.8136, lng: 46.7753 },
      facilityZone: 'A-1',
      operationalStatus: 'online',
      cameraType: 'gate',
      streamStatus: 'active',
      incidentLinked: false,
      networkHealth: 98,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'c2',
      cameraCode: 'CAM-LND-002',
      cameraName: 'Landfill Perimeter East',
      location: { lat: 24.8146, lng: 46.7763 },
      facilityZone: 'A-2',
      operationalStatus: 'online',
      cameraType: 'perimeter',
      streamStatus: 'active',
      incidentLinked: true,
      networkHealth: 95,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'c3',
      cameraCode: 'CAM-TRS-001',
      cameraName: 'Transfer Station Loading Dock 1',
      location: { lat: 24.6136, lng: 46.5753 },
      facilityZone: 'T-1',
      operationalStatus: 'online',
      cameraType: 'facility',
      streamStatus: 'active',
      incidentLinked: false,
      networkHealth: 88,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'c4',
      cameraCode: 'CAM-TRS-002',
      cameraName: 'Transfer Station Loading Dock 2',
      location: { lat: 24.6146, lng: 46.5763 },
      facilityZone: 'T-2',
      operationalStatus: 'degraded',
      cameraType: 'facility',
      streamStatus: 'active',
      incidentLinked: false,
      networkHealth: 45,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'c5',
      cameraCode: 'CAM-STR-001',
      cameraName: 'Talia St Junction North',
      location: { lat: 24.7016, lng: 46.6633 },
      facilityZone: 'ST-01',
      operationalStatus: 'online',
      cameraType: 'street',
      streamStatus: 'active',
      incidentLinked: false,
      networkHealth: 99,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'c6',
      cameraCode: 'CAM-STR-002',
      cameraName: 'Talia St Junction South',
      location: { lat: 24.7026, lng: 46.6643 },
      facilityZone: 'ST-02',
      operationalStatus: 'online',
      cameraType: 'street',
      streamStatus: 'active',
      incidentLinked: false,
      networkHealth: 97,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'c7',
      cameraCode: 'CAM-RECY-001',
      cameraName: 'Sulay Recycling Sorting Line 1',
      location: { lat: 24.7136, lng: 46.8753 },
      facilityZone: 'R-1',
      operationalStatus: 'online',
      cameraType: 'facility',
      streamStatus: 'active',
      incidentLinked: false,
      networkHealth: 92,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'c8',
      cameraCode: 'CAM-RECY-002',
      cameraName: 'Sulay Recycling Sorting Line 2',
      location: { lat: 24.7146, lng: 46.8763 },
      facilityZone: 'R-2',
      operationalStatus: 'offline',
      cameraType: 'facility',
      streamStatus: 'disconnected',
      incidentLinked: false,
      networkHealth: 0,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'c9',
      cameraCode: 'CAM-PRK-001',
      cameraName: 'Municipal Park Bin View',
      location: { lat: 24.7156, lng: 46.6773 },
      facilityZone: 'P-1',
      operationalStatus: 'online',
      cameraType: 'perimeter',
      streamStatus: 'active',
      incidentLinked: true,
      networkHealth: 94,
      lastUpdated: new Date().toISOString()
    }
  ],
  alerts: [
    {
      id: 'a1',
      cameraId: 'c2',
      type: 'intrusion',
      message: 'Suspicious vehicle detected in restricted perimeter zone.',
      timestamp: '2026-05-13T10:05:00Z',
      severity: 'high'
    },
    {
      id: 'a2',
      cameraId: 'c9',
      type: 'overflow',
      message: 'Smart Bin #BIN-CENT-002 confirmed overflow via visual AI.',
      timestamp: '2026-05-13T08:31:00Z',
      severity: 'critical'
    }
  ],
  selectedCameraId: null,
  isLoading: false,

  setCameras: (cameras) => set({ cameras }),
  
  updateCamera: (id, updates) => set((state) => ({
    cameras: state.cameras.map(c => c.id === id ? { ...c, ...updates } : c)
  })),

  selectCamera: (id) => set({ selectedCameraId: id }),

  addAlert: (alert) => set((state) => ({
    alerts: [alert, ...state.alerts].slice(0, 50) // Keep last 50
  })),

  setLoading: (loading) => set({ isLoading: loading })
}));
