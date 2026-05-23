import React from 'react';
import { Polyline, CircleMarker, Tooltip } from 'react-leaflet';
import AssetMarker from './AssetMarker';
import { useMapStore } from '../../store/mapStore';
import { useFleetStore } from '../../store/fleetStore';
import { useBinStore } from '../../store/binStore';
import { useFacilityStore } from '../../store/facilityStore';
import { useIncidentStore } from '../../store/incidentStore';
import { useSurveillanceStore } from '../../store/surveillanceStore';
import { useWorkforceStore } from '../../store/workforceStore';
import { useRouteStore } from '../../store/routeStore';
import { 
  Truck, 
  Trash2, 
  Building2, 
  AlertTriangle, 
  Camera, 
  Users,
  Navigation
} from 'lucide-react';
import { OperationalStatus } from '../../types';
import { cn } from '@/lib/utils';

const MovingVehicle: React.FC<{ path: { lat: number; lng: number }[], color: string, name: string }> = ({ path, color, name }) => {
  const [position, setPosition] = React.useState<[number, number]>([path[0].lat, path[0].lng]);
  const progressRef = React.useRef(0);
  const lastUpdateRef = React.useRef(Date.now());
  
  React.useEffect(() => {
    let animationFrameId: number;
    
    const animate = () => {
      const now = Date.now();
      const delta = now - lastUpdateRef.current;
      lastUpdateRef.current = now;

      // Advance progress based on delta time
      const speed = 0.05 + Math.random() * 0.02; // Path full cycle in ~15-20 seconds
      progressRef.current = (progressRef.current + (delta / 1000) * speed) % 1;

      const pathLength = path.length - 1;
      const exactIndex = progressRef.current * pathLength;
      const index = Math.floor(exactIndex);
      const nextIndex = (index + 1) % path.length;
      const mix = exactIndex - index;

      const currentPoint = path[index];
      const nextPoint = path[nextIndex];

      if (currentPoint && nextPoint) {
        const lat = currentPoint.lat + (nextPoint.lat - currentPoint.lat) * mix;
        const lng = currentPoint.lng + (nextPoint.lng - currentPoint.lng) * mix;
        setPosition([lat, lng]);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [path]);

  if (!path || path.length === 0) return null;

  return (
    <CircleMarker 
      center={position} 
      radius={6} 
      pathOptions={{ 
        color, 
        fillColor: 'white', 
        fillOpacity: 1, 
        weight: 3,
        className: 'animate-pulse' 
      }}
    >
      <Tooltip direction="top" className="asset-tooltip">
        <div className="px-3 py-2">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">In-Transit</p>
           <p className="text-xs font-bold text-slate-900">{name}</p>
        </div>
      </Tooltip>
    </CircleMarker>
  );
};

interface OperationalMapLayersProps {
  onlyShowLayer?: string;
}

const OperationalMapLayers: React.FC<OperationalMapLayersProps> = ({ onlyShowLayer }) => {
  const { layers } = useMapStore();

  const isLayerVisible = (layerId: string) => {
    if (onlyShowLayer) return onlyShowLayer === layerId;
    return layers[layerId as keyof typeof layers];
  };
  
  const { vehicles, selectVehicle, selectedVehicleId } = useFleetStore();
  const { bins, selectBin } = useBinStore();
  const { facilities, selectFacility } = useFacilityStore();
  const { incidents, setSelectedIncidentId } = useIncidentStore();
  const { cameras, selectCamera } = useSurveillanceStore();
  const { crews, selectCrew } = useWorkforceStore();
  const { routes, selectRoute } = useRouteStore();

  const getRouteColor = (status: string, efficiency: number) => {
    switch (status) {
      case 'active': return '#10b981'; // Green (Active)
      case 'completed': return '#3b82f6'; // Blue (Completed/Active Alternative)
      case 'pending': return '#94a3b8'; // Gray (Inactive)
      case 'delayed': return '#f59e0b'; // Amber (Delayed)
      case 'conflict': return '#ef4444'; // Red (Conflict)
      default: return '#3b82f6';
    }
  };

  return (
    <>
      {/* 0. Operational Routes */}
      {isLayerVisible('routes') && routes.map((route) => (
        <Polyline
          key={route.id}
          positions={route.path.map(p => [p.lat, p.lng] as [number, number])}
          pathOptions={{
            color: getRouteColor(route.status, route.efficiencyRating),
            weight: selectedVehicleId && vehicles.find(v => v.id === selectedVehicleId)?.assignedRouteId === route.routeName ? 8 : 4,
            opacity: selectedVehicleId 
              ? (vehicles.find(v => v.id === selectedVehicleId)?.assignedRouteId === route.routeName ? 1 : 0.2)
              : 0.6,
            dashArray: route.status === 'pending' ? '10, 10' : undefined,
            lineCap: 'round',
            lineJoin: 'round'
          }}
          eventHandlers={{
            click: () => selectRoute(route.id),
            mouseover: (e) => {
              const el = e.target;
              el.setStyle({ opacity: 1, weight: 6 });
            },
            mouseout: (e) => {
              const el = e.target;
              el.setStyle({ opacity: 0.6, weight: 4 });
            }
          }}
        >
          <Tooltip sticky>
            <div className="p-3 bg-white rounded-xl shadow-lg border border-slate-100 min-w-[200px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{route.routeCode}</span>
                <span className={cn(
                   "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase",
                   route.status === 'active' ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-500"
                )}>
                  {route.status}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-2">{route.routeName}</h4>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-50">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Efficiency</p>
                  <p className="text-xs font-bold text-slate-900">{route.efficiencyRating}%</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Est. Time</p>
                  <p className="text-xs font-bold text-slate-900">{route.estimatedTime}</p>
                </div>
              </div>
            </div>
          </Tooltip>
        </Polyline>
      ))}

      {/* 0.1 Animated Logistics Units */}
      {isLayerVisible('routes') && routes.filter(r => r.status === 'active').map((route) => (
        <MovingVehicle 
          key={`moving-${route.id}`} 
          path={route.path} 
          color={getRouteColor(route.status, route.efficiencyRating)}
          name={route.routeName}
        />
      ))}

      {/* 1. Fleet Vehicles */}
      {isLayerVisible('trucks') && vehicles.map((v) => (
        <AssetMarker
          key={v.id}
          position={[v.location.lat, v.location.lng]}
          icon={<Truck size={20} />}
          color={
            v.operationalState === 'maintenance' ? '#94a3b8' :
            v.operationalState === 'collecting' ? '#10b981' :
            v.operationalState === 'transporting' ? '#3b82f6' :
            v.operationalState === 'unloading' ? '#f59e0b' :
            '#3b82f6'
          }
          label={v.vehicleCode.split('-').pop()}
          onClick={() => selectVehicle(v.id)}
          isSelected={selectedVehicleId === v.id}
          tooltipData={{
            title: v.name,
            status: v.operationalState,
            type: `Lifecycle: ${v.operationalState.toUpperCase()}`,
            metrics: [
              { label: 'Waste', value: v.wasteType.toUpperCase() },
              { label: 'Load', value: v.loadPercentage, unit: '%' },
              { label: 'Fuel', value: v.fuelLevel, unit: '%' },
              { label: 'Speed', value: v.speed, unit: 'km/h' },
              { label: 'Heading', value: v.heading, unit: '°' }
            ]
          }}
        />
      ))}

      {/* Route Connections (Truck to Destination/Route) */}
      {isLayerVisible('trucks') && vehicles.filter(v => v.destinationFacilityId).map(v => {
        const facility = facilities.find(f => f.id === v.destinationFacilityId);
        if (!facility) return null;
        return (
          <Polyline 
            key={`truck-dest-${v.id}`}
            positions={[[v.location.lat, v.location.lng], [facility.location.lat, facility.location.lng]]}
            pathOptions={{ color: '#3b82f6', weight: 1.5, opacity: 0.3, dashArray: '5, 10' }}
          />
        );
      })}

      {/* 2. Smart Bins */}
      {isLayerVisible('bins') && bins.map((bin) => (
        <AssetMarker
          key={bin.id}
          position={[bin.location.lat, bin.location.lng]}
          icon={<Trash2 size={18} />}
          color={bin.alertState === 'critical' ? '#ef4444' : bin.fillLevel > 80 ? '#f97316' : '#10b981'}
          onClick={() => selectBin(bin.id)}
          tooltipData={{
            title: bin.name,
            status: bin.alertState,
            type: bin.wasteType.toUpperCase() + ' BIN',
            metrics: [
              { label: 'Fill Level', value: bin.fillLevel, unit: '%' },
              { label: 'Battery', value: bin.batteryLevel, unit: '%' },
              { label: 'Temp', value: bin.temperature, unit: '°C' }
            ]
          }}
        />
      ))}

      {/* 3. Facilities & Processing Zones */}
      {isLayerVisible('facilities') && facilities.map((f) => (
        <React.Fragment key={f.id}>
          <AssetMarker
            position={[f.location.lat, f.location.lng]}
            icon={<Building2 size={22} />}
            color={f.operationalStatus === 'degraded' ? '#f59e0b' : '#8b5cf6'}
            label="F"
            onClick={() => selectFacility(f.id)}
            tooltipData={{
              title: f.name,
              status: f.operationalStatus,
              type: f.facilityType.replace('_', ' ').toUpperCase(),
              metrics: [
                { label: 'Queue', value: f.queueLoad, unit: '%' },
                { label: 'Efficiency', value: f.equipmentHealth, unit: '%' },
                { label: 'Capacity', value: f.capacityPercentage, unit: '%' },
                { label: 'Active Mach', value: f.machines.filter(m => m.status === 'active').length }
              ]
            }}
          />
          {/* Facility Exclusion Zone / Queue Visualization */}
          <CircleMarker 
            center={[f.location.lat, f.location.lng]}
            radius={20}
            pathOptions={{ 
              color: f.queueLoad > 80 ? '#ef4444' : '#8b5cf6', 
              fillOpacity: 0.05, 
              weight: 1, 
              dashArray: '5, 5' 
            }}
          />
        </React.Fragment>
      ))}

      {/* 4. Incidents */}
      {isLayerVisible('incidents') && incidents.map((i) => (
        <AssetMarker
          key={i.id}
          position={[i.location.lat, i.location.lng]}
          icon={<AlertTriangle size={20} />}
          color={i.severity === 'critical' ? '#ef4444' : '#f59e0b'}
          onClick={() => setSelectedIncidentId(i.id)}
          tooltipData={{
            title: i.title,
            status: i.status,
            type: 'Operational Incident',
            metrics: [
              { label: 'Severity', value: i.severity },
              { label: 'Assigned To', value: i.assignedOperator || 'Unassigned' },
              { label: 'Reported By', value: 'System sensor' },
              { label: 'SLA Time', value: '15m remaining' }
            ]
          }}
        />
      ))}

      {/* 5. CCTV Cameras */}
      {isLayerVisible('cctv') && cameras.map((c) => (
        <AssetMarker
          key={c.id}
          position={[c.location.lat, c.location.lng]}
          icon={<Camera size={18} />}
          color="#64748b"
          onClick={() => selectCamera(c.id)}
          tooltipData={{
            title: c.cameraName,
            status: c.operationalStatus,
            type: 'CCTV Point',
            metrics: [
              { label: 'Resolution', value: '4K' },
              { label: 'Connection', value: 'Fiber' },
              { label: 'Recording', value: 'Active' },
              { label: 'AI Detection', value: 'Enabled' }
            ]
          }}
        />
      ))}

      {/* 6. Workforce */}
      {isLayerVisible('workforce') && crews.map((w) => (
        <AssetMarker
          key={w.id}
          position={[w.location.lat, w.location.lng]}
          icon={<Users size={18} />}
          color="#06b6d4"
          onClick={() => selectCrew(w.id)}
          tooltipData={{
            title: w.name,
            status: w.operationalStatus,
            type: 'Workforce Unit',
            metrics: [
              { label: 'Members', value: 2 },
              { label: 'Task', value: 'Field maintenance' },
              { label: 'Battery', value: 88, unit: '%' },
              { label: 'Radio', value: 'CH-04' }
            ]
          }}
        />
      ))}
    </>
  );
};

export default OperationalMapLayers;
