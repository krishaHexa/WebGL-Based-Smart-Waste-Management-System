import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createServer as createHttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createHttpServer(app);
  const io = new SocketServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // API health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Advanced Fleet Simulation
  const fleetCount = 15;
  let vehicles = Array.from({ length: fleetCount }).map((_, i) => ({
    id: `v-${i}`,
    vehicleCode: `TRK-${100 + i}`,
    driverName: ["John Doe", "Sarah Smith", "Mike Ross", "Elena Fisher", "David Miller"][i % 5],
    type: "truck",
    status: i % 7 === 0 ? "maintenance" : i % 5 === 0 ? "idle" : "active",
    location: { 
      lat: 24.7136 + (Math.random() - 0.5) * 0.04, 
      lng: 46.6753 + (Math.random() - 0.5) * 0.04 
    },
    speed: 0,
    heading: Math.random() * 360,
    fuelLevel: 40 + Math.random() * 60,
    currentLoad: 0,
    capacity: 2000,
    loadPercentage: Math.random() * 80,
    currentRoute: `Route ${String.fromCharCode(65 + (i % 6))}`,
    alertState: "normal",
    lastUpdate: new Date().toISOString()
  }));

  // Advanced Smart Bin Simulation
  const binCount = 150;
  let bins = Array.from({ length: binCount }).map((_, i) => ({
    id: `b-${i}`,
    binCode: `BIN-${2000 + i}`,
    type: "bin",
    status: Math.random() > 0.98 ? "maintenance" : "active",
    location: { 
      lat: 24.7136 + (Math.random() - 0.5) * 0.08, 
      lng: 46.6753 + (Math.random() - 0.5) * 0.08 
    },
    fillLevel: Math.random() * 60,
    wasteType: ["general", "recyclable", "organic", "hazardous"][i % 4],
    collectionPriority: "low",
    temperature: 20 + Math.random() * 10,
    batteryLevel: 80 + Math.random() * 20,
    lastCollected: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
    alertState: "normal",
    lastUpdate: new Date().toISOString()
  }));

  // Advanced Facility Simulation
  const facilityTypes: any[] = ["landfill", "recycling_center", "transfer_station", "waste_to_energy"];
  let facilities = Array.from({ length: 12 }).map((_, i) => ({
    id: `f-${i}`,
    facilityCode: `FAC-${500 + i}`,
    name: `Ops Center ${String.fromCharCode(65 + i)}`,
    type: "facility",
    facilityType: facilityTypes[i % 4],
    status: "operational",
    operationalStatus: "operational",
    location: { 
      lat: 24.7136 + (Math.random() - 0.5) * 0.12, 
      lng: 46.6753 + (Math.random() - 0.5) * 0.12 
    },
    capacityPercentage: 30 + Math.random() * 40,
    methaneLevel: 2 + Math.random() * 5,
    temperature: 18 + Math.random() * 10,
    energyConsumption: 100 + Math.random() * 500,
    equipmentHealth: 90 + Math.random() * 10,
    environmentalRisk: "low",
    activeAlerts: [],
    alertState: "normal",
    lastUpdate: new Date().toISOString()
  }));

  // Surveillance CCTV Simulation
  const cameraCount = 12;
  const cameraZones = ["Zone_A", "Zone_B", "Zone_C", "Zone_D"];
  const cameraTypes: any[] = ["traffic", "facility", "landfill", "gate", "perimeter", "street"];
  let cameras = Array.from({ length: cameraCount }).map((_, i) => ({
    id: `cam-${i}`,
    cameraCode: `CCTV-${500 + i}`,
    cameraName: `Camera ${String.fromCharCode(65 + i)}`,
    location: {
      lat: 24.7136 + (Math.random() - 0.5) * 0.1,
      lng: 46.6753 + (Math.random() - 0.5) * 0.1
    },
    facilityZone: cameraZones[i % cameraZones.length],
    operationalStatus: Math.random() > 0.95 ? "degraded" : "online",
    cameraType: cameraTypes[i % cameraTypes.length],
    streamStatus: "active",
    incidentLinked: false,
    networkHealth: 90 + Math.random() * 10,
    lastUpdate: new Date().toISOString()
  }));

  // Workforce & Dispatch Simulation
  const workforceCount = 20;
  const workforceRoles: any[] = ["driver", "fieldOperator", "supervisor", "maintenance", "dispatcher"];
  const crewTypes: any[] = ["collection", "emergency", "maintenance", "environmental", "inspection"];
  const shiftStatuses: any[] = ["onDuty", "offDuty", "break", "overtime"];
  let workforce = Array.from({ length: workforceCount }).map((_, i) => ({
    id: `crew-${i}`,
    employeeCode: `EMP-${3000 + i}`,
    name: ["Alex Rivera", "Jordan Casey", "Sam Taylor", "Morgan Lee", "Jamie Chen", "Pat Kim", "Taylor Quinn", "Casey West", "Riley North", "Sage South"][i % 10],
    role: workforceRoles[i % workforceRoles.length],
    crewType: crewTypes[i % crewTypes.length],
    assignedVehicle: i < fleetCount ? `TRK-${100 + i}` : null,
    assignedZone: `Sector ${String.fromCharCode(65 + (i % 6))}`,
    operationalStatus: "available",
    shiftStatus: i % 15 === 0 ? "break" : "onDuty",
    activeIncidentId: null,
    workloadLevel: 20 + Math.random() * 30,
    location: {
      lat: 24.7136 + (Math.random() - 0.5) * 0.1,
      lng: 46.6753 + (Math.random() - 0.5) * 0.1
    },
    lastUpdated: new Date().toISOString()
  }));

  // Incident Simulation Logic
  let incidents: any[] = [];
  const generateIncident = (source: 'fleet' | 'bins' | 'facilities', entityId: string, type: any, severity: any, title: string, description: string, location: any) => {
    const id = `inc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newIncident = {
      id,
      incidentCode: `INC-${1000 + incidents.length}`,
      title,
      description,
      incidentType: type,
      severity,
      sourceModule: source,
      relatedEntityId: entityId,
      location,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      escalationLevel: severity === 'critical' ? 2 : severity === 'high' ? 1 : 0
    };
    incidents = [newIncident, ...incidents].slice(0, 50);
    return newIncident;
  };

  // AI Assistant Context Builder
  const getOperationalContext = (): any => {
    const fleetStatus = vehicles.reduce((acc: any, v) => {
      acc[v.status] = (acc[v.status] || 0) + 1;
      return acc;
    }, {});

    const binTypes = bins.reduce((acc: any, b) => {
      acc[b.wasteType] = (acc[b.wasteType] || 0) + 1;
      return acc;
    }, {});

    const facilityRisks = facilities.reduce((acc: any, f) => {
      acc[f.environmentalRisk] = (acc[f.environmentalRisk] || 0) + 1;
      return acc;
    }, {});

    const activeIncidents = incidents.filter(i => i.status !== 'resolved');
    const incidentTypes = activeIncidents.reduce((acc: any, i) => {
      acc[i.incidentType] = (acc[i.incidentType] || 0) + 1;
      return acc;
    }, {});

    return {
      fleet: {
        total: vehicles.length,
        active: fleetStatus.active || 0,
        maintenance: fleetStatus.maintenance || 0,
        idle: fleetStatus.idle || 0,
        avgFuel: vehicles.reduce((s, v) => s + v.fuelLevel, 0) / vehicles.length
      },
      bins: {
        total: bins.length,
        overflowing: bins.filter(b => b.fillLevel > 90).length,
        avgFillLevel: bins.reduce((s, b) => s + b.fillLevel, 0) / bins.length,
        wasteTypeDistribution: binTypes
      },
      facilities: {
        total: facilities.length,
        avgCapacity: facilities.reduce((s, f) => s + f.capacityPercentage, 0) / facilities.length,
        avgMethane: facilities.reduce((s, f) => s + f.methaneLevel, 0) / facilities.length,
        riskDistribution: facilityRisks
      },
      incidents: {
        active: activeIncidents.length,
        critical: activeIncidents.filter(i => i.severity === 'critical').length,
        high: activeIncidents.filter(i => i.severity === 'high').length,
        types: incidentTypes
      }
    };
  };

  // AI Assistant Route
  app.post("/api/ai/chat", async (req, res) => {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    try {
      const { getAiResponse } = await import("./src/services/aiService.server.ts");
      const context = getOperationalContext();
      const response = await getAiResponse(message, context, history || []);
      res.json({ response });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Simulation Engine State
  let activeSimulation: {
    isActive: boolean;
    scenarioId: string | null;
    startTime: string | null;
  } = {
    isActive: false,
    scenarioId: null,
    startTime: null
  };

  // API Simulation Endpoints
  app.post("/api/simulation/start", (req, res) => {
    const { scenarioId } = req.body;
    activeSimulation = {
      isActive: true,
      scenarioId,
      startTime: new Date().toISOString()
    };

    // Inject initial incident for the scenario
    if (scenarioId === 'overflow_surge') {
        generateIncident('bins', 'b-0', 'overflow', 'high', 'Mass Overflow Surge Initialized', 'Predictive models indicate a massive surge in bin fill rates across city center.', bins[0].location);
    } else if (scenarioId === 'fleet_breakdown') {
        generateIncident('fleet', 'v-0', 'vehicle_failure', 'critical', 'Fleet Breakdown Scenario', 'Critical failure cluster triggered. 30% of fleet entering maintenance state.', vehicles[0].location);
        // Force some vehicles into maintenance
        vehicles.slice(0, 5).forEach(v => v.status = 'maintenance');
    } else if (scenarioId === 'methane_emergency') {
        generateIncident('facilities', 'f-0', 'environmental_risk', 'critical', 'Methane Crisis Initialized', 'Critical methane spike detected at primary facility.', facilities[0].location);
    }

    io.emit("telemetry:update", { type: "INCIDENT_UPDATE", data: incidents });
    res.json({ status: "simulation_started", scenarioId });
  });

  app.post("/api/simulation/stop", (req, res) => {
    activeSimulation = {
      isActive: false,
      scenarioId: null,
      startTime: null
    };
    // Revert some states if needed
    vehicles.forEach(v => {
        if (v.status === 'maintenance' && Math.random() > 0.5) v.status = 'active';
    });
    res.json({ status: "simulation_stopped" });
  });

  io.on("connection", (socket) => {
    console.log("Operational Node Connected");
    
    // Initial data burst
    socket.emit("telemetry:update", {
      type: "METRICS_UPDATE",
      data: { totalAssets: 1240, activeVehicles: fleetCount - 2, alertCount: 3, collectionEfficiency: 88 }
    });

    socket.emit("telemetry:update", {
      type: "INCIDENT_UPDATE",
      data: incidents
    });

    socket.emit("telemetry:update", {
      type: "CCTV_UPDATE",
      data: cameras
    });

    socket.emit("telemetry:update", {
      type: "WORKFORCE_UPDATE",
      data: workforce
    });

    const simulationInterval = setInterval(() => {
      const activeIncidentsCount = incidents.filter(i => i.status !== 'resolved').length;
      const simMod = activeSimulation.isActive ? 3.0 : 1.0;

      // Initial data burst
      socket.emit("telemetry:update", {
        type: "METRICS_UPDATE",
        data: { totalAssets: 1240, activeVehicles: fleetCount - 2, alertCount: activeIncidentsCount, collectionEfficiency: activeSimulation.isActive ? 64 : 88 }
      });
      vehicles = vehicles.map(v => {
        if (v.status !== 'active') return { ...v, speed: 0, lastUpdate: new Date().toISOString() };

        // Simple movement logic
        const speed = (25 + Math.random() * 15) * (activeSimulation.scenarioId === 'operational_stress' ? 0.6 : 1.0);
        const headingVar = (Math.random() - 0.5) * 10;
        const newHeading = (v.heading + headingVar + 360) % 360;
        
        // Approx conversion for demo movement
        const moveScale = 0.0001; 
        const rad = (newHeading * Math.PI) / 180;
        const dLat = Math.cos(rad) * moveScale;
        const dLng = Math.sin(rad) * moveScale;

        const updatedV = {
          ...v,
          location: {
            lat: v.location.lat + dLat,
            lng: v.location.lng + dLng
          },
          speed,
          heading: newHeading,
          fuelLevel: Math.max(0, v.fuelLevel - 0.01),
          loadPercentage: Math.min(100, v.loadPercentage + 0.02),
          alertState: Math.random() > 0.999 ? "critical" : v.alertState,
          lastUpdate: new Date().toISOString()
        };

        // Trigger Incident on Critical State
        if (updatedV.alertState === "critical" && v.alertState !== "critical") {
          const inc = generateIncident(
            'fleet', v.id, 'vehicle_failure', 'critical', 
            `Vehicle Failure: ${v.vehicleCode}`, 
            `Critical mechanical failure detected on vehicle ${v.vehicleCode}. Immediate dispatch required.`,
            v.location
          );
          socket.emit("telemetry:update", { type: "INCIDENT_UPDATE", data: incidents });
        }

        return updatedV;
      });

      socket.emit("telemetry:update", {
        type: "FLEET_UPDATE",
        data: vehicles
      });

      // Periodic Bin updates
      bins = bins.map(b => {
        // Fill growth
        let fillMod = 1.0;
        if (activeSimulation.scenarioId === 'overflow_surge') fillMod = 5.0;
        else if (activeSimulation.scenarioId === 'operational_stress') fillMod = 2.0;

        let fillLevel = b.fillLevel + (Math.random() * 0.5 * fillMod);
        if (fillLevel > 100) fillLevel = 100;

        // Pulse overflow incident
        if (fillLevel > 98 && b.alertState !== 'critical') {
           const inc = generateIncident(
            'bins', b.id, 'overflow', 'high', 
            `Bin Overflow: ${b.binCode}`, 
            `Waste level reached critical threshold at bin ${b.binCode}. Priority collection assigned.`,
            b.location
          );
          socket.emit("telemetry:update", { type: "INCIDENT_UPDATE", data: incidents });
        }

        // Priority logic
        let priority: any = "low";
        if (fillLevel > 90) priority = "urgent";
        else if (fillLevel > 75) priority = "high";
        else if (fillLevel > 50) priority = "medium";

        // Alert state
        let alert: any = "normal";
        if (fillLevel > 95) alert = "critical";
        else if (fillLevel > 80) alert = "warning";

        // Random collection (reset) simulation
        if (fillLevel > 90 && Math.random() > 0.995) {
          fillLevel = 0;
          priority = "low";
          alert = "normal";
        }

        return {
          ...b,
          fillLevel,
          collectionPriority: priority,
          alertState: alert,
          temperature: Math.min(60, b.temperature + (Math.random() - 0.4)),
          batteryLevel: Math.max(0, b.batteryLevel - 0.001),
          lastUpdate: new Date().toISOString()
        };
      });

      // Periodic Facility updates
      facilities = facilities.map(f => {
        const capacityChange = (Math.random() - 0.2) * 0.1;
        
        let methaneMod = 1.0;
        if (activeSimulation.scenarioId === 'methane_emergency') methaneMod = 8.0;
        else if (activeSimulation.scenarioId === 'operational_stress') methaneMod = 1.5;

        const methaneChange = (Math.random() - 0.45) * 0.2 * methaneMod;
        const methaneLevel = Math.max(0, f.methaneLevel + methaneChange);
        const capacityPercentage = Math.min(100, Math.max(0, f.capacityPercentage + capacityChange));
        
        // Environmental Risk Incident
        if (methaneLevel > 18 && f.alertState !== 'critical') {
           const inc = generateIncident(
            'facilities', f.id, 'environmental_risk', 'critical', 
            `Methane Spike: ${f.name}`, 
            `Dangerous methane concentration detected at ${f.name}. Emergency shutdown initiated.`,
            f.location
          );
          socket.emit("telemetry:update", { type: "INCIDENT_UPDATE", data: incidents });
        }

        // Risk Logic
        let risk: any = "low";
        if (methaneLevel > 15 || capacityPercentage > 95) risk = "critical";
        else if (methaneLevel > 10 || capacityPercentage > 85) risk = "high";
        else if (methaneLevel > 7 || capacityPercentage > 70) risk = "medium";

        let alertState: any = "normal";
        let alerts = [];
        if (risk === "critical") {
          alertState = "critical";
          alerts.push("CRITICAL_METHANE_LEVEL");
        } else if (risk === "high") {
          alertState = "warning";
          alerts.push("ENVIRONMENTAL_THRESHOLD_WARNING");
        }

        return {
          ...f,
          capacityPercentage,
          methaneLevel,
          environmentalRisk: risk,
          operationalStatus: f.equipmentHealth < 70 ? "degraded" : "operational",
          energyConsumption: 100 + Math.random() * 500,
          equipmentHealth: Math.max(0, f.equipmentHealth - (Math.random() * 0.05)),
          activeAlerts: alerts,
          alertState,
          lastUpdate: new Date().toISOString()
        };
      });

      socket.emit("telemetry:update", {
        type: "FACILITY_UPDATE",
        data: facilities
      });

      socket.emit("telemetry:update", {
        type: "BIN_UPDATE",
        data: bins
      });

      // Periodic CCTV updates
      cameras = cameras.map(cam => {
        const activeIncidents = incidents.filter(i => i.status !== 'resolved');
        const isLinked = activeIncidents.some(inc => {
          const dLat = Math.abs(inc.location.lat - cam.location.lat);
          const dLng = Math.abs(inc.location.lng - cam.location.lng);
          return dLat < 0.01 && dLng < 0.01;
        });

        const healthDegradation = (Math.random() - 0.5) * 0.5;
        const networkHealth = Math.min(100, Math.max(0, cam.networkHealth + healthDegradation));
        
        let operationalStatus = cam.operationalStatus;
        if (networkHealth < 30) operationalStatus = 'offline';
        else if (networkHealth < 70) operationalStatus = 'degraded';
        else operationalStatus = 'online';

        let streamStatus = cam.streamStatus;
        if (operationalStatus === 'offline') streamStatus = 'disconnected';
        else if (operationalStatus === 'degraded' && Math.random() > 0.8) streamStatus = 'reconnecting';
        else streamStatus = 'active';

        return {
          ...cam,
          incidentLinked: isLinked,
          networkHealth,
          operationalStatus,
          streamStatus,
          lastUpdate: new Date().toISOString()
        };
      });

      socket.emit("telemetry:update", {
        type: "CCTV_UPDATE",
        data: cameras
      });

      // Periodic Workforce updates
      workforce = workforce.map(crew => {
        const activeIncidents = incidents.filter(i => i.status === 'active');
        
        let operationalStatus = crew.operationalStatus;
        let activeIncidentId = crew.activeIncidentId;
        let workloadLevel = crew.workloadLevel;

        // Randomly assign available crews to active incidents
        if (operationalStatus === 'available' && activeIncidents.length > 0 && Math.random() > 0.8) {
          const inc = activeIncidents[0]; // Simplistic assignment
          operationalStatus = 'dispatched';
          activeIncidentId = inc.id;
          workloadLevel = Math.min(100, workloadLevel + 20);
        }

        // Random movement
        const lat = crew.location.lat + (Math.random() - 0.5) * 0.001;
        const lng = crew.location.lng + (Math.random() - 0.5) * 0.001;

        return {
          ...crew,
          operationalStatus,
          activeIncidentId,
          workloadLevel: Math.max(0, workloadLevel + (Math.random() - 0.5) * 2),
          location: { lat, lng },
          lastUpdated: new Date().toISOString()
        };
      });

      socket.emit("telemetry:update", {
        type: "WORKFORCE_UPDATE",
        data: workforce
      });

      // Heartbeat
      socket.emit("telemetry:update", {
        type: "HEARTBEAT",
        timestamp: new Date().toISOString(),
        status: "OPERATIONAL"
      });
    }, 2000);

    socket.on("disconnect", () => {
      clearInterval(simulationInterval);
      console.log("Operational Node Disconnected");
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
