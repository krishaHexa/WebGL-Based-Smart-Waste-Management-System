import React from 'react';
import { useFacilityStore } from '@/store/facilityStore';
import { useWorkforceStore } from '@/store/workforceStore';
import { useIncidentStore } from '@/store/incidentStore';
import { 
  Building2, 
  X, 
  Activity, 
  Wind, 
  ShieldAlert, 
  Users,
  History,
  ArrowUpRight,
  ChevronRight,
  Zap,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const FacilityDetailPanel: React.FC = () => {
  const { getSelectedFacility, selectFacility } = useFacilityStore();
  const { crews } = useWorkforceStore();
  const { incidents } = useIncidentStore();
  
  const facility = getSelectedFacility();

  // Find linked workforce and incidents (using dummy links for demo)
  const assignedWorkforce = crews.slice(0, 2); 

  return (
    <AnimatePresence>
      {facility && (
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="h-full bg-white border-l border-slate-200 flex flex-col shadow-2xl z-40 overflow-hidden w-[360px]"
        >
          {/* Header */}
          <div className={cn(
            "p-5 flex items-center justify-between border-b shrink-0",
            facility.environmentalRisk === 'critical' ? "border-red-500/20 bg-red-50/50" : "border-slate-100 bg-slate-50/30"
          )}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Building2 size={20} />
              </div>
              <div className="flex flex-col">
                <h2 className="text-[13px] font-black text-slate-900 uppercase tracking-tight leading-none truncate w-48">{facility.name}</h2>
                <div className="flex items-center gap-2 mt-1.5">
                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">
                     NODE_ID: {facility.id.split('-').pop()}
                   </span>
                   <div className="w-1 h-1 rounded-full bg-slate-200" />
                   <span className={cn(
                     "text-[7px] font-black uppercase tracking-widest leading-none px-1 py-0.5 rounded shadow-sm",
                     facility.operationalStatus === 'operational' ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                   )}>
                     {facility.operationalStatus}
                   </span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => selectFacility(null)}
              className="h-7 w-7 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"
            >
              <X size={14} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
            {/* Environmental Critical Alert */}
            {facility.environmentalRisk !== 'low' && (
              <div className={cn(
                "p-4 rounded-2xl border flex flex-col gap-2.5 relative overflow-hidden",
                facility.environmentalRisk === 'critical' ? "bg-red-50 border-red-100 text-red-600" : "bg-amber-50 border-amber-100 text-amber-600"
              )}>
                <div className="flex items-center gap-2">
                  <ShieldAlert size={14} />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] leading-none">Infrastructural Anomaly Detected</span>
                </div>
                <div className="space-y-1.5">
                  {facility.activeAlerts.map((alert, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-white/60 rounded-xl border border-white/40 shadow-sm">
                       <p className="text-[9px] font-black leading-none uppercase tracking-tighter tabular-nums">{alert}</p>
                       <Zap size={10} className="opacity-40 animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Core KPI Matrix Grid */}
            <div className="space-y-3">
               <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none pl-1">Operational Matrix 4.0</h3>
               <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Throughput', value: '482', unit: 'kg/s', icon: TrendingUp, color: 'text-blue-600' },
                    { label: 'Methane', value: facility.methaneLevel.toFixed(1), unit: 'ppm', icon: Wind, color: facility.methaneLevel > 20 ? 'text-red-500' : 'text-emerald-500' },
                    { label: 'Energy Load', value: '1.2', unit: 'GW', icon: Zap, color: 'text-amber-500' },
                    { label: 'Neural Sync', value: '99', unit: '%', icon: Cpu, color: 'text-indigo-600' },
                  ].map((kpi, i) => (
                    <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:shadow-lg hover:border-blue-600/10 group">
                       <div className="flex items-center gap-2 mb-2">
                          <kpi.icon size={12} className={cn("transition-transform group-hover:scale-110", kpi.color)} />
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">{kpi.label}</span>
                       </div>
                       <div className="flex items-baseline gap-1 font-black">
                          <span className="text-lg text-slate-900 tracking-tighter leading-none tabular-nums">{kpi.value}</span>
                          <span className="text-[8px] text-slate-400 uppercase tracking-tighter leading-none">{kpi.unit}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Capacity Progress */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm">
               <div className="flex justify-between items-end px-1">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Global Sector Utilization</span>
                  <span className="text-sm font-black text-slate-900 tabular-nums leading-none">{Math.round(facility.capacityPercentage)}%</span>
               </div>
               <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-slate-100 shadow-inner">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      facility.capacityPercentage > 85 ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]" : "bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.3)]"
                    )} 
                    style={{ width: `${facility.capacityPercentage}%` }} 
                  />
               </div>
               <div className="flex justify-between items-center text-[7px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none mt-1">
                  <span>Idle Matrix</span>
                  <span>Saturation Level</span>
               </div>
            </div>

            {/* Industrial Operations - Machine Matrix */}
            <div className="space-y-4">
               <div className="flex items-center justify-between pl-1">
                  <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">Industrial Machine Matrix</h3>
                  <div className="flex gap-1.5">
                     <span className="flex items-center gap-1 text-[7px] font-black text-slate-400 uppercase">
                        <div className="h-1 w-1 rounded-full bg-emerald-500" /> ACTIVE
                     </span>
                     <span className="flex items-center gap-1 text-[7px] font-black text-slate-400 uppercase">
                        <div className="h-1 w-1 rounded-full bg-red-500" /> FAULT
                     </span>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 gap-2.5">
                  {facility.machines?.map((machine) => (
                    <div key={machine.id} className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col gap-3 group relative overflow-hidden">
                       {/* Status Indicator Bar */}
                       <div className={cn(
                          "absolute top-0 left-0 w-1 h-full",
                          machine.status === 'active' ? "bg-emerald-500" :
                          machine.status === 'fault' ? "bg-red-500" :
                          "bg-slate-300"
                       )} />

                       <div className="flex items-center justify-between pl-1">
                          <div className="flex items-center gap-3">
                             <div className={cn(
                                "h-8 w-8 rounded-xl flex items-center justify-center transition-all",
                                machine.status === 'active' ? "bg-emerald-50 text-emerald-600 shadow-inner" : 
                                machine.status === 'fault' ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-400"
                             )}>
                                {machine.type === 'conveyor' && <TrendingUp size={16} className={machine.status === 'active' ? 'animate-pulse' : ''} />}
                                {machine.type === 'compactor' && <ArrowUpRight size={16} className={machine.status === 'active' ? 'animate-bounce' : ''} />}
                                {machine.type === 'recycling_unit' && <Zap size={16} className={machine.status === 'active' ? 'animate-pulse' : ''} />}
                                {machine.type === 'methane_system' && <Wind size={16} className={machine.status === 'active' ? 'animate-spin-slow' : ''} />}
                                {machine.type === 'shredder' && <Activity size={16} className={machine.status === 'active' ? 'animate-pulse' : ''} />}
                                {machine.type === 'sorting_machine' && <Cpu size={16} className={machine.status === 'active' ? 'animate-pulse' : ''} />}
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight leading-none tabular-nums">{machine.name}</p>
                                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-1.5 leading-none">Status: {machine.status.toUpperCase()}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-slate-900 tabular-nums">{machine.utilization}%</p>
                             <p className="text-[7px] font-black text-slate-400 uppercase tracking-tighter mt-1 leading-none">Utilization</p>
                          </div>
                       </div>

                       {/* Mini Health Bar */}
                       <div className="pl-1 space-y-1.5">
                          <div className="flex justify-between items-center text-[7px] font-black uppercase tracking-widest text-slate-400">
                             <span>Core Health Matrix</span>
                             <span className={machine.health < 60 ? "text-red-500" : "text-slate-900"}>{machine.health}%</span>
                          </div>
                          <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                             <div 
                                className={cn(
                                   "h-full rounded-full transition-all duration-1000",
                                   machine.health < 60 ? "bg-red-500" : "bg-emerald-500"
                                )}
                                style={{ width: `${machine.health}%` }}
                             />
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Active Audit Log */}
            <div className="space-y-4">
               <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none pl-1">Live Audit Feed</h3>
               <div className="space-y-3 pl-1">
                  {[
                    { time: '14:22', event: 'Throughput optimization completed via AI protocol sync.', status: 'COMPLETED' },
                    { time: '12:05', event: 'Primary sorting line #02 resumed logic sequence.', status: 'ACTIVE' },
                  ].map((log, i) => (
                    <div key={i} className="flex gap-3">
                       <div className="flex flex-col items-center gap-1.5 pt-1">
                          <div className={cn("h-1.5 w-1.5 rounded-full", i === 0 ? "bg-blue-600 ring-2 ring-blue-600/20" : "bg-slate-200")} />
                          {i < 1 && <div className="w-px h-full bg-slate-100" />}
                       </div>
                       <div className="pb-3 border-b border-slate-50 last:border-0 w-full">
                          <div className="flex items-center justify-between">
                            <p className="text-[8px] font-black text-slate-300 tabular-nums uppercase tracking-widest">{log.time} // LOG_FEED</p>
                            <span className="text-[7px] font-black text-blue-500 uppercase tracking-[0.2em]">{log.status}</span>
                          </div>
                          <p className="text-[9px] font-bold text-slate-500 mt-1 leading-relaxed uppercase tracking-tighter">{log.event}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="p-5 bg-white border-t border-slate-100 shrink-0">
             <button className="w-full py-3.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.3em] shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2">
                <Cpu size={12} />
                Full Diagnostics
             </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FacilityDetailPanel;
