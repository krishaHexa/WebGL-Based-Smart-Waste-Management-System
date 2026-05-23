import React from 'react';
import { cn } from '@/lib/utils';
import { SurveillanceCamera } from '@/types';
import { 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  Scan, 
  Activity,
  Maximize2
} from 'lucide-react';
import { motion } from 'motion/react';

interface CameraFeedProps {
  camera: SurveillanceCamera;
  isSelected?: boolean;
  onSelect?: () => void;
  variant?: 'grid' | 'large' | 'compact';
}

const CameraFeed: React.FC<CameraFeedProps> = ({ camera, isSelected, onSelect, variant = 'grid' }) => {
  const isLarge = variant === 'large';
  const isCompact = variant === 'compact';

  const getStatusColor = () => {
    switch (camera.operationalStatus) {
      case 'online': return 'text-cyan-400';
      case 'degraded': return 'text-amber-400';
      case 'offline': return 'text-red-500';
      default: return 'text-slate-500';
    }
  };

  return (
    <motion.div 
      layout
      onClick={onSelect}
      className={cn(
        "relative rounded-xl overflow-hidden bg-slate-900/80 border transition-all cursor-pointer group",
        isSelected ? "border-cyan-500 ring-1 ring-cyan-500/50" : "border-slate-800 hover:border-slate-700",
        isLarge ? "h-full" : "h-48"
      )}
    >
      {/* Mock Video Feed Placeholder */}
      <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center">
        {camera.operationalStatus === 'offline' ? (
          <div className="flex flex-col items-center gap-3 text-slate-700">
             <WifiOff size={48} className="animate-pulse" />
             <span className="text-[10px] font-black tracking-[0.2em]">FEED_DISCONNECTED</span>
          </div>
        ) : (
          <div className="w-full h-full relative overflow-hidden opacity-40">
             {/* Static/Noise effect or scanning lines */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />
             <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
             <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500/10 animate-[scan_4s_linear_infinite]" />
             
             {/* Random activity symbols to show it's "live" */}
             <div className="absolute inset-0 flex items-center justify-center">
                <Scan size={isLarge ? 120 : 40} className="text-white/5" />
             </div>
          </div>
        )}
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 p-3 flex flex-col justify-between pointer-events-none z-10">
        {/* Detection Boxes (Simulation) */}
        {!camera.operationalStatus.includes('offline') && (
          <div className="absolute inset-0">
             {camera.id === 'c2' && (
               <motion.div 
                 animate={{ opacity: [1, 0.4, 1] }} 
                 transition={{ repeat: Infinity, duration: 1.5 }}
                 className="absolute top-[20%] left-[30%] w-[40%] h-[50%] border-2 border-red-500 rounded-sm shadow-[0_0_15px_rgba(239,68,68,0.5)]"
               >
                 <div className="absolute top-0 left-0 bg-red-500 text-white text-[8px] font-black px-1 py-0.5 uppercase tracking-tighter">
                    THREAT: UNKNOWN_VEHICLE
                 </div>
               </motion.div>
             )}
             {camera.id === 'c9' && (
               <motion.div 
                 animate={{ opacity: [1, 0.6, 1] }} 
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="absolute top-[50%] left-[10%] w-[30%] h-[40%] border-2 border-amber-500 rounded-sm shadow-[0_0_15px_rgba(245,158,11,0.4)]"
               >
                 <div className="absolute top-0 left-0 bg-amber-500 text-white text-[8px] font-black px-1 py-0.5 uppercase tracking-tighter">
                    OBJECT: OVERFLOW_LKL
                 </div>
               </motion.div>
             )}
          </div>
        )}

        <div className="flex items-start justify-between relative z-20">
          <div className="flex flex-col gap-1">
             <div className="flex items-center gap-2">
                <div className={cn("w-1.5 h-1.5 rounded-full bg-cyan-500", camera.operationalStatus !== 'online' && "bg-slate-500")} />
                <span className="text-[10px] font-black text-white uppercase tracking-tighter drop-shadow-md">{camera.cameraCode}</span>
             </div>
             <span className="text-[8px] font-bold text-slate-400 font-mono tracking-tighter uppercase drop-shadow-md">{camera.facilityZone} // {camera.cameraType}</span>
          </div>
          
          <div className="flex items-center gap-2">
             {camera.incidentLinked && (
               <motion.div 
                 animate={{ opacity: [1, 0.4, 1] }} 
                 transition={{ repeat: Infinity, duration: 1 }}
                 className="px-1.5 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-[8px] font-black text-red-500 uppercase tracking-tighter"
               >
                 Incident Link
               </motion.div>
             )}
             <div className={cn(
               "px-1.5 py-0.5 rounded bg-slate-950/80 border border-white/10 text-[8px] font-black uppercase tracking-tighter",
               getStatusColor()
             )}>
               {camera.streamStatus}
             </div>
          </div>
        </div>

        {!isCompact && (
          <div className="flex items-end justify-between">
             <div className="flex items-center gap-3">
                <div className="flex flex-col">
                   <span className="text-[8px] font-bold text-slate-500 uppercase">Latency</span>
                   <span className="text-[10px] font-black text-cyan-400 font-mono">24ms</span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[8px] font-bold text-slate-500 uppercase">Bitrate</span>
                   <span className="text-[10px] font-black text-cyan-400 font-mono">4.2Mbps</span>
                </div>
             </div>
             
             {isLarge && (
               <div className="flex items-center gap-2">
                  <Activity size={12} className="text-cyan-500" />
                  <span className="text-[10px] font-black text-slate-100 uppercase tracking-widest italic">Live Operations Feed</span>
               </div>
             )}
          </div>
        )}
      </div>

      {/* Interactive elements */}
      <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-cyan-500/5 pointer-events-none">
          <div className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400">
             <Maximize2 size={12} />
          </div>
      </div>
    </motion.div>
  );
};

export default CameraFeed;
