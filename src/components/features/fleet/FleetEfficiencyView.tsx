import React from 'react';
import { useFleetStore } from '@/store/fleetStore';
import { useRouteStore } from '@/store/routeStore';
import KPICard from '@/components/shared/KPICard';
import { 
  Truck, 
  Route as RouteIcon, 
  Fuel, 
  AlertCircle, 
  AreaChart as AreaChartIcon,
  BarChart3,
  TrendingUp,
  Clock,
  Gauge
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { cn } from '@/lib/utils';

const FleetEfficiencyView: React.FC = () => {
  const { vehicles } = useFleetStore();
  const { routes } = useRouteStore();

  const efficiencyData = [
    { name: '06:00', load: 45, fuel: 92, time: 100 },
    { name: '09:00', load: 78, fuel: 85, time: 120 },
    { name: '12:00', load: 82, fuel: 70, time: 110 },
    { name: '15:00', load: 65, fuel: 55, time: 95 },
    { name: '18:00', load: 40, fuel: 40, time: 80 },
    { name: '21:00', load: 20, fuel: 30, time: 70 },
  ];

  const utilizationData = [
    { truck: 'T-901', hours: 14.5, routes: 3 },
    { truck: 'T-902', hours: 12.2, routes: 2 },
    { truck: 'T-903', hours: 16.8, routes: 4 },
    { truck: 'T-904', hours: 11.0, routes: 2 },
    { truck: 'T-905', hours: 13.4, routes: 3 },
  ];

  const metrics = [
    { label: 'Route Efficiency', value: 88.4, unit: '%', icon: TrendingUp, variant: 'emerald' as const },
    { label: 'Avg Fuel Usage', value: 4.2, unit: 'km/L', icon: Fuel, variant: 'blue' as const },
    { label: 'Idle Fleet Time', value: 12, unit: '%', icon: Clock, variant: 'purple' as const },
    { label: 'Capacity Load', value: 72.5, unit: '%', icon: Gauge, variant: 'amber' as const },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Efficiency Metrics</h2>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Cross-Fleet Performance Audit // 24H Window</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-blue-600/30 transition-all shadow-sm">Export XML</button>
           <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">Generate Audit</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <KPICard key={i} {...m} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Load vs Energy Index */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden relative group">
          <div className="flex items-center justify-between mb-8">
             <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Energy Utilization Flux</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Load Percentage vs Fuel Delta</p>
             </div>
             <AreaChartIcon size={20} className="text-blue-600" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={efficiencyData}>
                <defs>
                  <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                   dataKey="name" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} 
                   dy={10}
                />
                <YAxis 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} 
                />
                <Tooltip 
                   contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                   cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="load" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorLoad)" />
                <Area type="monotone" dataKey="fuel" stroke="#10b981" strokeWidth={4} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Truck Utilization Rank */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden relative group">
          <div className="flex items-center justify-between mb-8">
             <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Active Operation Rank</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Daily Operational Hours per Unit</p>
             </div>
             <BarChart3 size={20} className="text-purple-600" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilizationData} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                   dataKey="truck" 
                   type="category" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} 
                />
                <Tooltip />
                <Bar dataKey="hours" radius={[0, 8, 8, 0]} barSize={20}>
                  {utilizationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#8b5cf6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Fleet Efficiency List */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
         <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Sector Node Performance</h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Optimized</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Delayed</span>
               </div>
            </div>
         </div>
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50">
                     <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Fleet Unit</th>
                     <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Driver</th>
                     <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Avg Load</th>
                     <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Fuel Index</th>
                     <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">SLA Compliance</th>
                     <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Rating</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {vehicles.map((v, i) => (
                    <tr key={v.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                       <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-black text-[10px] border border-blue-100 flex-shrink-0">
                                {v.vehicleCode.split('-').pop()}
                             </div>
                             <span className="text-xs font-black text-slate-900 uppercase">{v.vehicleCode}</span>
                          </div>
                       </td>
                       <td className="px-8 py-5 text-xs font-bold text-slate-500 uppercase">{v.driverName}</td>
                       <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                             <span className="text-xs font-black text-slate-900">{v.loadPercentage}%</span>
                             <div className="h-1 w-12 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600" style={{ width: `${v.loadPercentage}%` }} />
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-5 text-xs font-black text-slate-900 tabular-nums">4.{8 + i} km/L</td>
                       <td className="px-8 py-5">
                          <span className={cn(
                             "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border",
                             i % 3 === 0 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-100"
                          )}>
                             {i % 3 === 0 ? 'Exceeds SLA' : 'Nominal'}
                          </span>
                       </td>
                       <td className="px-8 py-5 text-right font-black text-slate-900 text-sm">{90 + (i % 10)}.{i}</td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default FleetEfficiencyView;
