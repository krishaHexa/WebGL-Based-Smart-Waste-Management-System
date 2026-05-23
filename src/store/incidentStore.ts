import { create } from 'zustand';
import { OperationalIncident, IncidentStatus, IncidentSeverity } from '../types';

interface IncidentFilters {
  severity: IncidentSeverity | 'all';
  status: IncidentStatus | 'all';
  module: 'fleet' | 'bins' | 'facilities' | 'all';
}

interface IncidentState {
  incidents: OperationalIncident[];
  selectedIncidentId: string | null;
  filters: IncidentFilters;
  addIncident: (incident: OperationalIncident) => void;
  updateIncidentStatus: (id: string, status: IncidentStatus, notes?: string) => void;
  setIncidents: (incidents: OperationalIncident[]) => void;
  setSelectedIncidentId: (id: string | null) => void;
  setFilters: (filters: Partial<IncidentFilters>) => void;
  getFilteredIncidents: () => OperationalIncident[];
  clearAllIncidents: () => void;
  removeIncident: (id: string) => void;
  escalateIncident: (id: string) => void;
}

export const useIncidentStore = create<IncidentState>((set, get) => ({
  incidents: [
    {
      id: 'i1',
      incidentCode: 'INC-2026-001',
      title: 'Smart Bin Overflow Alert',
      description: 'Bin #BIN-CENT-002 at Riyadh Square South has reached critical capacity (98%). Immediate collection required.',
      incidentType: 'overflow',
      severity: 'critical',
      sourceModule: 'bins',
      relatedEntityId: 'b2',
      location: { lat: 24.7156, lng: 46.6773 },
      status: 'assigned',
      createdAt: '2026-05-13T08:30:00Z',
      updatedAt: '2026-05-13T09:00:00Z',
      assignedOperator: 'Ahmed Hassan',
      escalationLevel: 1,
      history: [
        { timestamp: '2026-05-13T08:30:00Z', status: 'detected', message: 'System automated overflow detection' },
        { timestamp: '2026-05-13T08:45:00Z', status: 'acknowledged', message: 'Dispatch operator acknowledged' },
        { timestamp: '2026-05-13T09:00:00Z', status: 'assigned', message: 'Assigned to Unit Alpha-10', operator: 'Sara Al-Ghamdi' }
      ],
      linkedAssets: ['v1', 'b2']
    },
    {
      id: 'i2',
      incidentCode: 'INC-2026-002',
      title: 'Vehicle Route Deviation',
      description: 'Truck #TRK-RIY-002 (Abdullah Al-Fahad) has deviated from path SOUTH-COLLECTION-04 by > 500m.',
      incidentType: 'route_deviation',
      severity: 'medium',
      sourceModule: 'fleet',
      relatedEntityId: 'v2',
      location: { lat: 24.7236, lng: 46.6853 },
      status: 'acknowledged',
      createdAt: '2026-05-13T09:15:00Z',
      updatedAt: '2026-05-13T09:20:00Z',
      assignedOperator: 'Sara Al-Ghamdi',
      escalationLevel: 0,
      history: [
        { timestamp: '2026-05-13T09:15:00Z', status: 'detected', message: 'Operational telemetry alert' }
      ],
      linkedAssets: ['v2']
    },
    {
      id: 'i3',
      incidentCode: 'INC-2026-003',
      title: 'High Methane Level Warning',
      description: 'Sensor data from Riyadh North Landfill indicates methane levels rising above safety threshold (1.2%).',
      incidentType: 'environmental_risk',
      severity: 'high',
      sourceModule: 'facilities',
      relatedEntityId: 'f1',
      location: { lat: 24.8136, lng: 46.7753 },
      status: 'in-progress',
      createdAt: '2026-05-13T07:45:00Z',
      updatedAt: '2026-05-13T08:30:00Z',
      assignedOperator: 'Majid Al-Qahtani',
      escalationLevel: 2,
      history: [
        { timestamp: '2026-05-13T07:45:00Z', status: 'detected', message: 'Node f1 telemetry alert' },
        { timestamp: '2026-05-13T08:30:00Z', status: 'in-progress', message: 'Environmental team on site', operator: 'Majid Al-Qahtani' }
      ],
      linkedAssets: ['f1']
    }
  ],
  selectedIncidentId: null,
  filters: {
    severity: 'all',
    status: 'all',
    module: 'all'
  },
  addIncident: (incident) => set((state) => ({ 
    incidents: [incident, ...state.incidents].slice(0, 100)
  })),
  updateIncidentStatus: (id, status, notes) => set((state) => ({
    incidents: state.incidents.map((inc) => 
      inc.id === id ? { 
        ...inc, 
        status, 
        resolutionNotes: notes ?? inc.resolutionNotes,
        updatedAt: new Date().toISOString(),
        history: [...inc.history, { timestamp: new Date().toISOString(), status, message: notes || `Status updated to ${status}` }]
      } : inc
    )
  })),
  setIncidents: (incidents) => set({ incidents }),
  setSelectedIncidentId: (id) => set({ selectedIncidentId: id }),
  setFilters: (newFilters) => set((state) => ({ 
    filters: { ...state.filters, ...newFilters } 
  })),
  getFilteredIncidents: () => {
    const { incidents, filters } = get();
    return incidents.filter(inc => {
      const matchSeverity = filters.severity === 'all' || inc.severity === filters.severity;
      const matchStatus = filters.status === 'all' || inc.status === filters.status;
      const matchModule = filters.module === 'all' || inc.sourceModule === filters.module;
      return matchSeverity && matchStatus && matchModule;
    });
  },
  clearAllIncidents: () => set({ incidents: [] }),
  removeIncident: (id) => set((state) => ({
    incidents: state.incidents.filter(inc => inc.id !== id)
  })),
  escalateIncident: (id) => set((state) => {
    const severities: IncidentSeverity[] = ['low', 'medium', 'high', 'critical'];
    return {
      incidents: state.incidents.map((inc) => {
        if (inc.id === id) {
          const currentIndex = severities.indexOf(inc.severity);
          const nextSeverity = severities[Math.min(currentIndex + 1, severities.length - 1)];
          return { 
            ...inc, 
            severity: nextSeverity, 
            escalationLevel: (inc.escalationLevel || 0) + 1,
            updatedAt: new Date().toISOString()
          };
        }
        return inc;
      })
    };
  })
}));
