import React from 'react';
import { useBinStore } from '@/store/binStore';
import { 
  Trash2, 
  Thermometer, 
  Battery, 
  Clock, 
  Navigation, 
  X, 
  AlertTriangle, 
  Box,
  Zap,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const BinDetailPanel: React.FC = () => {
  const { getSelectedBin, selectBin } = useBinStore();
  const bin = getSelectedBin();

  if (!bin) return null;

  const statusLogs = [
    { time: '14:22', event: 'Capacity Threshold Exceeded (85%)', status: 'warning' },
    { time: '12:45', event: 'IoT Heartbeat Verified', status: 'system' },
    { time: '09:30', event: 'Internal Temp Spike Detected', status: 'alert' },
    { time: 'Yesterday', event: 'Scheduled Maintenance Complete', status: 'maintenance' },
  ];

  return (
    <motion.div 
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute right-0 top-0 h-full w-[420px] bg-slate-900 border-l border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[100] flex flex-col font-sans"
    >
      {/* Header */}
      <div className={cn(
        "p-6 flex items-center justify-between border-b relative overflow-hidden",
        bin.fillLevel > 90 ? "border-red-500/30 bg-red-500/5" : "border-slate-800 bg-slate-900"
      )}>
        {bin.fillLevel > 90 && (
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse" />
        )}
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border",
            bin.fillLevel > 90 ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          )}>
            <Trash2 size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white uppercase tracking-tight leading-none">{bin.binCode}</h2>
              <span className={cn(
                "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                bin.fillLevel > 90 ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
              )}>
                {bin.wasteType.toUpperCase()} NODE
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5 flex items-center gap-2">
              <ShieldCheck size={10} className="text-emerald-500" />
              Active IoT Link // {bin.collectionPriority.toUpperCase()} PRIORITY
            </p>
          </div>
        </div>
        <button 
          onClick={() => selectBin(null)}
          className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-500 hover:text-white border border-transparent hover:border-slate-700"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
        {/* Fill Level Mastery */}
        <div className="p-6 bg-slate-950/40 rounded-2xl border border-slate-800 space-y-4">
           <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Box size={12} />
                Volumetric Capacity
              </h3>
              <span className={cn(
                "text-2xl font-black tabular-nums",
                bin.fillLevel > 90 ? "text-red-500" : bin.fillLevel > 70 ? "text-amber-500" : "text-emerald-500"
              )}>{Math.round(bin.fillLevel)}%</span>
           </div>
           
           <div className="h-4 bg-slate-900 rounded-full border border-slate-800 p-0.5 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${bin.fillLevel}%` }}
                className={cn(
                  "h-full rounded-full shadow-[0_0_12px_rgba(0,0,0,0.5)] transition-all duration-1000",
                  bin.fillLevel > 90 ? "bg-red-500 shadow-red-500/20" : bin.fillLevel > 70 ? "bg-amber-500 shadow-amber-500/20" : "bg-emerald-500 shadow-emerald-500/20"
                )}
              />
           </div>
           
           <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-[0.1em]">
              <span>Structural Zero</span>
              <span>Vector Saturation</span>
           </div>
        </div>

        {/* Sensory Mesh Nodes */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800 flex flex-col gap-3">
             <div className="flex items-center justify-between">
                <Thermometer size={14} className="text-slate-500" />
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Core Temp</span>
             </div>
             <div className="flex items-end gap-1">
                <span className="text-2xl font-black text-white leading-none">{bin.temperature.toFixed(1)}</span>
                <span className="text-xs font-bold text-slate-500 mb-0.5">°C</span>
             </div>
             <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Normal Range</span>
             </div>
          </div>
          <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800 flex flex-col gap-3">
             <div className="flex items-center justify-between">
                <Battery size={14} className="text-slate-500" />
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">IoT Energy</span>
             </div>
             <div className="flex items-end gap-1">
                <span className="text-2xl font-black text-white leading-none">{Math.round(bin.batteryLevel)}</span>
                <span className="text-xs font-bold text-slate-500 mb-0.5">%</span>
             </div>
             <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-blue-500" />
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Solar Enabled</span>
             </div>
          </div>
        </div>

        {/* Digital Twin Context */}
        <div className="bg-slate-950/40 rounded-2xl border border-slate-800 p-5 space-y-4">
           <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
             <Navigation size={12} />
             Geospatial Attributes
           </h3>
           <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                 <span className="text-slate-500 font-bold uppercase tracking-widest">Location</span>
                 <span className="text-white font-black uppercase tracking-tight">{bin.name || "Riyadh District 4"}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                 <span className="text-slate-500 font-bold uppercase tracking-widest">Coord Index</span>
                 <span className="text-slate-400 font-mono tracking-tighter tabular-nums">{bin.location.lat.toFixed(6)}, {bin.location.lng.toFixed(6)}</span>
              </div>
              <div className="h-px bg-slate-800/50 w-full" />
              <div className="flex justify-between items-center text-xs">
                 <span className="text-slate-500 font-bold uppercase tracking-widest">Last Collection</span>
                 <div className="flex items-center gap-2 text-white font-black tabular-nums">
                    <Calendar size={12} className="text-blue-500" />
                    {new Date(bin.lastCollected).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </div>
              </div>
           </div>
        </div>

        {/* Pulse Log Feed */}
        <div className="space-y-4">
           <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Activity size={12} className="text-blue-500" />
                Network Signal Logs
              </h3>
              <button className="text-[9px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400">Fetch History</button>
           </div>
           <div className="space-y-2">
              {statusLogs.map((log, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-slate-950/20 rounded-xl border border-slate-900 group cursor-pointer hover:border-slate-800 transition-all">
                   <span className="text-[10px] font-black text-slate-600 tabular-nums">{log.time}</span>
                   <div className={cn(
                     "w-1.5 h-1.5 rounded-full transition-colors",
                     log.status === 'warning' ? "bg-red-500" : log.status === 'alert' ? "bg-amber-500" : "bg-blue-500"
                   )} />
                   <span className={cn(
                     "text-[11px] font-bold flex-1 transition-colors",
                     log.status === 'warning' ? "text-red-400" : "text-slate-300 group-hover:text-white"
                   )}>{log.event}</span>
                   <ArrowUpRight size={12} className="text-slate-700 group-hover:text-slate-400 transition-colors" />
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Action Mesh */}
      <div className="p-6 bg-slate-950 border-t border-slate-800 flex items-center gap-3">
         <button className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
            <Zap size={14} /> Schedule Emergency Extraction
         </button>
         <button className="w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-white transition-all shadow-xl">
            <Navigation size={20} />
         </button>
      </div>
    </motion.div>
  );
};

export default BinDetailPanel;
