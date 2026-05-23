import { useAnalyticsStore } from '../store/analyticsStore';
import { useFleetStore } from '../store/fleetStore';
import { useBinStore } from '../store/binStore';
import { useFacilityStore } from '../store/facilityStore';
import { useIncidentStore } from '../store/incidentStore';
import { AnalyticsKPIs } from '../types';

class AnalyticsEngine {
  private intervalId: NodeJS.Timeout | null = null;

  start() {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
        this.runAggregation();
    }, 5000); // Aggregate every 5 seconds
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private runAggregation() {
    const fleet = useFleetStore.getState().vehicles;
    const bins = useBinStore.getState().bins;
    const facilities = useFacilityStore.getState().facilities;
    const incidents = useIncidentStore.getState().incidents;

    // Lightweight aggregation logic
    const activeFleet = fleet.filter(v => v.operationalStatus === 'ACTIVE');
    const utilizationRate = fleet.length > 0 ? (activeFleet.length / fleet.length) * 100 : 0;
    
    const filledBins = bins.filter(b => b.fillLevel > 80);
    const avgFillRate = bins.length > 0 ? bins.reduce((sum, b) => sum + b.fillLevel, 0) / bins.length : 0;
    const overflowProbability = bins.length > 0 ? (filledBins.length / bins.length) * 100 : 0;

    const avgMethane = facilities.length > 0 ? facilities.reduce((sum, f) => sum + f.methaneLevel, 0) / facilities.length : 0;
    const avgCapacity = facilities.length > 0 ? facilities.reduce((sum, f) => sum + f.capacityPercentage, 0) / facilities.length : 0;

    const activeIncidents = incidents.filter(i => i.status !== 'resolved');
    const riskScore = activeIncidents.reduce((sum, i) => sum + (i.severity === 'critical' ? 10 : i.severity === 'high' ? 5 : 2), 0);

    // Update the analytics store
    const update: Partial<AnalyticsKPIs> = {
        efficiency: {
            overall: 85 + Math.random() * 5,
            routeOptimization: 90 + Math.random() * 5,
            collectionSpeed: 80 + Math.random() * 10,
            resourceUtilization: utilizationRate
        },
        environmental: {
            methaneAverage: Number(avgMethane.toFixed(2)),
            carbonReduction: 1200 + Math.random() * 200,
            energyConsumption: 500 + Math.random() * 100,
            recyclingRate: 60 + Math.random() * 10
        },
        incidents: {
            resolutionTime: 15 + Math.random() * 10,
            escalationRate: (activeIncidents.filter(i => i.escalationLevel > 0).length / (activeIncidents.length || 1)) * 100,
            riskScore: Math.min(100, riskScore)
        },
        fleet: {
            avgFuelConsumption: 12 + Math.random() * 2,
            utilizationRate: utilizationRate,
            downtimePercentage: 2 + Math.random() * 1
        },
        bins: {
            avgFillRate: Number(avgFillRate.toFixed(1)),
            overflowProbability: Number(overflowProbability.toFixed(1)),
            collectionUniformity: 80 + Math.random() * 5
        }
    };

    useAnalyticsStore.getState().updateKPIs(update);
  }
}

export const analyticsEngine = new AnalyticsEngine();
