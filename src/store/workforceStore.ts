import { create } from 'zustand';
import { WorkforceCrew, DispatchAssignment } from '../types';

interface WorkforceStore {
  crews: WorkforceCrew[];
  assignments: DispatchAssignment[];
  selectedCrewId: string | null;
  isLoading: boolean;
  
  setCrews: (crews: WorkforceCrew[]) => void;
  updateCrew: (id: string, updates: Partial<WorkforceCrew>) => void;
  addAssignment: (assignment: DispatchAssignment) => void;
  updateAssignment: (id: string, updates: Partial<DispatchAssignment>) => void;
  removeFromAssignment: (id: string) => void;
  selectCrew: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useWorkforceStore = create<WorkforceStore>((set) => ({
  crews: [
    {
      id: 'w1',
      employeeCode: 'EMP-001',
      name: 'Ahmed Hassan',
      role: 'dispatcher',
      crewType: 'collection',
      assignedVehicle: 'v1',
      assignedZone: 'Sector 4 (North)',
      operationalStatus: 'available',
      shiftStatus: 'onDuty',
      activeIncidentId: null,
      workloadLevel: 45,
      location: { lat: 24.7136, lng: 46.6753 },
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'w2',
      employeeCode: 'EMP-002',
      name: 'Sara Al-Ghamdi',
      role: 'supervisor',
      crewType: 'inspection',
      assignedVehicle: null,
      assignedZone: 'Sector 2 (Central)',
      operationalStatus: 'responding',
      shiftStatus: 'onDuty',
      activeIncidentId: 'i2',
      workloadLevel: 85,
      location: { lat: 24.7236, lng: 46.6853 },
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'w3',
      employeeCode: 'EMP-003',
      name: 'Majid Al-Qahtani',
      role: 'maintenance',
      crewType: 'emergency',
      assignedVehicle: null,
      assignedZone: 'Industrial Zone',
      operationalStatus: 'responding',
      shiftStatus: 'onDuty',
      activeIncidentId: 'i3',
      workloadLevel: 95,
      location: { lat: 24.8136, lng: 46.7753 },
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'w4',
      employeeCode: 'EMP-004',
      name: 'Khalid Al-Mansour',
      role: 'driver',
      crewType: 'collection',
      assignedVehicle: 'v3',
      assignedZone: 'Sector 7 (East)',
      operationalStatus: 'available',
      shiftStatus: 'onDuty',
      activeIncidentId: null,
      workloadLevel: 20,
      location: { lat: 24.7036, lng: 46.6653 },
      lastUpdated: new Date().toISOString()
    }
  ],
  assignments: [],
  selectedCrewId: null,
  isLoading: false,

  setCrews: (crews) => set({ crews }),

  updateCrew: (id, updates) => set((state) => ({
    crews: state.crews.map(c => c.id === id ? { ...c, ...updates } : c)
  })),

  addAssignment: (assignment) => set((state) => ({
    assignments: [...state.assignments, assignment]
  })),

  updateAssignment: (id, updates) => set((state) => ({
    assignments: state.assignments.map(a => a.id === id ? { ...a, ...updates } : a)
  })),

  removeFromAssignment: (id) => set((state) => ({
    assignments: state.assignments.filter(a => a.id !== id)
  })),

  selectCrew: (id) => set({ selectedCrewId: id }),

  setLoading: (loading) => set({ isLoading: loading })
}));
