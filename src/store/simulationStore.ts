import { create } from 'zustand';
import { SimulationState, SimulationScenarioId, SimulationScenario } from '../types';

interface SimulationStore {
  state: SimulationState;
  scenarios: SimulationScenario[];
  
  startSimulation: (scenarioId: SimulationScenarioId) => void;
  stopSimulation: () => void;
  setSpeed: (speed: number) => void;
  updateMetrics: (metrics: Partial<SimulationState['metrics']>) => void;
  tick: () => void;
  cascadingRisks: CascadingRiskNode[];
}

export interface CascadingRiskNode {
  id: string;
  name: string;
  status: 'affected' | 'imminent' | 'stable';
  load: number;
}

const SCENARIOS: SimulationScenario[] = [
  {
    id: 'overflow_surge',
    name: 'City-wide Overflow Surge',
    description: 'Rapid increase in waste generation across all residential zones, stressing collection routes.',
    severity: 'high',
    icon: 'Waves'
  },
  {
    id: 'fleet_breakdown',
    name: 'Fleet Logistics Crisis',
    description: 'Multiple vehicle failures and maintenance delays impacting 30% of active collection fleet.',
    severity: 'critical',
    icon: 'Truck'
  },
  {
    id: 'methane_emergency',
    name: 'Facility Methane Spike',
    description: 'Critical methane leakage detected at primary landfill facilities, requiring immediate evacuation.',
    severity: 'critical',
    icon: 'Flame'
  },
  {
    id: 'operational_stress',
    name: 'Peak Operational Load',
    description: 'Combined stress test with high traffic, overflowing bins, and reduced facility capacity.',
    severity: 'medium',
    icon: 'Activity'
  },
  {
    id: 'communication_outage',
    name: 'Sensor Network Blackout',
    description: 'Intermittent signal loss across 40% of smart bins, requiring manual zone inspections.',
    severity: 'high',
    icon: 'WifiOff'
  }
];

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  state: {
    isActive: false,
    activeScenarioId: null,
    speed: 1,
    startTime: null,
    elapsedSeconds: 0,
    metrics: {
      impactScore: 0,
      affectedZones: 0,
      escalatedAlerts: 0
    }
  },
  scenarios: SCENARIOS,
  cascadingRisks: [
    { id: 'n1', name: 'Al-Olaya Sector 4', status: 'affected', load: 92 },
    { id: 'n2', name: 'Maather Node B', status: 'imminent', load: 84 },
    { id: 'n3', name: 'Diplomatic Zone Alpha', status: 'stable', load: 45 },
    { id: 'n4', name: 'Sulimaniyah Central', status: 'affected', load: 89 },
  ],

  startSimulation: async (scenarioId) => {
    // We will sync with backend
    try {
        await fetch('/api/simulation/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ scenarioId })
        });
        
        set((state) => ({
            state: {
              ...state.state,
              isActive: true,
              activeScenarioId: scenarioId,
              startTime: new Date().toISOString(),
              elapsedSeconds: 0,
              metrics: { impactScore: 15, affectedZones: 4, escalatedAlerts: 2 }
            }
        }));
    } catch (e) {
        console.error("Failed to start simulation on server", e);
    }
  },

  stopSimulation: async () => {
    try {
        await fetch('/api/simulation/stop', { method: 'POST' });
        
        set((state) => ({
            state: {
              ...state.state,
              isActive: false,
              activeScenarioId: null,
              startTime: null
            }
        }));
    } catch (e) {
        console.error("Failed to stop simulation on server", e);
    }
  },

  setSpeed: (speed) => set((state) => ({
    state: { ...state.state, speed }
  })),

  updateMetrics: (metrics) => set((state) => ({
    state: { ...state.state, metrics: { ...state.state.metrics, ...metrics } }
  })),

  tick: () => set((state) => {
    if (!state.state.isActive) return state;
    return {
        state: {
            ...state.state,
            elapsedSeconds: state.state.elapsedSeconds + 1
        }
    };
  })
}));
