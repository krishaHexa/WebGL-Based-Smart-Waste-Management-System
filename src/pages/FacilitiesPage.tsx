import React, { useMemo, useState } from 'react';
import { useFacilityStore } from '@/store/facilityStore';
import DigitalTwinView from '@/components/visualization/DigitalTwinView';
import FacilityDetailPanel from '@/components/features/facilities/FacilityDetailPanel';
import { 
  Building2, 
  Activity, 
  Zap, 
  AlertCircle, 
  LayoutGrid, 
  List, 
  Map as MapIcon,
  Search,
  Filter,
  ArrowUpRight,
  MoreVertical,
  CheckCircle2,
  Globe,
  Radio,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';
import KPICard from '@/components/shared/KPICard';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const FacilitiesPage: React.FC = () => {
  const { facilities, selectFacility } = useFacilityStore();
  const [viewType, setViewType] = useState<'map' | 'list' | 'card'>('map');
  const [searchQuery, setSearchQuery] = useState('');

  const metrics = useMemo(() => [
    { label: 'Network Capacity', value: 84.5, unit: '%', icon: Activity, variant: 'emerald' as const, progress: 84 },
    { label: 'Energy Load', value: 1240, unit: 'MW', icon: Zap, variant: 'blue' as const },
    { label: 'Environmental Score', value: 92, unit: '', icon: CheckCircle2, variant: 'emerald' as const },
    { label: 'Active Facilities', value: facilities.length, unit: 'Nodes', icon: Building2, variant: 'orange' as const },
  ], [facilities]);

  const filteredFacilities = useMemo(() => {
    return facilities.filter(f => 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [facilities, searchQuery]);

  const chartData = useMemo(() => {
    return facilities.map(f => ({
      name: f.name.replace('Center ', ''),
      capacity: Math.round(f.capacityPercentage || 0),
    })).slice(0, 6);
  }, [facilities]);

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden font-sans p-4 sm:p-6 text-slate-900">
      {/* Header HUD */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Facility Infrastructure Matrix</h1>
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 mt-0.5 uppercase tracking-[0.2em] leading-none shrink-0">Operational status of processing plants and sorting facilities</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
           <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm grow sm:grow-0 justify-center">
              {[
                { id: 'map', icon: MapIcon },
                { id: 'list', icon: List },
                { id: 'card', icon: LayoutGrid }
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => setViewType(type.id as any)}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    viewType === type.id ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <type.icon size={14} />
                </button>
              ))}
           </div>
           <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all font-black text-[10px] uppercase tracking-widest grow">
              <Zap size={12} />
              AI Diagnostics
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 shrink-0">
        {metrics.map((m, i) => (
          <div key={i} className={cn(i >= 2 && "hidden xs:block md:block")}>
            <KPICard {...m} value={m.value} subValue={`Live Node Sync`} />
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col xl:flex-row gap-4 sm:gap-6 min-h-0 overflow-y-auto xl:overflow-hidden no-scrollbar">
        <div className="flex-1 flex flex-col relative rounded-2xl sm:rounded-[2rem] overflow-hidden border border-slate-200 shadow-xl bg-white min-h-[500px]">
          {viewType === 'map' ? (
            <div className="flex-1 relative">
              <DigitalTwinView onlyShowLayer="facilities" theme="light" />
              
              {/* Map Overlay Stats */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 w-full xs:w-72 pr-8 xs:pr-0">
                 <div className="bg-white/95 backdrop-blur-xl p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-2xl">
                    <h3 className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center justify-between">
                      Capacity Matrix
                      <ArrowUpRight size={12} className="text-blue-500" />
                    </h3>
                    <div className="h-32 sm:h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                           <Bar dataKey="capacity" radius={[4, 4, 0, 0]}>
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.capacity > 85 ? '#ef4444' : '#3b82f6'} fillOpacity={0.8} />
                              ))}
                           </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">
                       <span>Sectors</span>
                       <span>Load Index</span>
                    </div>
                 </div>
              </div>

              {/* Bottom Map Info */}
              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-10 hidden xs:block">
                 <div className="bg-white/90 backdrop-blur-xl px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl border border-slate-100 shadow-2xl flex items-center gap-4">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.2)]" />
                       <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Live Node Link</span>
                    </div>
                 </div>
              </div>
            </div>
          ) : viewType === 'list' ? (
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
               <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Identify facility node..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold focus:ring-4 focus:ring-blue-600/5 outline-none transition-all placeholder:text-slate-300 text-slate-900 uppercase tracking-widest"
                    />
                  </div>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 text-slate-400 hover:text-slate-900 transition-colors font-black text-[9px] uppercase tracking-widest border border-slate-100 sm:border-transparent rounded-xl">
                    <Filter size={12} /> Export Manifest
                  </button>
               </div>
               <div className="flex-1 overflow-auto no-scrollbar">
                  <div className="min-w-[1000px] xl:min-w-0">
                    <table className="w-full text-left">
                       <thead className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-slate-100 text-[9px] uppercase tracking-widest font-black text-slate-400">
                          <tr>
                             <th className="px-6 py-4">Facility Identity</th>
                             <th className="px-6 py-4">Capacity Matrix</th>
                             <th className="px-6 py-4">Efficiency</th>
                             <th className="px-6 py-4">Risk Matrix</th>
                             <th className="px-6 py-4">Telemetry Hub</th>
                             <th className="px-6 py-4 text-right">Action</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {filteredFacilities.map(facility => (
                             <tr key={facility.id} className="hover:bg-slate-50 transition-colors cursor-pointer group border-l-4 border-transparent hover:border-blue-600" onClick={() => selectFacility(facility.id)}>
                                <td className="px-6 py-4">
                                   <div className="flex items-center gap-4">
                                      <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm border border-blue-100 group-hover:scale-105 transition-transform shrink-0">
                                         <Building2 size={18} />
                                      </div>
                                      <div className="min-w-0">
                                         <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight leading-none truncate">{facility.name}</p>
                                         <p className="text-[9px] font-bold text-slate-400 mt-1 tracking-widest uppercase truncate">NODE_ID: {facility.id.split('-').pop()}</p>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-6 py-4">
                                   <div className="w-32 space-y-2">
                                      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                                         <span className="text-slate-400">Payload</span>
                                         <span className="text-slate-900">{facility.capacityPercentage}%</span>
                                      </div>
                                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                         <div 
                                            className={cn("h-full rounded-full transition-all duration-1000", facility.capacityPercentage > 85 ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]" : "bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.2)]")}
                                            style={{ width: `${facility.capacityPercentage}%` }}
                                         />
                                      </div>
                                   </div>
                                </td>
                                <td className="px-6 py-4">
                                   <div className="flex items-center gap-2">
                                      <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 shrink-0">
                                        <TrendingUp size={12} />
                                      </div>
                                      <span className="text-[11px] font-black text-slate-900 tracking-tight">92.4%</span>
                                   </div>
                                </td>
                                <td className="px-6 py-4">
                                   <span className={cn(
                                      "px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border shadow-sm whitespace-nowrap",
                                      facility.environmentalRisk === 'low' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                                   )}>
                                      {facility.environmentalRisk} Risk
                                   </span>
                                </td>
                                <td className="px-6 py-4">
                                   <div className="flex gap-4">
                                      <div className="flex flex-col">
                                         <span className="text-slate-400 uppercase text-[8px] font-black tracking-widest mb-0.5 whitespace-nowrap">Energy</span>
                                         <span className="text-slate-900 text-[11px] font-black tabular-nums whitespace-nowrap">{formatNumber(facility.energyConsumption)} kW</span>
                                      </div>
                                      <div className="flex flex-col">
                                         <span className="text-slate-400 uppercase text-[8px] font-black tracking-widest mb-0.5 whitespace-nowrap">Integrity</span>
                                         <span className="text-slate-900 text-[11px] font-black tabular-nums whitespace-nowrap">{facility.equipmentHealth}%</span>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                   <button className="h-8 w-8 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all font-black shrink-0">
                                      <MoreVertical size={16} />
                                   </button>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                  </div>
               </div>
               <div className="px-6 py-3 bg-slate-50 text-slate-400 flex items-center justify-between border-t border-slate-100 shrink-0">
                  <div className="flex items-center gap-3">
                     <Radio size={12} className="text-blue-600 animate-pulse" />
                     <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-600">Secure Node Link Live</span>
                  </div>
                  <Globe size={12} className="text-slate-300 hidden sm:block" />
               </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 no-scrollbar bg-slate-50/50">
               <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6">
                  {filteredFacilities.map(facility => (
                     <div key={facility.id} className="bg-white rounded-2xl sm:rounded-[2rem] border border-slate-200 shadow-xl p-4 sm:p-6 hover:shadow-2xl transition-all cursor-pointer group hover:-translate-y-1 hover:border-blue-600/30" onClick={() => selectFacility(facility.id)}>
                        <div className="flex items-start justify-between mb-4 sm:mb-6">
                           <div className="h-10 sm:h-12 w-10 sm:w-12 rounded-xl sm:rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center transition-all group-hover:scale-105 shadow-sm border border-blue-100">
                              <Building2 size={20} />
                           </div>
                           <div className="text-right">
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Node ID</p>
                              <p className="text-sm sm:text-base font-black text-slate-900 font-mono tracking-tight mt-1 truncate">#{facility.id.split('-').pop()}</p>
                           </div>
                        </div>
                        <h3 className="text-sm sm:text-base font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight leading-none truncate">{facility.name}</h3>
                        <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 mb-4 sm:mb-6 uppercase tracking-widest truncate">{facility.operationalStatus}</p>
                        
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100 mb-4 sm:mb-6 font-bold">
                           <div className="flex flex-col">
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Payload</p>
                              <p className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-tight tabular-nums">{facility.capacityPercentage}%</p>
                           </div>
                           <div className="flex flex-col">
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Methane</p>
                              <p className={cn(
                                "text-xs sm:text-sm font-black uppercase tracking-tight tabular-nums leading-none",
                                (facility.methaneLevel || 0) > 20 ? "text-red-500" : "text-emerald-600"
                              )}>{(facility.methaneLevel || 0).toFixed(1)} <span className="text-[8px] opacity-70">PPM</span></p>
                           </div>
                        </div>

                        <button className="w-full py-3 bg-white text-slate-900 border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2 group">
                           Inspect Infrastructure
                           <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                     </div>
                  ))}
               </div>
            </div>
          )}
        </div>

        <FacilityDetailPanel />
      </div>
    </div>
  );
};

export default FacilitiesPage;
