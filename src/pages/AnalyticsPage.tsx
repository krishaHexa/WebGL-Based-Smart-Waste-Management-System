import React, { useMemo } from 'react';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { useIncidentStore } from '@/store/incidentStore';
import { useFleetStore } from '@/store/fleetStore';
import { 
  Activity, 
  TrendingUp, 
  Zap, 
  BarChart3, 
  ShieldAlert, 
  Leaf, 
  Truck, 
  Trash2, 
  Factory,
  ArrowUpRight,
  Calendar,
  Filter
} from 'lucide-react';
import { KPICard } from '@/components/features/analytics/KPICard';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Line, 
  Bar, 
  Cell,
  ComposedChart
} from 'recharts';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

const AnalyticsPage: React.FC = () => {
  const { kpis, efficiencyTrend, incidentTrend, forecasts } = useAnalyticsStore();
  const { incidents } = useIncidentStore();
  const { vehicles } = useFleetStore();

  const executiveStats = [
    { title: 'Ops Efficiency', value: kpis.efficiency.overall, unit: '%', trend: 2.1, icon: Activity, color: 'text-blue-600' },
    { title: 'Fleet Utilization', value: kpis.fleet.utilizationRate, unit: '%', trend: -1.4, icon: Truck, color: 'text-indigo-600' },
    { title: 'CO2 Offset', value: kpis.environmental.carbonReduction, unit: 'KG/H', trend: 12, icon: Leaf, color: 'text-emerald-600' },
    { title: 'Incident Response', value: kpis.incidents.resolutionTime, unit: 'MIN', trend: -8, icon: ShieldAlert, color: 'text-orange-600' },
  ];

  const chartData = useMemo(() => {
    return efficiencyTrend.map((p, i) => ({
      ...p,
      time: format(new Date(p.timestamp), 'HH:mm'),
      incidents: incidentTrend[i]?.value || 0
    }));
  }, [efficiencyTrend, incidentTrend]);

  return (
    <div className="flex flex-col h-full bg-slate-50 p-4 sm:p-6 gap-4 sm:gap-6 overflow-y-auto no-scrollbar font-sans text-slate-900">
      {/* Header with Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col">
            <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
                <BarChart3 className="text-blue-600" size={20} />
                Strategic Intelligence Matrix
            </h1>
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 mt-1.5 uppercase tracking-[0.2em] leading-none">Unified operational analytics and predictive modelling hub</p>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-full md:w-auto">
            <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-blue-600 text-[10px] font-black text-white shadow-lg shadow-blue-600/20 uppercase tracking-widest flex-1 md:flex-none">
                <Calendar size={12} />
                <span className="hidden xs:inline">Last 24 Hours</span>
                <span className="xs:hidden">24H</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors flex-1 md:flex-none">
                <Filter size={12} />
                Filter
            </button>
        </div>
      </div>

      {/* KPI Section - Responsive Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 shrink-0">
        {executiveStats.map((stat, i) => (
          <div key={i} className={cn(i >= 2 && "hidden sm:block md:block lg:block")}>
            <KPICard {...stat} />
          </div>
        ))}
      </div>

      {/* Primary Analytics Grid - Stacking on mobile/tablet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 shrink-0">
        {/* Efficiency Over Time */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-slate-200 shadow-xl h-[350px] sm:h-[450px] flex flex-col min-h-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                <div className="flex flex-col">
                    <h3 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 leading-none">Efficiency vs Anomaly Index</h3>
                    <span className="text-[8px] sm:text-[9px] text-slate-400 font-black mt-2 uppercase tracking-tight">Real-time correlated telemetry stream</span>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.3)]" />
                        <span className="text-[8px] sm:text-[9px] text-slate-400 uppercase font-black tracking-widest leading-none">Efficiency</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.3)]" />
                        <span className="text-[8px] sm:text-[9px] text-slate-400 uppercase font-black tracking-widest leading-none">Anomalies</span>
                    </div>
                </div>
            </div>
            
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis 
                            dataKey="time" 
                            stroke="#94a3b8" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                            tick={{fontWeight: 700}}
                        />
                        <YAxis 
                            stroke="#94a3b8" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                            tick={{fontWeight: 700}}
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            itemStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900 }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#2563eb" 
                            fillOpacity={1} 
                            fill="url(#colorEff)" 
                            strokeWidth={3}
                        />
                        <Line 
                            type="step" 
                            dataKey="incidents" 
                            stroke="#f97316" 
                            strokeWidth={3} 
                            dot={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Resource Mix */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-slate-200 shadow-xl h-[350px] sm:h-[450px] flex flex-col shrink-0 min-h-0">
            <h3 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 mb-6 sm:mb-8 leading-none">Resource Health matrix</h3>
            <div className="flex-1 flex flex-col justify-around min-h-0">
                {[
                    { label: 'Healthy Assets', value: 84, color: 'bg-emerald-500', icon: Zap },
                    { label: 'Degraded State', value: 12, color: 'bg-amber-500', icon: TrendingUp },
                    { label: 'Critical Failure', value: 4, color: 'bg-red-500', icon: ShieldAlert },
                ].map((item, i) => (
                    <div key={i} className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                            <span className="text-slate-400 flex items-center gap-2 leading-none">
                                <item.icon size={12} className={item.color.replace('bg', 'text')} />
                                {item.label}
                            </span>
                            <span className="text-slate-900 leading-none">{item.value}%</span>
                        </div>
                        <div className="w-full h-1.5 sm:h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${item.value}%` }}
                                className={cn("h-full rounded-full shadow-sm", item.color)} 
                            />
                        </div>
                    </div>
                ))}
                
                <div className="mt-4 sm:mt-8 pt-4 sm:pt-8 border-t border-slate-100 space-y-3 sm:space-y-4">
                     <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-black uppercase tracking-widest leading-none">
                        <span className="text-slate-400">Avg Response Time</span>
                        <span className="text-slate-900 tabular-nums">14:24:02s</span>
                     </div>
                     <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-black uppercase tracking-widest leading-none">
                        <span className="text-slate-400">Network Uptime</span>
                        <span className="text-emerald-600 tabular-nums">99.98%</span>
                     </div>
                </div>
            </div>
        </div>
      </div>

      {/* Predictive Logic Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 shrink-0">
        {/* Forecast */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-slate-200 shadow-xl h-[300px] sm:h-[350px] flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h3 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 leading-none">Predictive Dynamic Demand</h3>
                <span className="text-[8px] sm:text-[9px] text-slate-400 font-black uppercase tracking-tight truncate ml-4">ML_MODEL_BETA_V2</span>
            </div>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={forecasts.overflow}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} tick={{fontWeight: 700}} />
                        <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} tick={{fontWeight: 700}} />
                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '12px' }} />
                        <Bar dataKey="actual" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={24} />
                        <Line type="monotone" dataKey="projected" stroke="#2563eb" strokeDasharray="6 4" strokeWidth={3} dot={{ fill: '#2563eb', r: 4, strokeWidth: 0 }} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Environmental Scorecard */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-slate-200 shadow-xl h-[300px] sm:h-[350px] flex flex-col gap-4 sm:gap-6 min-h-0">
            <h3 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 leading-none">Ecology Matrix</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 flex-1">
                <div className="bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center justify-between border border-slate-100 shadow-sm border-l-4 border-l-blue-600 min-h-0">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white text-blue-600 shadow-sm border border-slate-100 shrink-0">
                            <Trash2 size={16} />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none truncate">Recycling Rate</span>
                            <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tighter mt-1">{kpis.environmental.recyclingRate}%</span>
                        </div>
                    </div>
                    <ArrowUpRight className="text-emerald-500 shrink-0" size={20} />
                </div>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center justify-between border border-slate-100 shadow-sm border-l-4 border-l-emerald-600 min-h-0">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white text-emerald-600 shadow-sm border border-slate-100 shrink-0">
                            <Factory size={16} />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none truncate">Methane Matrix</span>
                            <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tighter mt-1">{kpis.environmental.methaneAverage} ppm</span>
                        </div>
                    </div>
                    <Activity size={20} className="text-emerald-500 shrink-0" />
                </div>
            </div>

            <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-t border-slate-100 pt-4 sm:pt-6 shrink-0">
               <span className="flex items-center gap-2 font-black leading-none"><Zap size={12} className="text-blue-500" /> AI active</span>
               <button className="text-blue-600 hover:underline leading-none">Analysis</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
