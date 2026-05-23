import React from 'react';
import { useRouteStore } from '@/store/routeStore';
import { useFleetStore } from '@/store/fleetStore';
import { 
  AlertCircle, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  Zap, 
  ArrowRight,
  TrendingDown,
  LayoutGrid
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

const DispatchIntelligence: React.FC = () => {
  const { routes } = useRouteStore();
  const { vehicles } = useFleetStore();

  const conflicts = routes.filter(r => r.status === 'conflict');
  const delayed = routes.filter(r => r.status === 'delayed');
  const inactiveTrucks = vehicles.filter(v => v.operationalStatus === 'AVAILABLE');

  return (
    <div className="flex flex-col h-full bg-white font-sans">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-900/10">
            <LayoutGrid size={18} />
          </div>
          <div>
            <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-tight leading-none">Operational Intel</h3>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5 leading-none">Real-time Risk Assessment</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
        {/* AI Optimization Score */}
        <div className="space-y-4">
           <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                 <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Operational Efficiency Score</h4>
                 <Zap size={12} className="text-amber-500 fill-amber-500" />
              </div>
              <div className="flex items-baseline gap-2">
                 <span className="text-2xl font-black text-slate-900 leading-none">84.2</span>
                 <span className="text-[9px] font-black text-emerald-500 uppercase">+2.4%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                 <div className="h-full w-[84.2%] bg-slate-900 rounded-full" />
              </div>
           </div>
        </div>

        {/* Route Conflicts */}
        <div className="space-y-3">
          <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 pl-1">
            <ShieldAlert size={10} className="text-red-500" />
            Route Conflicts ({conflicts.length})
          </h4>
          <div className="space-y-2">
            {conflicts.map(route => (
              <div key={route.id} className="p-3 rounded-xl bg-red-50 border border-red-100 space-y-2 group hover:bg-white transition-all">
                <div className="flex items-center justify-between">
                   <span className="text-[9px] font-black text-red-600 uppercase tracking-tight">{route.routeCode}</span>
                   <span className="text-[7px] font-black text-red-500 uppercase">NODE_CLASH</span>
                </div>
                <p className="text-[10px] font-bold text-red-700/60 uppercase tracking-tight leading-tight">
                   Intersecting nodes in {route.routeName.split('-')[0]}.
                </p>
              </div>
            ))}
            {conflicts.length === 0 && (
              <div className="p-6 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                 <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">No Active Conflicts</p>
              </div>
            )}
          </div>
        </div>

        {/* Operational Delays */}
        <div className="space-y-4">
          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 pl-1">
            <Clock size={12} className="text-amber-500" />
            Vessel Latency Warnings ({delayed.length})
          </h4>
          <div className="space-y-3">
            {delayed.map(route => (
              <div key={route.id} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-amber-500/30 transition-all cursor-pointer">
                 <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 group-hover:bg-amber-500 group-hover:text-white transition-all">
                    <TrendingDown size={18} />
                 </div>
                 <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight truncate w-32">{route.routeName}</p>
                      <span className="text-[9px] font-black text-amber-600 tabular-nums">+14m</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Traffic Saturation</span>
                       <div className="w-1 h-1 rounded-full bg-slate-200" />
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{route.estimatedTime} ETA</span>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dispatch Recommendations */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
           <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 pl-1">
            <Zap size={12} className="text-blue-500" />
            Strategic Recommendations
          </h4>
          <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-all rotate-12">
                <Zap size={80} />
             </div>
             <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-3">
                   <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                   <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">Optimization Ready</span>
                </div>
                <h5 className="text-[13px] font-black uppercase tracking-tight leading-tight">Batch Re-route Required for North Zone B</h5>
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase opacity-80">
                  Detected overflow risk at Node-42. Recommend dispatching secondary unit from Sulay Depot.
                </p>
                <button className="w-full py-3.5 bg-blue-600 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all active:scale-95 flex items-center justify-center gap-2">
                   Apply Strategic Batch <ArrowRight size={12} />
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DispatchIntelligence;
