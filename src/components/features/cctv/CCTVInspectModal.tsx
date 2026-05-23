import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Wifi, 
  MapPin, 
  Clock, 
  Activity, 
  ShieldAlert, 
  Maximize2,
  Signal,
  Calendar,
  AlertCircle,
  Wind,
  Scan,
  ShieldCheck
} from 'lucide-react';
import { SurveillanceCamera } from '@/types';
import { cn } from '@/lib/utils';

interface CCTVInspectModalProps {
  camera: SurveillanceCamera;
  onClose: () => void;
}

const CCTVInspectModal: React.FC<CCTVInspectModalProps> = ({ camera, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-5">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl ring-1 ring-white/10",
              camera.operationalStatus === 'online' ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
            )}>
              <Activity size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-800 px-2 py-0.5 rounded shadow-sm">
                  {camera.cameraCode}
                </span>
                <span className={cn(
                  "text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-sm flex items-center gap-1.5",
                  camera.operationalStatus === 'online' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                )}>
                  <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", camera.operationalStatus === 'online' ? "bg-emerald-500" : "bg-red-500")} />
                  {camera.operationalStatus}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">{camera.cameraName}</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-12 px-6 flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest">
               <Maximize2 size={16} className="text-blue-400" />
               Full Screen
            </button>
            <button onClick={onClose} className="h-12 w-12 flex items-center justify-center rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-all shadow-xl">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex min-h-0 bg-slate-950">
          {/* Main Feed View */}
          <div className="flex-1 relative bg-black group overflow-hidden">
            {/* The actual feed video (placeholder) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-950 relative">
                 {/* Scanning Lines */}
                 <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(transparent_0%,rgba(255,255,255,1)_50%,transparent_51%)] bg-[length:100%_4px] animate-[scan_4s_linear_infinite]" />
                 
                 {/* Visual Indicators */}
                 <div className="absolute top-8 left-8 flex flex-col gap-4">
                    <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                       <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-1">Optical Zoom</p>
                       <p className="text-lg font-black text-white">4.2x</p>
                    </div>
                    <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                       <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-1">Signal Strength</p>
                       <p className="text-lg font-black text-white">{camera.networkHealth}%</p>
                    </div>
                 </div>

                 <div className="absolute bottom-8 right-8 text-right">
                    <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 inline-block">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Live Coordinates</p>
                       <p className="text-sm font-mono font-bold text-white tracking-widest">{camera.location.lat.toFixed(4)}°N, {camera.location.lng.toFixed(4)}°E</p>
                    </div>
                 </div>

                 {/* Simulated Detections */}
                 {/* 1. Anomaly detection box */}
                 <motion.div 
                   animate={{ 
                     x: [40, 60, 40], 
                     y: [30, 50, 30] 
                   }}
                   transition={{ duration: 10, repeat: Infinity }}
                   className="absolute left-1/4 top-1/3 border-2 border-red-500/50 w-48 h-32 flex flex-col justify-between p-2"
                 >
                    <div className="flex justify-between">
                       <div className="w-2 h-2 border-t-2 border-l-2 border-red-500" />
                       <div className="w-2 h-2 border-t-2 border-r-2 border-red-500" />
                    </div>
                    <div className="bg-red-500 text-white text-[8px] font-black uppercase px-1 py-0.5 absolute -top-4 left-0 flex items-center gap-1">
                      <AlertCircle size={8} /> Hazard Detected (0.94)
                    </div>
                    <div className="flex justify-between">
                       <div className="w-2 h-2 border-b-2 border-l-2 border-red-500" />
                       <div className="w-2 h-2 border-b-2 border-r-2 border-red-500" />
                    </div>
                 </motion.div>

                 {/* 2. Smoke Detection Indicator */}
                 <div className="absolute top-1/4 right-1/4 flex flex-col items-center gap-2">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-24 h-24 rounded-full border-2 border-dashed border-amber-500"
                    />
                    <div className="bg-amber-500 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded flex items-center gap-1 shadow-lg">
                      <Wind size={8} /> Smoke Analysis: Negative
                    </div>
                 </div>

                 {/* 3. Waste Type Classification */}
                 <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <div className="w-32 h-1 bg-blue-500/30 overflow-hidden rounded-full">
                       <motion.div 
                         initial={{ x: '-100%' }}
                         animate={{ x: '100%' }}
                         transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                         className="w-1/2 h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                       />
                    </div>
                    <span className="text-[7px] font-black text-blue-400 uppercase tracking-widest">Scanning Waste Profile...</span>
                 </div>
              </div>
            </div>

            {/* AI HUD Overlay */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-700">
               <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                     <p className="text-white font-mono text-[10px] tracking-widest">CAM-NODE-SYST: {camera.cameraCode}</p>
                     <p className="text-white font-mono text-[10px] tracking-widest">FREQ: 5.8GHZ</p>
                  </div>
                  <div className="text-right">
                     <p className="text-white font-mono text-[10px] tracking-widest">{new Date().toISOString()}</p>
                     <p className="text-emerald-400 font-mono text-[10px] tracking-widest uppercase">Encryption Active: AES-256</p>
                  </div>
               </div>
               
               <div className="h-40 w-40 border border-white/20 rounded-full flex items-center justify-center relative mx-auto mb-10">
                  <div className="absolute inset-0 rounded-full border-t-2 border-blue-500/50 animate-spin" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
               </div>
            </div>
          </div>

          {/* Side Info Panel */}
          <div className="w-80 bg-slate-900 border-l border-slate-800 p-8 flex flex-col gap-8">
             <div>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Technical Details</h3>
                <div className="space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400">
                         <Signal size={18} />
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-slate-500 uppercase leading-none mb-1">Network Quality</p>
                         <p className="text-sm font-bold text-white">{camera.networkHealth >= 90 ? 'Excellent' : 'Stable'}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-purple-400">
                         <Calendar size={18} />
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-slate-500 uppercase leading-none mb-1">Last Maintenance</p>
                         <p className="text-sm font-bold text-white">Feb 12, 2026</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400">
                         <ShieldAlert size={18} />
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-slate-500 uppercase leading-none mb-1">Detections (24h)</p>
                         <p className="text-sm font-bold text-white">1,242 Events</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="flex-1 mt-4">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Recent Detection Alerts</h3>
                <div className="space-y-3">
                   {[
                     { type: 'Vehicle', time: '14:22', severity: 'low' },
                     { type: 'Anomaly', time: '12:05', severity: 'high' },
                     { type: 'Object', time: '09:44', severity: 'low' },
                   ].map((item, idx) => (
                     <div key={idx} className="p-3 rounded-xl border border-white/5 bg-white/5 flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                           <AlertCircle size={14} className={item.severity === 'high' ? 'text-red-500' : 'text-blue-400'} />
                           <span className="text-xs font-bold text-white">{item.type}</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">{item.time}</span>
                     </div>
                   ))}
                </div>
             </div>

             <button className="w-full bg-blue-600 text-white rounded-2xl py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 mt-auto">
                Request Service Access
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CCTVInspectModal;
