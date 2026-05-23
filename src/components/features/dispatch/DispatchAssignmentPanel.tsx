import React, { useState } from 'react';
import { useFleetStore } from '@/store/fleetStore';
import { useRouteStore } from '@/store/routeStore';
import { useIncidentStore } from '@/store/incidentStore';
import { Send, Map, CheckCircle2, AlertCircle, RefreshCcw, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const DispatchAssignmentPanel: React.FC = () => {
  const { vehicles, selectedVehicleId, updateVehicleRoute, isBatchMode, selectedVehicleIds, batchDispatch } = useFleetStore();
  const { routes, updateRouteStatus } = useRouteStore();
  const { addIncident } = useIncidentStore();
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const vehicle = vehicles.find(v => v.id === selectedVehicleId);
  const isMultiSelect = isBatchMode && selectedVehicleIds.length > 0;
  
  const availableRoutes = routes.filter(r => r.status === 'pending' || r.status === 'completed' || (vehicle && r.id === vehicle.assignedRouteId));
  const selectedRoute = routes.find(r => r.id === selectedRouteId);

  const handleAssign = async () => {
    if ((!selectedVehicleId && !isMultiSelect) || !selectedRouteId) return;
    
    // Check availability
    if (!isMultiSelect && vehicle) {
       const unavailable = ['MAINTENANCE', 'INSPECTION', 'OFFLINE'].includes(vehicle.operationalStatus);
       if (unavailable) {
          alert(`Unit ${vehicle.vehicleCode} is currently ${vehicle.operationalStatus} and cannot be dispatched.`);
          return;
       }
    }

    const route = routes.find(r => r.id === selectedRouteId);
    if (!route) return;

    setIsAssigning(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (isMultiSelect) {
      batchDispatch(selectedVehicleIds, route.routeName);
    } else if (selectedVehicleId) {
      updateVehicleRoute(selectedVehicleId, route.routeName);
    }
    
    updateRouteStatus(selectedRouteId, 'active');
    
    addIncident({
      id: `dispatch-${Date.now()}`,
      incidentCode: `DSP-${Math.floor(Math.random() * 10000)}`,
      title: isMultiSelect ? 'Batch Operations Authorized' : 'Operational Dispatch Authorized',
      description: isMultiSelect 
        ? `${selectedVehicleIds.length} operational units deployed to ${route.routeName}.`
        : `Truck ${vehicle?.vehicleCode} successfully assigned to ${route.routeName}. ETA: ${route.estimatedTime}`,
      incidentType: 'maintenance_required',
      severity: 'low',
      sourceModule: 'fleet',
      relatedEntityId: isMultiSelect ? 'batch' : selectedVehicleId!,
      location: vehicle?.location || { lat: 24.7136, lng: 46.6753 },
      status: 'assigned',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      escalationLevel: 0,
      history: [{ timestamp: new Date().toISOString(), status: 'assigned', message: 'Assigned via Dispatch Board' }],
      linkedAssets: isMultiSelect ? selectedVehicleIds : [selectedVehicleId!]
    });

    setIsAssigning(false);
    setSelectedRouteId(null);
  };

  if (!vehicle && !isMultiSelect) {
    return (
      <div className="p-10 flex flex-col items-center justify-center text-center h-full border-t border-slate-100 bg-slate-50/10">
        <div className="h-20 w-20 rounded-[2rem] bg-white shadow-xl flex items-center justify-center text-slate-300 mb-6 border border-slate-100">
           <Map size={36} />
        </div>
        <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-tight mb-3">Select Units for Dispatch</h4>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[200px]">
          Start the workflow by selecting focused vessels from the inventory.
        </p>

        <div className="mt-8 flex items-center gap-4 opacity-30">
           <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] font-black">1</div>
              <span className="text-[8px] font-black uppercase">Unit</span>
           </div>
           <div className="w-8 h-px bg-slate-300" />
           <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] font-black">2</div>
              <span className="text-[8px] font-black uppercase">Route</span>
           </div>
           <div className="w-8 h-px bg-slate-300" />
           <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] font-black">3</div>
              <span className="text-[8px] font-black uppercase">Final</span>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white border-t border-slate-100 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
         <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
               <Navigation size={18} />
            </div>
            <div>
               <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-tight leading-none mb-1">
                 {isMultiSelect ? 'Batch Assignment' : 'Assignment Workflow'}
               </h3>
               <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded-md bg-blue-600 text-white text-[7px] font-black uppercase">Step 2: Vector</span>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                    {isMultiSelect ? `${selectedVehicleIds.length} Selection` : `Unit ${vehicle?.vehicleCode}`}
                  </p>
               </div>
            </div>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
         <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
               <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Operational Vectors</h4>
               <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest leading-none">{availableRoutes.length} Found</span>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
               {availableRoutes.map(route => (
                  <button
                     key={route.id}
                     onClick={() => setSelectedRouteId(route.id)}
                     className={cn(
                        "w-full p-4 rounded-2xl border transition-all text-left group relative overflow-hidden",
                        selectedRouteId === route.id 
                           ? "bg-blue-600 border-blue-600 shadow-xl shadow-blue-600/10 text-white" 
                           : "bg-white border-slate-100 hover:border-blue-600/20 hover:bg-slate-50/50 text-slate-900"
                     )}
                  >
                     <div className="flex justify-between items-center relative z-10">
                        <div className="flex flex-col">
                           <p className="text-[11px] font-black uppercase tracking-tight leading-none">{route.routeName.split('-')[0]}</p>
                           <p className="text-[8px] font-bold text-current/60 uppercase tracking-widest mt-1">{route.estimatedTime} ETA</p>
                        </div>
                        <div className={cn(
                           "px-2 py-1 rounded bg-current/10 text-[9px] font-black",
                           selectedRouteId === route.id ? "text-white" : "text-blue-600"
                        )}>
                           {route.efficiencyRating}%
                        </div>
                     </div>
                  </button>
               ))}
            </div>
         </div>

         {selectedRoute && (
           <motion.div 
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3"
           >
              <div className="flex items-center gap-2">
                 <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                 <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Final Validation</h4>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                 <div className="flex justify-between items-end border-b border-slate-200 pb-1">
                    <p className="text-[7px] font-black text-slate-400 uppercase">Impact</p>
                    <p className="text-[10px] font-black text-slate-700">~{12 + (selectedRoute.stops.length * 1.5)}%</p>
                 </div>
                 <div className="flex justify-between items-end border-b border-slate-200 pb-1">
                    <p className="text-[7px] font-black text-slate-400 uppercase">Target</p>
                    <p className="text-[10px] font-black text-slate-700 truncate max-w-[60px]">TERMINAL A</p>
                 </div>
                 <div className="flex justify-between items-end border-b border-slate-200 pb-1">
                    <p className="text-[7px] font-black text-slate-400 uppercase">Est. End</p>
                    <p className="text-[10px] font-black text-slate-700">14:45</p>
                 </div>
                 <div className="flex justify-between items-end border-b border-slate-200 pb-1">
                    <p className="text-[7px] font-black text-slate-400 uppercase">Density</p>
                    <p className="text-[10px] font-black text-slate-700">{selectedRoute.stops.length} Nodes</p>
                 </div>
              </div>
           </motion.div>
         )}
      </div>

      <div className="p-6 border-t border-slate-100 bg-white">
         <button
            disabled={!selectedRouteId || isAssigning}
            onClick={handleAssign}
            className={cn(
               "w-full h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl",
               !selectedRouteId || isAssigning
                  ? "bg-slate-50 text-slate-300 cursor-not-allowed shadow-none"
                  : "bg-blue-600 text-white shadow-blue-600/20 hover:bg-blue-700"
            )}
         >
            {isAssigning ? (
               <RefreshCcw size={16} className="animate-spin" />
            ) : (
               <Send size={16} />
            )}
            {isAssigning ? 'SYNCING...' : isMultiSelect ? 'AUTHORIZE BATCH' : 'AUTHORIZE DISPATCH'}
         </button>
      </div>
    </div>
  );
};

export default DispatchAssignmentPanel;
