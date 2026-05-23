/**
 * Smart Waste Digital Twin - Core Types
 */

export enum OperationalStatus {
  HEALTHY = 'healthy',
  WARNING = 'warning',
  CRITICAL = 'critical',
  OFFLINE = 'offline',
  INFORMATIONAL = 'informational'
}

export type TruckStatus = 'AVAILABLE' | 'ACTIVE' | 'MAINTENANCE' | 'OFFLINE' | 'OVERLOADED' | 'RESERVED' | 'INSPECTION';

export interface GeoLocation {
  lat: number;
  lng: number;
  alt?: number;
}

export interface WasteAsset {
  id: string;
  name: string;
  type: 'truck' | 'bin' | 'facility';
  status: OperationalStatus;
  location: GeoLocation;
  lastUpdate: string;
}

export type WasteType = 'general' | 'recyclable' | 'organic' | 'hazardous' | 'industrial';
export type CollectionPriority = 'low' | 'medium' | 'high' | 'urgent';
export type FacilityType = 'landfill' | 'recycling_center' | 'transfer_station' | 'waste_to_energy';

export interface SmartBin extends WasteAsset {
  type: 'bin';
  binCode: string;
  fillLevel: number; // 0 to 100
  wasteType: WasteType;
  operationalStatus: OperationalStatus | 'active' | 'maintenance' | 'offline';
  collectionPriority: CollectionPriority;
  temperature: number;
  batteryLevel: number;
  lastCollected: string;
  alertState: 'normal' | 'warning' | 'critical';
}

export interface IndustrialMachine {
  id: string;
  name: string;
  type: 'conveyor' | 'compactor' | 'recycling_unit' | 'sorting_machine' | 'methane_system' | 'shredder';
  status: 'active' | 'idle' | 'overloaded' | 'maintenance' | 'fault';
  health: number;
  utilization: number;
  lastMaintenance: string;
}

export interface WasteFacility extends WasteAsset {
  type: 'facility';
  facilityCode: string;
  facilityType: FacilityType;
  operationalStatus: 'operational' | 'degraded' | 'maintenance' | 'offline';
  capacityPercentage: number;
  methaneLevel: number;
  temperature: number;
  energyConsumption: number;
  equipmentHealth: number;
  environmentalRisk: 'low' | 'medium' | 'high' | 'critical';
  activeAlerts: string[];
  supportedWasteTypes: WasteType[];
  queueLoad: number; // 0 to 100
  processingCapacity: number; // tons per hour
  machines: IndustrialMachine[];
}

export type TruckOperationalState = 'collecting' | 'transporting' | 'unloading' | 'returning' | 'maintenance' | 'idle';

export interface FleetVehicle extends WasteAsset {
  type: 'truck';
  vehicleCode: string;
  driverName: string;
  capacity: number;
  currentLoad: number;
  loadPercentage: number;
  speed: number;
  heading: number;
  fuelLevel: number;
  operationalStatus: TruckStatus;
  operationalState: TruckOperationalState;
  currentRoute: string;
  assignedRouteId?: string;
  wasteType: WasteType;
  alertState: 'normal' | 'warning' | 'critical';
  routePoints?: GeoLocation[];
  destinationFacilityId?: string;
}

export type IncidentType = 'overflow' | 'route_deviation' | 'vehicle_failure' | 'environmental_risk' | 'sensor_failure' | 'communication_loss' | 'unauthorized_dumping' | 'maintenance_required';
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus = 'detected' | 'acknowledged' | 'assigned' | 'in-progress' | 'escalated' | 'resolved' | 'closed';

export interface IncidentEvent {
  timestamp: string;
  status: IncidentStatus;
  message: string;
  operator?: string;
}

export interface OperationalIncident {
  id: string;
  incidentCode: string;
  title: string;
  description: string;
  incidentType: IncidentType;
  severity: IncidentSeverity;
  sourceModule: 'fleet' | 'bins' | 'facilities';
  relatedEntityId: string;
  location: GeoLocation;
  status: IncidentStatus;
  createdAt: string;
  updatedAt: string;
  assignedOperator?: string;
  escalationLevel: number;
  resolutionNotes?: string;
  history: IncidentEvent[];
  linkedAssets: string[]; // IDs
}

export interface DashboardMetrics {
  totalAssets: number;
  activeVehicles: number;
  alertCount: number;
  collectionEfficiency: number;
  activeTrucks: number;
  trucksDelivering: number;
  facilityQueueLoad: number;
  facilityProcessingCapacity: number;
  totalWasteCollectedToday: number;
  activeWorkforceUnits: number;
  routeOptimizationConflicts: number;
  overflowRiskZones: number;
  activeEnvironmentalAlerts: number;
  activeCCTVAlerts: number;
}

export interface AnalyticsTrendPoint {
  timestamp: string;
  value: number;
}

export interface OperationalEfficiency {
  overall: number;
  routeOptimization: number;
  collectionSpeed: number;
  resourceUtilization: number;
}

export interface EnvironmentalStats {
  methaneAverage: number;
  carbonReduction: number;
  energyConsumption: number;
  recyclingRate: number;
}

export interface ForecastProjectedValue {
  time: string;
  actual: number | null;
  projected: number | null;
}

export interface AnalyticsKPIs {
  efficiency: OperationalEfficiency;
  environmental: EnvironmentalStats;
  incidents: {
    resolutionTime: number; // in minutes
    escalationRate: number;
    riskScore: number;
  };
  fleet: {
    avgFuelConsumption: number;
    utilizationRate: number;
    downtimePercentage: number;
  };
  bins: {
    avgFillRate: number;
    overflowProbability: number;
    collectionUniformity: number;
  };
}

export type SimulationScenarioId = 'overflow_surge' | 'fleet_breakdown' | 'methane_emergency' | 'operational_stress' | 'communication_outage';

export interface SimulationScenario {
  id: SimulationScenarioId;
  name: string;
  description: string;
  severity: IncidentSeverity;
  icon: string; // lucide icon name
}

export interface SimulationState {
  isActive: boolean;
  activeScenarioId: SimulationScenarioId | null;
  speed: number;
  startTime: string | null;
  elapsedSeconds: number;
  metrics: {
    impactScore: number;
    affectedZones: number;
    escalatedAlerts: number;
  };
}

export type CameraType = 'traffic' | 'facility' | 'landfill' | 'gate' | 'perimeter' | 'street';
export type CameraStatus = 'online' | 'degraded' | 'offline' | 'maintenance';
export type StreamStatus = 'active' | 'reconnecting' | 'disconnected';

export interface SurveillanceCamera {
  id: string;
  cameraCode: string;
  cameraName: string;
  location: GeoLocation;
  facilityZone: string;
  operationalStatus: CameraStatus;
  cameraType: CameraType;
  streamStatus: StreamStatus;
  incidentLinked: boolean;
  networkHealth: number; // 0 to 100
  lastUpdated: string;
  streamUrl?: string; // Mock URL or placeholder
}

export interface SurveillanceAlert {
  id: string;
  cameraId: string;
  type: string;
  message: string;
  timestamp: string;
  severity: IncidentSeverity;
}

export type WorkforceRole = 'driver' | 'fieldOperator' | 'supervisor' | 'maintenance' | 'dispatcher';
export type CrewType = 'collection' | 'emergency' | 'maintenance' | 'environmental' | 'inspection';
export type WorkforceStatus = 'available' | 'dispatched' | 'responding' | 'maintenance' | 'offline';
export type ShiftStatus = 'onDuty' | 'offDuty' | 'break' | 'overtime';

export interface WorkforceCrew {
  id: string;
  employeeCode: string;
  name: string;
  role: WorkforceRole;
  crewType: CrewType;
  assignedVehicle: string | null;
  assignedZone: string;
  operationalStatus: WorkforceStatus;
  shiftStatus: ShiftStatus;
  activeIncidentId: string | null;
  workloadLevel: number; // 0 to 100
  location: GeoLocation;
  lastUpdated: string;
}

export interface DispatchAssignment {
  id: string;
  crewId: string;
  incidentId: string;
  assignedAt: string;
  status: 'assigned' | 'en_route' | 'on_site' | 'completed';
}
