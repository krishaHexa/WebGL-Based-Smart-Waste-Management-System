import React from 'react';
import { useFacilityStore } from '../../../store/facilityStore';
import { 
  Settings, 
  Activity, 
  ShieldCheck, 
  AlertCircle, 
  Zap, 
  Thermometer, 
  Clock,
  RotateCw,
  Box,
  Factory
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { motion } from 'motion/react';

const MachineryMonitoringView: React.FC = () => {
  const { facilities, selectedFacilityId } = useFacilityStore();
  
  const facility = facilities.find(f => f.id === selectedFacilityId) || facilities[0];
  const machines = facility.machines || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'emerald';
      case 'idle': return 'blue';
      case 'fault': return 'red';
      case 'maintenance': return 'amber';
      case 'overloaded': return 'orange';
      default: return 'slate';
    }
  };

  return (
    <div className="h-full flex flex-col p-8 space-y-8 overflow-y-auto no-scrollbar bg-slate-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
           <div className="h-14 w-14 rounded-2xl bg-white border border-slate-100 shadow-xl flex items-center justify-center text-slate-900">
              <Factory size={28} />
           </div>
           <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{facility.name} // Equipment Fleet</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Live Telemetry from {machines.length} Industrial Units</p>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center overflow-hidden">
                   <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="Technician" className="h-full w-full object-cover" />
                </div>
              ))}
           </div>
           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">3 Technicians on Station</span>
           <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-blue-600 shadow-sm transition-all">
              <RotateCw size={18} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {machines.map((machine, index) => {
          const color = getStatusColor(machine.status);
          
          return (
            <motion.div
              key={machine.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden group hover:border-blue-600/30 transition-all cursor-pointer relative"
            >
              {/* Header */}
              <div className="p-6 pb-2 flex justify-between items-start">
                 <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center shadow-lg",
                      machine.status === 'active' ? "bg-emerald-50 text-emerald-500" :
                      machine.status === 'fault' ? "bg-red-50 text-red-500" :
                      "bg-slate-50 text-slate-400"
                    )}>
                       <Settings size={20} className={cn(machine.status === 'active' && 'animate-spin-slow')} />
                    </div>
                    <div>
                       <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{machine.name}</h3>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">{machine.type.replace('_', ' ')}</p>
                    </div>
                 </div>
                 <div className={cn(
                   "px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                   `bg-${color}-50 border-${color}-100 text-${color}-600`
                 )}>
                   {machine.status}
                 </div>
              </div>

              {/* 3D-ish Asset Visualization Placeholder */}
              <div className="h-40 mx-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center relative overflow-hidden group-hover:bg-slate-100/50 transition-colors">
                 <div className="absolute inset-0 opacity-[0.03] pattern-grid" />
                 <motion.div 
                   animate={machine.status === 'active' ? {
                     y: [0, -5, 0],
                     rotateX: [0, 5, 0],
                   } : {}}
                   transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                   className="relative z-10 text-slate-300 transform rotate-12"
                 >
                    <Box size={80} strokeWidth={1} />
                    {machine.status === 'active' && (
                       <motion.div 
                         animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                         transition={{ repeat: Infinity, duration: 1.5 }}
                         className="absolute -top-4 -right-4 h-8 w-8 bg-emerald-500/20 rounded-full flex items-center justify-center"
                       >
                          <div className="h-2 w-2 bg-emerald-500 rounded-full" />
                       </motion.div>
                    )}
                 </motion.div>

                 {/* Machine Telemetry Overlays */}
                 <div className="absolute bottom-3 left-3 flex gap-2">
                    <div className="px-2 py-1 bg-white/80 backdrop-blur-md border border-slate-100 rounded-lg shadow-sm flex items-center gap-1.5">
                       <Thermometer size={10} className="text-orange-500" />
                       <span className="text-[9px] font-black text-slate-900">42°C</span>
                    </div>
                    <div className="px-2 py-1 bg-white/80 backdrop-blur-md border border-slate-100 rounded-lg shadow-sm flex items-center gap-1.5">
                       <Zap size={10} className="text-blue-500" />
                       <span className="text-[9px] font-black text-slate-900">1.2 kW</span>
                    </div>
                 </div>
              </div>

              {/* Stats Footer */}
              <div className="p-6 pt-4 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-400">
                          <span>Health Score</span>
                          <span className={cn(machine.health > 80 ? "text-emerald-500" : "text-amber-500")}>{machine.health}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full transition-all duration-1000", machine.health > 80 ? "bg-emerald-500" : "bg-amber-500")} style={{ width: `${machine.health}%` }} />
                       </div>
                    </div>
                    <div className="space-y-1.5">
                       <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-400">
                          <span>Utilization</span>
                          <span className="text-blue-600">{machine.utilization}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${machine.utilization}%` }} />
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                    <div className="flex items-center gap-3">
                       <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">
                          <Clock size={10} /> {machine.lastMaintenance}
                       </div>
                    </div>
                    <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                       Details <ShieldCheck size={12} />
                    </button>
                 </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Machinery Summary Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 space-y-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">System Reliability //MTBF Analysis</h3>
            <div className="h-40 flex items-end gap-3 px-4">
               {[40, 65, 35, 90, 55, 75, 60, 85, 45, 70, 50, 95].map((h, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div 
                      className="w-full bg-slate-100 rounded-t-lg transition-all group-hover:bg-blue-600/20 relative" 
                      style={{ height: `${h}%` }}
                    >
                       <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {h}%
                       </div>
                    </div>
                    <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-blue-900 rounded-[2rem] border border-white/10 shadow-2xl p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12">
               <Settings size={200} />
            </div>
            <div className="relative z-10 text-white">
               <h3 className="text-sm font-black uppercase tracking-tight mb-2">Predictive Maintenance Alert</h3>
               <p className="text-xs font-bold text-white/60 uppercase tracking-[0.2em] leading-relaxed max-w-sm">
                  AI analysis suggests Compactor Alpha (m1) requires hydraulic inspection within 48 hours to avoid critical failure.
               </p>
            </div>
            <div className="relative z-10 flex items-center justify-between pt-8 border-t border-white/10">
               <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-lg">
                     <AlertCircle size={20} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-tight leading-none mb-1">M1_HYDRAULIC_RISK</p>
                     <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest leading-none">Severity Level: HIGH</p>
                  </div>
               </div>
               <button className="px-6 py-2.5 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
                  Schedule TECH
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default MachineryMonitoringView;
