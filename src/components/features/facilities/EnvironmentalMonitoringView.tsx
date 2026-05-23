import React from 'react';
import { 
  Wind, 
  Thermometer, 
  Zap, 
  Droplets, 
  Activity, 
  ShieldAlert, 
  TrendingUp, 
  BarChart3,
  Waves,
  Sun
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { motion } from 'motion/react';

const EnvironmentalMonitoringView: React.FC = () => {
  const metrics = [
    { label: 'Methane (CH₄)', value: '1.24', unit: 'ppm', status: 'stable', icon: Wind, trend: -2.4, color: 'emerald' },
    { label: 'Air Quality Index', value: '42', unit: 'AQI', status: 'optimal', icon: Sun, trend: 1.2, color: 'emerald' },
    { label: 'Ambient Temp', value: '38.4', unit: '°C', status: 'nominal', icon: Thermometer, trend: 4.2, color: 'blue' },
    { label: 'CO2 Reduction', value: '420', unit: 'kg/h', status: 'active', icon: Activity, trend: 12.5, color: 'purple' },
  ];

  return (
    <div className="h-full flex flex-col p-8 space-y-8 overflow-y-auto no-scrollbar bg-slate-50">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Environmental Control Center</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Telemetry Sync: Riyadh Metropolitan Bio-Hazard Protocol</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
              <div className="h-10 w-10 flex items-center justify-center bg-emerald-50 rounded-lg text-emerald-500">
                 <ShieldAlert size={20} />
              </div>
              <div>
                 <p className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">Global Compliance</p>
                 <p className="text-xs font-black text-emerald-600 leading-none">100% REGULATORY_PASS</p>
              </div>
           </div>
        </div>
      </div>

      {/* Main Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {metrics.map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 flex flex-col gap-6 relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
               <div className={cn(
                 "h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-xl",
                 metric.color === 'emerald' ? "bg-emerald-500" : metric.color === 'blue' ? "bg-blue-600" : "bg-purple-600"
               )}>
                  <metric.icon size={22} />
               </div>
               <div className="flex flex-col items-end">
                  <span className={cn(
                    "text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-widest",
                    metric.status === 'stable' || metric.status === 'optimal' || metric.status === 'nominal'
                      ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                      : "bg-amber-50 border-amber-100 text-amber-600"
                  )}>
                    {metric.status}
                  </span>
                  <div className="flex items-center gap-1.5 mt-2">
                     {metric.trend > 0 ? (
                       <TrendingUp size={10} className="text-orange-500" />
                     ) : (
                       <Waves size={10} className="text-emerald-500" />
                     )}
                     <span className={cn(
                       "text-[9px] font-black tabular-nums",
                       metric.trend > 0 ? "text-orange-500" : "text-emerald-500"
                     )}>{metric.trend > 0 ? `+${metric.trend}` : metric.trend}%</span>
                  </div>
               </div>
            </div>

            <div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-3">{metric.label}</p>
               <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900 leading-none tabular-nums">{metric.value}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase leading-none">{metric.unit}</span>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
         {/* Advanced Environmental Chart */}
         <div className="lg:col-span-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 flex flex-col">
            <div className="flex justify-between items-center mb-10">
               <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Temporal Emission Analysis</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Multi-Sensor Methane Distribution // 24H Cycle</p>
               </div>
               <div className="flex gap-4">
                  <div className="flex items-center gap-1.5">
                     <div className="h-2 w-2 rounded-full bg-blue-600" />
                     <span className="text-[8px] font-black text-slate-400 uppercase">Target</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                     <div className="h-2 w-2 rounded-full bg-slate-100 border border-slate-400 shadow-inner" />
                     <span className="text-[8px] font-black text-slate-400 uppercase">Actual</span>
                  </div>
               </div>
            </div>

            <div className="flex-1 flex items-end gap-2 px-4 pb-4">
               {[45, 62, 58, 41, 35, 78, 92, 84, 65, 42, 38, 51, 48, 60, 72, 65, 42, 35, 28, 44, 56, 61, 52, 48].map((h, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full relative flex items-end">
                       <div 
                         className="w-full bg-slate-50 border border-slate-100 rounded-t-sm transition-all group-hover:bg-blue-600/10" 
                         style={{ height: `${h * 1.5}px` }}
                       />
                       <motion.div 
                         initial={{ height: 0 }}
                         animate={{ height: `${h * 1.3}px` }}
                         className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 bg-blue-600 rounded-full"
                       />
                    </div>
                    {i % 4 === 0 && (
                      <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-2">
                        {i === 0 ? '00:00' : `${i}:00`}
                      </span>
                    )}
                 </div>
               ))}
            </div>
         </div>

         {/* Monitoring Pane */}
         <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900 rounded-[2rem] border border-white/10 shadow-2xl p-8 flex flex-col gap-6 relative overflow-hidden group">
               <div className="h-14 w-14 rounded-2xl bg-white text-slate-900 border border-white/20 flex items-center justify-center shadow-xl">
                  <Wind size={28} />
               </div>
               <div>
                  <h3 className="text-[14px] font-black text-white uppercase tracking-tight leading-none mb-2">Groundwater Integrity</h3>
                  <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] leading-relaxed">
                     Automated Piezometer Analysis for Riyadh North Sector.
                  </p>
               </div>
               <div className="space-y-4 pt-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tight">
                     <span className="text-white/50">LEACHATE LEVEL</span>
                     <span className="text-white">NOMINAL</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full w-[12%] bg-emerald-500 rounded-full" />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tight">
                     <span className="text-white/50">SENSOR_UNIT_G4</span>
                     <span className="text-white">ACTIVE</span>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 space-y-6">
               <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">Risk Heatmap // Hazard Zones</h3>
               <div className="aspect-square bg-slate-50 border border-slate-100 rounded-2xl relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                  {/* Mock Heatmap Blobs */}
                  <div className="absolute top-1/4 left-1/4 h-24 w-24 bg-blue-500/20 rounded-full blur-3xl" />
                  <div className="absolute bottom-1/4 right-1/4 h-32 w-32 bg-purple-500/10 rounded-full blur-3xl" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 bg-emerald-500/10 rounded-full blur-3xl" />
                  
                  {/* Map Markings */}
                  <div className="absolute top-1/2 left-1/4 h-6 w-6 border border-slate-300 rounded-lg flex items-center justify-center">
                     <div className="h-1.5 w-1.5 bg-blue-600 rounded-full" />
                  </div>
                  <div className="absolute bottom-1/3 right-1/3 h-6 w-6 border border-slate-300 rounded-lg flex items-center justify-center">
                     <div className="h-1.5 w-1.5 bg-purple-600 rounded-full" />
                  </div>
               </div>
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                     <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Theater Sync Active</span>
                  </div>
                  <button className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Full Radar →</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default EnvironmentalMonitoringView;
