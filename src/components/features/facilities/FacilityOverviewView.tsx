import React from 'react';
import { useFacilityStore } from '../../../store/facilityStore';
import { useFleetStore } from '../../../store/fleetStore';
import KPICard from '../../shared/KPICard';
import { 
  Building2, 
  Activity, 
  Battery, 
  ShieldAlert, 
  Thermometer, 
  Zap, 
  Truck,
  Box,
  TrendingDown,
  ArrowUpRight
} from 'lucide-react';
import OperationalMap from '../../visualization/OperationalMap';
import { cn } from '../../../lib/utils';
import { motion } from 'motion/react';

const FacilityOverviewView: React.FC = () => {
  const { facilities, selectFacility, selectedFacilityId } = useFacilityStore();
  const { vehicles } = useFleetStore();

  const activeAlertsCount = facilities.reduce((acc, f) => acc + f.activeAlerts.length, 0);
  const avgUtilization = facilities.reduce((acc, f) => acc + f.capacityPercentage, 0) / facilities.length;
  const trucksInQueue = vehicles.filter(v => v.operationalState === 'unloading' || v.operationalState === 'transporting').length;

  const kpis = [
    { label: 'System Utilization', value: Math.round(avgUtilization * 100) / 100, unit: '%', icon: Activity, variant: 'blue' as const },
    { label: 'Active Fleet Load', value: trucksInQueue, unit: 'units', icon: Truck, variant: 'emerald' as const },
    { label: 'Processing Throughput', value: 840, unit: 't/h', icon: Zap, variant: 'purple' as const },
    { label: 'Active Alerts', value: activeAlertsCount, unit: 'critical', icon: ShieldAlert, variant: 'orange' as const },
  ];

  return (
    <div className="h-full flex flex-col p-6 space-y-6 overflow-y-auto no-scrollbar">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <KPICard key={i} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Map Container */}
        <div className="lg:col-span-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden relative min-h-[500px]">
           <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
              <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                 <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Theater Logic // Real-Time Node Monitor</span>
              </div>
              <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-xl flex items-center gap-4">
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Clusters</span>
                    <span className="text-[10px] font-black text-white leading-none">04 HIGH_FLOW_ZONES</span>
                 </div>
                 <div className="w-px h-6 bg-white/10" />
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Queue Delay</span>
                    <span className="text-[10px] font-black text-emerald-400 leading-none">-4.2% NOMINAL</span>
                 </div>
              </div>
           </div>
           <OperationalMap />
        </div>

        {/* Sidebar Status List */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Facility Selection List */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">Active Command Centers</h3>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                {facilities.length} Live
              </span>
            </div>
            
            <div className="p-4 space-y-3 overflow-y-auto max-h-[400px] no-scrollbar">
              {facilities.map(facility => (
                <button
                  key={facility.id}
                  onClick={() => selectFacility(facility.id)}
                  className={cn(
                    "w-full p-4 rounded-2xl border transition-all text-left group",
                    selectedFacilityId === facility.id 
                      ? "bg-slate-900 border-slate-900 text-white shadow-xl" 
                      : "bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center transition-all",
                        selectedFacilityId === facility.id ? "bg-white/10 text-white" : "bg-slate-50 text-slate-400"
                      )}>
                        <Building2 size={18} />
                      </div>
                      <div>
                        <p className={cn(
                          "text-[11px] font-black uppercase tracking-tight leading-none mb-1.5",
                          selectedFacilityId === facility.id ? "text-white" : "text-slate-900"
                        )}>{facility.name}</p>
                        <p className={cn(
                          "text-[9px] font-bold uppercase tracking-widest leading-none",
                          selectedFacilityId === facility.id ? "text-slate-400" : "text-slate-400"
                        )}>{facility.facilityType.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <div className={cn(
                      "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border",
                      facility.operationalStatus === 'operational' 
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                        : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                    )}>
                      {facility.operationalStatus}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className={cn(
                       "p-2 rounded-xl border flex flex-col gap-1",
                       selectedFacilityId === facility.id ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-100"
                    )}>
                       <span className="text-[7px] font-black opacity-50 uppercase tracking-widest">Processing Load</span>
                       <div className="flex items-center gap-1.5">
                          <Activity size={10} className="text-blue-500" />
                          <span className="text-[9px] font-bold tabular-nums">{facility.capacityPercentage}%</span>
                       </div>
                    </div>
                    <div className={cn(
                       "p-2 rounded-xl border flex flex-col gap-1",
                       selectedFacilityId === facility.id ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-100"
                    )}>
                       <span className="text-[7px] font-black opacity-50 uppercase tracking-widest">Incoming Feed</span>
                       <div className="flex items-center gap-1.5">
                          <Truck size={10} className="text-orange-500" />
                          <span className="text-[9px] font-bold tabular-nums">{Math.floor(facility.queueLoad)}%</span>
                       </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Insights */}
          <div className="flex-1 bg-white rounded-[2rem] border border-slate-100 shadow-xl p-6 flex flex-col gap-4">
             <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">Environmental Intel</h3>
             <div className="flex-1 space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col gap-2 relative overflow-hidden group">
                   <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">CO2 Capture Rate</span>
                      <TrendingDown size={14} className="text-emerald-500" />
                   </div>
                   <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-emerald-900">4,210</span>
                      <span className="text-[10px] font-black text-emerald-500 shrink-0">KG/HR</span>
                   </div>
                   <p className="text-[8px] font-bold text-emerald-700/60 uppercase tracking-widest leading-relaxed">
                      Above projected targets for Q2 2026. Efficiency increased by 15.4% since last week.
                   </p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex flex-col gap-2 relative overflow-hidden group">
                   <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Energy Recovery</span>
                      <ArrowUpRight size={14} className="text-blue-500" />
                   </div>
                   <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-blue-900">28.4</span>
                      <span className="text-[10px] font-black text-blue-500 shrink-0">MW/H</span>
                   </div>
                   <p className="text-[8px] font-bold text-blue-700/60 uppercase tracking-widest leading-relaxed">
                      W2E systems output currently offsetting 42% of local grid demand. 
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityOverviewView;
