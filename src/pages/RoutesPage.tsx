import React, { useState, useMemo } from 'react';
import { useRouteStore } from '../store/routeStore';
import { useFleetStore } from '../store/fleetStore';
import { useMapStore } from '../store/mapStore';
import DigitalTwinView from '@/components/visualization/DigitalTwinView';
import { 
  Route as RouteIcon, 
  Search, 
  Map as MapIcon, 
  List, 
  Clock, 
  TrendingUp,
  Settings2,
  Navigation,
  AlertCircle,
  Layers,
  Maximize2,
  ChevronRight,
  Zap,
  Activity,
  Globe,
  X,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import KPICard from '@/components/shared/KPICard';

const RoutesPage: React.FC = () => {
  const { routes, selectedRouteId, selectRoute, createOptimizedRoute, optimizationStatus, deleteRoute } = useRouteStore();
  const { vehicles } = useFleetStore();
  const { focusRegion } = useMapStore();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newRouteData, setNewRouteData] = useState({
    name: '',
    vehicleId: '',
    region: 'Riyadh Central'
  });

  const selectedRoute = useMemo(() => routes.find(r => r.id === selectedRouteId), [routes, selectedRouteId]);
  const assignedVehicle = useMemo(() => vehicles.find(v => v.id === selectedRoute?.assignedVehicleId), [vehicles, selectedRoute]);

  const availableVehicles = useMemo(() => {
    return vehicles.filter(v => v.operationalStatus === 'AVAILABLE' || v.currentRoute === 'NONE');
  }, [vehicles]);

  const regions = [
    'Riyadh Central',
    'Riyadh North',
    'Riyadh South',
    'Industrial Zone',
    'Landfill Corridor',
    'Diplomatic Quarter'
  ];

  const stats = useMemo(() => [
    { label: 'Dispatch Health', value: 98.4, unit: '%', variant: 'emerald' as const, progress: 98, icon: Activity },
    { label: 'Total Active Routes', value: routes.filter(r => r.status === 'active').length, subValue: `${routes.length} Total`, variant: 'blue' as const, icon: RouteIcon },
    { label: 'Optimization Conflicts', value: routes.filter(r => r.status === 'conflict').length, subValue: 'Action Required', variant: 'orange' as const, icon: AlertCircle },
    { label: 'Fuel Savings', value: 12.5, unit: '%', subValue: 'vs baseline', variant: 'purple' as const, icon: TrendingUp },
  ], [routes]);

  const filteredRoutes = useMemo(() => {
    return routes.filter(r => 
      r.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.routeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.assignedVehicleId && r.assignedVehicleId.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [routes, searchQuery]);

  const handleCreateRoute = async () => {
    if (!newRouteData.name || !newRouteData.vehicleId) return;
    await createOptimizedRoute(newRouteData);
    setIsCreating(false);
    setNewRouteData({ name: '', vehicleId: '', region: 'Riyadh Central' });
  };

  const handleSelectRoute = (id: string) => {
    selectRoute(id);
    const route = routes.find(r => r.id === id);
    if (route && route.path.length > 0) {
      focusRegion([route.path[0].lat, route.path[0].lng], 14);
    }
  };

  const regionCoords: Record<string, [number, number]> = {
    'Riyadh Central': [24.7136, 46.6753],
    'Riyadh North': [24.7736, 46.6753],
    'Riyadh South': [24.6336, 46.7153],
    'Industrial Zone': [24.5836, 46.8553],
    'Landfill Corridor': [24.8136, 46.7753],
    'Diplomatic Quarter': [24.6916, 46.6533]
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const region = e.target.value;
    setNewRouteData(prev => ({ ...prev, region }));
    const coords = regionCoords[region];
    if (coords) {
      focusRegion(coords, 13);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 p-6 overflow-hidden font-sans">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Logistical Planning Matrix</h1>
          <p className="text-[11px] font-bold text-slate-400 mt-0.5 uppercase tracking-[0.2em]">Multi-modal route optimization, real-time dispatch and efficiency</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
             <button 
               onClick={() => setViewMode('map')}
               className={cn(
                 "p-2 rounded-lg transition-all",
                 viewMode === 'map' ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-400 hover:text-slate-600"
               )}
             >
               <MapIcon size={14} />
             </button>
             <button 
               onClick={() => setViewMode('list')}
               className={cn(
                 "p-2 rounded-lg transition-all",
                 viewMode === 'list' ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-400 hover:text-slate-600"
               )}
             >
               <List size={14} />
             </button>
           </div>
           <button 
             onClick={() => setIsCreating(true)}
             className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all font-black text-[10px] uppercase tracking-widest"
           >
              <Zap size={12} />
              Optimize Sync
           </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <KPICard key={i} {...stat} value={stat.value} />
        ))}
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Route Planning Sidebar */}
        <div className="w-80 bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/30">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Identify Route Node..." 
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-[11px] font-bold focus:ring-4 focus:ring-blue-600/5 outline-none transition-all placeholder:text-slate-300"
                />
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
             {filteredRoutes.map(route => (
               <button
                 key={route.id}
                 onClick={() => handleSelectRoute(route.id)}
                 className={cn(
                   "w-full flex items-center gap-3 p-4 rounded-2xl transition-all text-left group relative border",
                   selectedRouteId === route.id ? "bg-blue-600 text-white border-blue-500 shadow-lg" : "bg-white border-slate-100 hover:border-blue-600/30 shadow-sm"
                 )}
               >
                 <div className={cn(
                   "w-10 h-10 rounded-xl flex items-center justify-center transition-colors border",
                   selectedRouteId === route.id ? "bg-white/20 border-white/20" : "bg-slate-50 text-slate-400 border-slate-100"
                 )}>
                   <RouteIcon size={18} />
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                       <span className={cn(
                         "text-[9px] font-black uppercase tracking-widest",
                         selectedRouteId === route.id ? "text-blue-100" : "text-slate-400"
                       )}>
                         {route.routeCode}
                       </span>
                       <div className="flex items-center gap-1">
                          <Clock size={10} className={selectedRouteId === route.id ? "text-blue-100" : "text-slate-300"} />
                          <span className={cn("text-[9px] font-black tabular-nums", selectedRouteId === route.id ? "text-blue-100" : "text-slate-400")}>
                            {route.estimatedTime}
                          </span>
                       </div>
                    </div>
                    <p className={cn(
                      "text-[11px] font-black truncate leading-none uppercase tracking-tight",
                      selectedRouteId === route.id ? "text-white" : "text-slate-900"
                    )}>
                      {route.routeName}
                    </p>
                    {route.needsOptimization && (
                      <p className={cn(
                        "text-[8px] font-black mt-1 uppercase tracking-widest flex items-center gap-1",
                        selectedRouteId === route.id ? "text-blue-100" : "text-red-500"
                      )}>
                        <AlertCircle size={10} />
                        Needs optimization
                      </p>
                    )}
                 </div>
                 <ChevronRight size={12} className={cn(
                   "transition-all",
                   selectedRouteId === route.id ? "text-white transform translate-x-1" : "text-slate-300 opacity-0 group-hover:opacity-100"
                 )} />
               </button>
             ))}
          </div>

          <div className="p-5 bg-slate-900">
             <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] text-white">
               <span className="flex items-center gap-2"><Globe size={12} className="text-blue-500" /> Infrastructure Link</span>
               <span className="text-emerald-500">Live</span>
             </div>
          </div>
        </div>

        {/* Map / List View Container */}
        <div className="flex-1 bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col items-center justify-center relative">
          {viewMode === 'map' ? (
            <div className="w-full h-full relative group">
              <DigitalTwinView theme="light" onlyShowLayer="routes" />
              
              {/* Map Floating UI */}
              <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
                 <div className="flex flex-col gap-3 pointer-events-auto">
                    <div className="bg-white/95 backdrop-blur-xl p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                         <Layers size={14} />
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-70">Active Network</p>
                          <p className="text-[10px] font-black text-slate-900 uppercase">Logistic Matrix Node</p>
                       </div>
                    </div>
                 </div>
                 
                 <div className="flex flex-col gap-3 pointer-events-auto">
                    <button className="h-10 w-10 rounded-xl bg-white/95 backdrop-blur-xl shadow-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all">
                       <Maximize2 size={16} />
                    </button>
                    <button className="h-10 w-10 rounded-xl bg-white/95 backdrop-blur-xl shadow-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all">
                       <Settings2 size={16} />
                    </button>
                 </div>
              </div>

              {/* Legend Overlay */}
              <div className="absolute bottom-6 left-6 p-5 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-100 w-56 pointer-events-auto">
                 <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Tactical Legend</h4>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3">
                       <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.2)]" />
                       <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">Optimized Path</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Pending Sync</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.2)]" />
                       <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">Revision Node</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]" />
                       <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">Vector Conflict</span>
                    </div>
                 </div>
              </div>

              {/* Creation Overlay */}
              <AnimatePresence>
                {isCreating && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-0 bg-slate-900/10 backdrop-blur-md flex items-center justify-center p-6 z-50 pt-20"
                  >
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden relative">
                       <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                          <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                              <div className="h-14 w-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
                                <Zap size={28} />
                              </div>
                              <div>
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Optimization Engine</h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">KSA Smart Logistics Protocol</p>
                              </div>
                            </div>
                            <button onClick={() => setIsCreating(false)} className="h-10 w-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center text-slate-500 transition-all">
                              <X size={20} />
                            </button>
                          </div>
                       </div>
                       
                       <div className="p-8 space-y-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Route Identifier</label>
                             <input 
                               type="text" 
                               value={newRouteData.name}
                               onChange={(e) => setNewRouteData(prev => ({ ...prev, name: e.target.value }))}
                               className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-xs font-bold focus:ring-4 focus:ring-blue-600/5 outline-none transition-all placeholder:text-slate-300"
                               placeholder="Enter route matrix name..."
                             />
                          </div>

                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Primary Asset Node</label>
                             <select 
                               className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-xs font-bold focus:ring-4 focus:ring-blue-600/5 outline-none transition-all"
                               value={newRouteData.vehicleId}
                               onChange={(e) => setNewRouteData(prev => ({ ...prev, vehicleId: e.target.value }))}
                             >
                                <option value="">Select dispatch asset...</option>
                                {availableVehicles.map(v => (
                                  <option key={v.id} value={v.id}>{v.vehicleCode} - {v.name}</option>
                                ))}
                             </select>
                             {availableVehicles.length === 0 && (
                               <p className="text-[8px] font-black text-red-500 uppercase px-1">No idle operational units available</p>
                             )}
                          </div>

                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Target Sector</label>
                             <select 
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-xs font-bold focus:ring-4 focus:ring-blue-600/5 outline-none transition-all"
                                value={newRouteData.region}
                                onChange={handleRegionChange}
                             >
                                {regions.map(r => (
                                  <option key={r} value={r}>{r}</option>
                                ))}
                             </select>
                          </div>

                          <button 
                             onClick={handleCreateRoute}
                             disabled={optimizationStatus === 'running'}
                             className={cn(
                               "w-full py-5 rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center gap-3",
                               optimizationStatus === 'running' ? "bg-slate-100 text-slate-400" : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20"
                             )}
                          >
                             {optimizationStatus === 'running' ? (
                               <div className="flex items-center gap-3">
                                 <Loader2 size={16} className="animate-spin" />
                                 Processing Matrix...
                               </div>
                             ) : (
                               <>
                                 <Zap size={16} />
                                 Initialize Optimization
                               </>
                             )}
                          </button>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Route Detail Panel */}
              <AnimatePresence>
                {selectedRoute && !isCreating && (
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    className="absolute right-6 top-24 bottom-6 w-72 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden pointer-events-auto z-40"
                  >
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                       <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{selectedRoute.routeCode}</span>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mt-1">{selectedRoute.routeName}</h3>
                          </div>
                          <button 
                            onClick={() => selectRoute(null)}
                            className="h-8 w-8 hover:bg-slate-100 rounded-lg flex items-center justify-center text-slate-400"
                          >
                             <X size={14} />
                          </button>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className={cn(
                            "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                            selectedRoute.status === 'active' ? "bg-emerald-500 text-white" : 
                            selectedRoute.status === 'conflict' ? "bg-red-500 text-white animate-pulse" : "bg-slate-100 text-slate-500"
                          )}>
                            {selectedRoute.status}
                          </div>
                          {selectedRoute.efficiencyRating > 90 && (
                             <div className="flex items-center gap-1 text-emerald-500 text-[8px] font-black uppercase tracking-widest">
                                <Zap size={10} /> Optimized
                             </div>
                          )}
                       </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                       {selectedRoute.status === 'conflict' && (
                         <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                            <div className="flex items-center gap-2 text-red-600 mb-2">
                               <AlertCircle size={14} />
                               <span className="text-[10px] font-black uppercase tracking-widest">Asset Sync Conflict</span>
                            </div>
                            <p className="text-[9px] font-bold text-red-500 leading-relaxed uppercase">Multiple vector assignments detected for this logistical node. Optimization required to avoid operational stalls.</p>
                         </div>
                       )}

                       <div className="space-y-4">
                          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Assigned Payload</h4>
                          {assignedVehicle ? (
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                               <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                                  <Navigation size={18} />
                               </div>
                               <div>
                                  <p className="text-[10px] font-black text-slate-900 uppercase">{assignedVehicle.vehicleCode}</p>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase">{assignedVehicle.driverName}</p>
                               </div>
                            </div>
                          ) : (
                            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-600 flex items-center gap-2">
                               <AlertCircle size={14} />
                               <span className="text-[9px] font-black uppercase tracking-widest">Awaiting Assignment</span>
                            </div>
                          )}
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Efficiency</p>
                             <p className="text-xs font-black text-slate-900 tabular-nums">{selectedRoute.efficiencyRating.toFixed(1)}%</p>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">ETA Sync</p>
                             <p className="text-xs font-black text-slate-900 tabular-nums">{selectedRoute.estimatedTime}</p>
                          </div>
                       </div>

                       <div className="space-y-3">
                          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Operational Waypoints</h4>
                          <div className="space-y-2">
                             {selectedRoute.stops.map((stop, i) => (
                               <div key={i} className="flex items-center gap-3">
                                  <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[8px] font-black text-slate-400">
                                    {i + 1}
                                  </div>
                                  <span className="text-[9px] font-bold text-slate-600 tabular-nums">{stop.lat.toFixed(4)}, {stop.lng.toFixed(4)}</span>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>

                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-2">
                       <button className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                          Replay Path
                       </button>
                       <button 
                         onClick={() => deleteRoute(selectedRoute.id)}
                         className="px-4 py-3 bg-white text-red-500 border border-red-100 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-50 transition-all"
                       >
                          Purge
                       </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!selectedRouteId && !isCreating && (
                <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                  <div className="bg-white/95 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-2xl border border-white flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identify vector to proceed</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full bg-slate-50 flex items-center justify-center p-20">
               <div className="text-center max-w-sm">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center text-slate-200 mx-auto mb-6">
                     <List size={28} />
                  </div>
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Network Tabular breakdown</h3>
                  <p className="text-xs font-bold text-slate-400 mt-2 leading-relaxed">Cross-referencing logistical nodes. Tabular data view is currently initializing from the core matrix engine.</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoutesPage;
