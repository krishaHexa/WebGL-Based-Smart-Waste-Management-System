import { io, Socket } from 'socket.io-client';
import { useFleetStore } from '../store/fleetStore';
import { useBinStore } from '../store/binStore';
import { useIncidentStore } from '../store/incidentStore';
import { useDashboardStore } from '../store/dashboardStore';
import { useFacilityStore } from '../store/facilityStore';
import { useSurveillanceStore } from '../store/surveillanceStore';
import { useWorkforceStore } from '../store/workforceStore';
import { useLoadingStore } from '../store/loadingStore';
import { useRouteStore } from '../store/routeStore';

const GEOFENCES = [
  { id: 'geo1', name: 'Al Khair Restricted Zone', center: { lat: 24.8136, lng: 46.6753 }, radius: 0.005, type: 'restricted' },
  { id: 'geo2', name: 'Hazardous Sector Z4', center: { lat: 24.6536, lng: 46.6253 }, radius: 0.008, type: 'hazardous' }
];

class TelemetryService {
  private interval: NodeJS.Timeout | null = null;
  private routeProgress: Record<string, number> = {};

  connect() {
    if (this.interval) return;

    console.log('Telemetry Platform Connected (Simulated)');
    useLoadingStore.getState().setSocketConnected(true);
    useLoadingStore.getState().setTelemetryInitialized(true);

    this.interval = setInterval(() => {
      this.simulateDataUpdate();
    }, 2000); // Faster update for smooth animation
  }

  private simulateDataUpdate() {
    const fleetStore = useFleetStore.getState();
    const routeStore = useRouteStore.getState();
    const incidentStore = useIncidentStore.getState();
    
    if (fleetStore.vehicles.length > 0) {
      const updatedVehicles = fleetStore.vehicles.map(vehicle => {
        if (vehicle.operationalStatus !== 'ACTIVE') return vehicle;

        const route = routeStore.routes.find(r => r.routeName === vehicle.currentRoute || r.routeCode === vehicle.currentRoute);
        if (!route || !route.path || route.path.length < 2) return vehicle;

        // Animate along path
        let progress = this.routeProgress[vehicle.id] || 0;
        progress = (progress + 0.05) % route.path.length;
        this.routeProgress[vehicle.id] = progress;

        const segmentIndex = Math.floor(progress);
        const nextSegmentIndex = (segmentIndex + 1) % route.path.length;
        const subProgress = progress - segmentIndex;

        const start = route.path[segmentIndex];
        const end = route.path[nextSegmentIndex];

        const newLat = start.lat + (end.lat - start.lat) * subProgress;
        const newLng = start.lng + (end.lng - start.lng) * subProgress;

        // Geofencing check
        GEOFENCES.forEach(geo => {
          const dist = Math.sqrt(Math.pow(newLat - geo.center.lat, 2) + Math.pow(newLng - geo.center.lng, 2));
          if (dist < geo.radius && vehicle.alertState === 'normal') {
            incidentStore.addIncident({
              id: `geo-${Date.now()}-${vehicle.id}`,
              incidentCode: `GEO-${Math.floor(Math.random() * 9000)}`,
              title: 'Geofence Violation',
              description: `${vehicle.vehicleCode} entered ${geo.name} (${geo.type})`,
              incidentType: 'environmental_risk',
              severity: 'high',
              sourceModule: 'fleet',
              relatedEntityId: vehicle.id,
              location: { lat: newLat, lng: newLng },
              status: 'detected',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              escalationLevel: 1,
              history: [],
              linkedAssets: [vehicle.id]
            });
          }
        });

        return {
          ...vehicle,
          location: { lat: newLat, lng: newLng },
          speed: 20 + Math.random() * 40
        };
      });

      fleetStore.updateVehicles(updatedVehicles);
    }

    // Existing Bin simulation
    const binStore = useBinStore.getState();
    if (binStore.bins.length > 0) {
      const binIdx = Math.floor(Math.random() * binStore.bins.length);
      const bin = binStore.bins[binIdx];
      const newFill = Math.min(100, bin.fillLevel + Math.random() * 0.5);
      binStore.updateBins([{
        ...bin,
        fillLevel: newFill,
        alertState: newFill > 90 ? 'critical' : newFill > 80 ? 'warning' : 'normal'
      }]);
    }
  }

  disconnect() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    useLoadingStore.getState().setSocketConnected(false);
    useLoadingStore.getState().setTelemetryInitialized(false);
  }
}

export const telemetryService = new TelemetryService();
