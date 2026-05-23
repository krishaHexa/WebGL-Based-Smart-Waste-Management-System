import React from 'react';
import { motion } from 'motion/react';
import { 
  Factory, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Zap, 
  Box, 
  Recycle, 
  Leaf, 
  Flame,
  Activity
} from 'lucide-react';
import { cn } from '../../../lib/utils';

const WasteProcessingView: React.FC = () => {
  const pipelineSteps = [
    { 
      id: 'intake', 
      label: 'Waste Intake', 
      status: 'nominal', 
      throughput: '42.5 t/h', 
      efficiency: 98, 
      icon: Box, 
      color: 'blue' 
    },
    { 
      id: 'sorting', 
      label: 'AI Sorting Matrix', 
      status: 'warning', 
      throughput: '38.2 t/h', 
      efficiency: 74, 
      icon: Activity, 
      color: 'amber' 
    },
    { 
      id: 'recycling', 
      label: 'Recycling Stream', 
      status: 'nominal', 
      throughput: '12.8 t/h', 
      efficiency: 96, 
      icon: Recycle, 
      color: 'emerald' 
    },
    { 
      id: 'organic', 
      label: 'Bio-Conversion', 
      status: 'nominal', 
      throughput: '8.4 t/h', 
      efficiency: 92, 
      icon: Leaf, 
      color: 'emerald' 
    },
    { 
      id: 'energy', 
      label: 'Thermal Recovery', 
      status: 'offline', 
      throughput: '0.0 t/h', 
      efficiency: 0, 
      icon: Flame, 
      color: 'slate' 
    },
    { 
      id: 'landfill', 
      label: 'Final Transfer', 
      status: 'nominal', 
      throughput: '4.2 t/h', 
      efficiency: 99, 
      icon: Factory, 
      color: 'purple' 
    },
  ];

  return (
    <div className="h-full flex flex-col p-8 space-y-8 overflow-y-auto no-scrollbar bg-slate-50">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Industrial Processing Workflow</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time telemetry from active treatment pipelines</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm flex flex-col items-end">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Global Efficiency</span>
              <span className="text-sm font-black text-slate-900 leading-none">92.4%</span>
           </div>
           <button className="h-10 px-6 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all">
              Initialize Clean Cycle
           </button>
        </div>
      </div>

      {/* Main Process Pipeline Visualization */}
      <div className="flex items-center gap-4 w-full overflow-x-auto pb-4 no-scrollbar">
        {pipelineSteps.map((step, index) => (
          <React.Fragment key={step.id}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "min-w-[240px] flex-1 p-6 rounded-[2rem] border transition-all relative overflow-hidden",
                step.status === 'nominal' ? "bg-white border-slate-100 shadow-xl" : 
                step.status === 'warning' ? "bg-white border-amber-200 shadow-xl ring-1 ring-amber-100" :
                "bg-slate-50 border-slate-200 opacity-60"
              )}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={cn(
                  "h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg",
                  step.status === 'nominal' ? "bg-slate-50 text-slate-400" : 
                  step.status === 'warning' ? "bg-amber-50 text-amber-500" :
                  "bg-slate-200 text-slate-400"
                )}>
                  <step.icon size={22} />
                </div>
                <div className={cn(
                  "px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                  step.status === 'nominal' ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                  step.status === 'warning' ? "bg-amber-50 border-amber-100 text-amber-600" :
                  "bg-slate-100 border-slate-200 text-slate-400"
                )}>
                  {step.status}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                   <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight mb-1">{step.label}</h3>
                   <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">
                      <Clock size={10} /> Active: 14h 22m
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="flex flex-col gap-1">
                      <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Feed Rate</span>
                      <span className="text-xs font-black text-slate-900 leading-none">{step.throughput}</span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Efficiency</span>
                      <span className={cn(
                        "text-xs font-black leading-none",
                        step.efficiency > 90 ? "text-emerald-500" : step.efficiency > 0 ? "text-amber-500" : "text-slate-400"
                      )}>{step.efficiency}%</span>
                   </div>
                </div>

                {/* Progress Mini-bar */}
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${step.efficiency}%` }}
                     className={cn(
                       "h-full rounded-full transition-all duration-1000",
                       step.status === 'nominal' ? "bg-blue-600" : "bg-amber-500"
                     )}
                   />
                </div>
              </div>

              {step.status === 'warning' && (
                <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-2 animate-pulse">
                   <AlertTriangle size={12} className="text-amber-600 shrink-0 mt-0.5" />
                   <p className="text-[8px] font-bold text-amber-700 leading-relaxed uppercase">
                      Mechanical drag detected on secondary rollers. Reduced throughput by 12%.
                   </p>
                </div>
              )}
            </motion.div>
            
            {index < pipelineSteps.length - 1 && (
              <div className="flex flex-col items-center gap-2 text-slate-200">
                <ArrowRight size={24} />
                <div className="h-40 w-px bg-slate-200 border-l border-dashed border-slate-300" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
         <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 flex flex-col gap-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Processing Density</h3>
            <div className="flex-1 flex items-center justify-center">
               <div className="relative h-48 w-48 rounded-full border-[1.5rem] border-slate-50 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-[1.5rem] border-blue-600 border-t-transparent border-l-transparent rotate-45" />
                  <div className="flex flex-col items-center">
                     <span className="text-4xl font-black text-slate-900 leading-none">62</span>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Tons / Hour</span>
                  </div>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Peak Intake</span>
                  <span className="text-sm font-black text-slate-900">84.2 t/h</span>
               </div>
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Daily Yield</span>
                  <span className="text-sm font-black text-slate-900">1,420 Tons</span>
               </div>
            </div>
         </div>

         <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 flex flex-col gap-6">
            <div className="flex justify-between items-center">
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Workload Distribution</h3>
               <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                     <div className="h-2 w-2 rounded-full bg-blue-600" />
                     <span className="text-[8px] font-black text-slate-400 uppercase">Operational</span>
                  </div>
                  <div className="flex items-center gap-1.5 ml-4">
                     <div className="h-2 w-2 rounded-full bg-amber-500" />
                     <span className="text-[8px] font-black text-slate-400 uppercase">Restricted</span>
                  </div>
               </div>
            </div>

            <div className="flex-1 space-y-4">
               {['General Waste', 'Recyclables', 'Organic Matter', 'Industrial / Hazardous'].map((type, i) => (
                 <div key={type} className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tight">
                       <span className="text-slate-600">{type}</span>
                       <span className="text-slate-900 tabular-nums">{[65, 42, 28, 12][i]}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${[65, 42, 28, 12][i]}%` }}
                         className={cn(
                           "h-full rounded-full",
                           i === 3 ? "bg-amber-500" : "bg-blue-600"
                         )}
                       />
                    </div>
                 </div>
               ))}
            </div>

            <div className="p-4 bg-blue-900 rounded-2xl flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                     <Zap size={20} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-white uppercase tracking-tight leading-none mb-1">Grid Impact Optimization</p>
                     <p className="text-[8px] font-bold text-white/50 uppercase tracking-widest leading-none">System balancing energy recovery vs consumption</p>
                  </div>
               </div>
               <span className="text-white font-black text-xs tabular-nums">+4.2 kW/h Net</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default WasteProcessingView;
