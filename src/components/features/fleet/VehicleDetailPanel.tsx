import React from 'react';
import { useFleetStore } from '@/store/fleetStore';
import { 
  Truck, 
  Fuel, 
  Package, 
  User, 
  MapPin, 
  Navigation, 
  X, 
  ShieldAlert, 
  Activity, 
  Zap, 
  History,
  Clock,
  ArrowUpRight,
  Settings,
  Send
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const VehicleDetailPanel: React.FC = () => {
  const { getSelectedVehicle, selectVehicle } = useFleetStore();
  const vehicle = getSelectedVehicle();

  if (!vehicle) return null;

  const logs = [
    { time: '14:22', event: `Route Optimization Sync: ${vehicle.vehicleCode}`, status: 'system' },
    { time: '14:05', event: `Waste Node Load Verified: ${vehicle.loadPercentage}%`, status: 'ops' },
    { time: '13:45', event: 'Lifecycle Transition: TRANSPORTING', status: 'ops' },
    { time: '12:30', event: 'Depot Exit Protocol Initiated', status: 'refuel' },
  ];

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed top-0 right-0 h-full w-[400px] bg-white border-l border-slate-200 shadow-2xl flex flex-col z-[50] font-sans"
    >
      {/* Header */}
      <div className={cn(
        "p-6 flex items-center justify-between border-b relative overflow-hidden",
        vehicle.alertState === 'critical' ? "bg-red-50/50 border-red-100" : "bg-slate-50/50 border-slate-100"
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border",
            vehicle.operationalState === 'maintenance' ? "bg-slate-100 text-slate-400 border-slate-200 shadow-inner" : "bg-blue-600 text-white border-blue-500 shadow-blue-600/20"
          )}>
            <Truck size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-black text-slate-900 uppercase tracking-tight leading-none">{vehicle.vehicleCode}</h2>
              <span className={cn(
                "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border shadow-sm",
                vehicle.operationalState === 'maintenance' ? "bg-slate-200 text-slate-600 border-slate-300" : "bg-emerald-500 text-white border-emerald-600"
              )}>
                {vehicle.operationalState}
              </span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
              <MapPin size={10} className="text-blue-500" />
              Moving Vector // RIYADH_CENTRAL
            </p>
          </div>
        </div>
        <button 
          onClick={() => selectVehicle(null)}
          className="h-8 w-8 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
        {/* Alerts & Advisories */}
        {vehicle.alertState !== 'normal' && (
          <div className="p-5 rounded-2xl bg-red-50 border border-red-100 space-y-3 shadow-sm">
             <div className="flex items-center gap-3">
                <ShieldAlert size={18} className="text-red-500" />
                <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em]">Telemetry Protocol Conflict</span>
             </div>
             <p className="text-[11px] text-red-700/70 font-bold leading-relaxed uppercase tracking-tight">
               Sub-optimal tyre pressure detected on rear axle. Dispatch priority downgraded to Level 2.
             </p>
          </div>
        )}

        {/* Tactical Matrix */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Energy Flux', value: Math.round(vehicle.fuelLevel), unit: '%', icon: Fuel, color: 'text-blue-600' },
            { label: 'Payload Mass', value: Math.round(vehicle.loadPercentage), unit: '%', icon: Package, color: 'text-orange-600' },
            { label: 'Velocity', value: Math.round(vehicle.speed), unit: 'km/h', icon: Zap, color: 'text-amber-500' },
            { label: 'Vector Sync', value: '98', unit: '%', icon: Activity, color: 'text-purple-600' },
          ].map((kpi, i) => (
            <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all group">
               <div className="flex items-center justify-between mb-3">
                  <kpi.icon size={14} className={cn("transition-transform group-hover:scale-110", kpi.color)} />
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">{kpi.label}</span>
               </div>
               <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-slate-900 leading-none tabular-nums tracking-tighter">{kpi.value}</span>
                  <span className="text-[9px] font-black text-slate-400 uppercase leading-none">{kpi.unit}</span>
               </div>
            </div>
          ))}
        </div>

        {/* Operational Lifecycle Context */}
        <div className="space-y-4">
           <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none pl-1">Lifecycle Telemetry</h3>
           <div className="grid grid-cols-1 gap-3">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all cursor-pointer">
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Facility</span>
                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{vehicle.destinationFacilityId ? 'AL-HAIR RECYCLING NODE' : 'NOT ASSIGNED'}</span>
                 </div>
                 <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-sm">
                    <ArrowUpRight size={18} />
                 </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all cursor-pointer">
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Waste Classification</span>
                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{vehicle.wasteType.toUpperCase()} // HAZARDOUS_READY</span>
                 </div>
                 <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 shadow-sm">
                    <Activity size={18} />
                 </div>
              </div>
           </div>
        </div>

        {/* Intelligence Log Feed */}
        <div className="space-y-4">
           <div className="flex items-center justify-between pl-1">
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                <Zap size={12} className="text-blue-500" />
                Audit Intelligence
              </h3>
           </div>
           <div className="space-y-3">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-blue-600/30 hover:shadow-md transition-all group">
                   <div className="flex flex-col items-center gap-1.5 pt-0.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                      {i < logs.length - 1 && <div className="w-px h-full bg-slate-100" />}
                   </div>
                   <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                         <span className="text-[8px] font-black text-slate-300 tabular-nums uppercase tracking-widest">{log.time} // LOG_STR</span>
                         <span className="text-[7px] font-black text-blue-500 uppercase tracking-widest">VERIFIED</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tight leading-relaxed">{log.event}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Primary Operator Controls */}
      <div className="p-6 bg-white border-t border-slate-100 flex items-center gap-3 mt-auto">
         <button className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95">
            <Send size={14} /> Re-Route Dispatch
         </button>
         <button className="h-12 w-12 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-900 transition-all shadow-sm">
            <Settings size={20} />
         </button>
      </div>
    </motion.div>
  );
};


export default VehicleDetailPanel;
