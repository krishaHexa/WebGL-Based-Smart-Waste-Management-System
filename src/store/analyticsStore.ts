import { create } from 'zustand';
import { AnalyticsKPIs, AnalyticsTrendPoint, ForecastProjectedValue } from '../types';

interface AnalyticsState {
  kpis: AnalyticsKPIs;
  efficiencyTrend: AnalyticsTrendPoint[];
  incidentTrend: AnalyticsTrendPoint[];
  forecasts: {
    overflow: ForecastProjectedValue[];
    demand: ForecastProjectedValue[];
  };
  isLoading: boolean;
  
  updateKPIs: (kpis: Partial<AnalyticsKPIs>) => void;
  setTrends: (efficiency: AnalyticsTrendPoint[], incidents: AnalyticsTrendPoint[]) => void;
  setForecasts: (overflow: ForecastProjectedValue[], demand: ForecastProjectedValue[]) => void;
  setLoading: (loading: boolean) => void;
}

const initialKPIs: AnalyticsKPIs = {
  efficiency: {
    overall: 88.5,
    routeOptimization: 92.1,
    collectionSpeed: 84.4,
    resourceUtilization: 79.8,
  },
  environmental: {
    methaneAverage: 4.2,
    carbonReduction: 1284,
    energyConsumption: 540,
    recyclingRate: 64.5,
  },
  incidents: {
    resolutionTime: 18.5,
    escalationRate: 4.2,
    riskScore: 32,
  },
  fleet: {
    avgFuelConsumption: 12.4,
    utilizationRate: 76.5,
    downtimePercentage: 2.1,
  },
  bins: {
    avgFillRate: 68.4,
    overflowProbability: 12.5,
    collectionUniformity: 82.1,
  }
};

const generateMockTrend = (length: number, base: number, variance: number): AnalyticsTrendPoint[] => {
  return Array.from({ length }).map((_, i) => ({
    timestamp: new Date(Date.now() - (length - i) * 3600000).toISOString(),
    value: base + (Math.random() - 0.5) * variance
  }));
};

const generateMockForecast = (length: number, base: number): ForecastProjectedValue[] => {
  const actuals = Array.from({ length: 7 }).map((_, i) => ({
    time: `D-${7-i}`,
    actual: base + (Math.random() - 0.5) * 10,
    projected: null
  }));
  
  const projections = Array.from({ length: 5 }).map((_, i) => ({
    time: `D+${i+1}`,
    actual: null,
    projected: base + (Math.random() - 0.5) * 15 + (i * 2) 
  }));

  return [...actuals, ...projections];
};

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  kpis: initialKPIs,
  efficiencyTrend: generateMockTrend(24, 85, 10),
  incidentTrend: generateMockTrend(24, 5, 4),
  forecasts: {
    overflow: generateMockForecast(12, 15),
    demand: generateMockForecast(12, 40),
  },
  isLoading: false,

  updateKPIs: (newKpis) => set((state) => ({ 
    kpis: { ...state.kpis, ...newKpis } 
  })),
  
  setTrends: (efficiency, incidents) => set({ 
    efficiencyTrend: efficiency, 
    incidentTrend: incidents 
  }),
  
  setForecasts: (overflow, demand) => set({ 
    forecasts: { overflow, demand } 
  }),
  
  setLoading: (loading) => set({ isLoading: loading })
}));
