import React, { useMemo } from 'react';
import { useFleetStore } from '@/store/fleetStore';
import DigitalTwinView from '@/components/visualization/DigitalTwinView';
import VehicleDetailPanel from '@/components/features/fleet/VehicleDetailPanel';
import { Truck, Activity, ShieldCheck, AlertCircle, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChartSkeleton } from '@/components/shared/Skeleton';
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

const FleetPage: React.FC = () => {
  const { vehicles } = useFleetStore();
  const isInitialLoad = vehicles.length === 0;
  
  const stats = [
    { label: 'Total Fleet', value: vehicles.length, icon: Truck, color: 'text-slate-900' },
    { label: 'In Operation', value: vehicles.filter(v => v.operationalStatus === 'ACTIVE').length, icon: Activity, color: 'text-blue-600' },
    { label: 'Healthy', value: vehicles.filter(v => v.alertState === 'normal').length, icon: ShieldCheck, color: 'text-emerald-600' },
    { label: 'Alerts', value: vehicles.filter(v => v.alertState !== 'normal').length, icon: AlertCircle, color: 'text-amber-600' },
  ];

  // Data for chart: Load distribution
  const chartData = useMemo(() => {
    return vehicles.map(v => ({
      name: v.vehicleCode,
      load: Math.round(v.loadPercentage),
      fuel: Math.round(v.fuelLevel)
    })).slice(0, 8); // Top 8 for visibility
  }, [vehicles]);

  return (
    <div className="relative flex flex-col h-full bg-slate-50 overflow-hidden font-sans">
      {/* 3D Visualization Background */}
      <div className="absolute inset-0 z-0 opacity-10 grayscale brightness-125">
        <DigitalTwinView theme="light" />
      </div>

          {/* Interface Layer */}
      <div className="relative z-10 p-4 sm:p-6 flex flex-col h-full pointer-events-none overflow-y-auto sm:overflow-hidden lg:no-scrollbar no-scrollbar items-center lg:items-stretch">
        {/* Header HUD */}
        <div className="flex flex-col lg:flex-row justify-between items-center sm:items-stretch lg:items-start gap-4 w-full">
          <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-slate-200 shadow-xl pointer-events-auto w-full sm:w-auto text-center sm:text-left">
            <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase leading-none">Fleet Intelligence</h1>
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 mt-2 uppercase tracking-[0.2em] leading-none">Real-time geospatial tracking & monitoring</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:flex gap-3 sm:gap-4 pointer-events-auto w-full sm:w-auto">
            {isInitialLoad ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 sm:h-20 bg-white rounded-xl sm:rounded-2xl border border-slate-100 animate-pulse shadow-sm flex-1 lg:min-w-[140px]" />
              ))
            ) : (
              stats.map((stat, i) => (
                <div key={i} className="bg-white px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xl flex-1 lg:min-w-[140px] border-l-4 border-l-blue-600">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                    <stat.icon size={12} className={stat.color} />
                    <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none truncate">{stat.label}</span>
                  </div>
                  <span className="text-lg sm:text-xl font-black text-slate-900 leading-none tabular-nums">{stat.value}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Analytics Overlay (Left Edge) */}
        <div className="mt-4 sm:mt-8 w-full sm:w-80 pointer-events-auto shrink-0">
            {isInitialLoad ? (
                <ChartSkeleton />
            ) : (
                <div className="bg-white/80 backdrop-blur-xl p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-slate-200 shadow-xl">
                    <div className="flex items-center gap-2 mb-4 sm:mb-6">
                        <BarChart2 size={16} className="text-blue-600" />
                        <h3 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 leading-none">Load Distribution (%)</h3>
                    </div>
                    <div className="h-32 sm:h-44 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={8} tickLine={false} axisLine={false} tick={{fontWeight: 700}} />
                                <YAxis stroke="#94a3b8" fontSize={8} tickLine={false} axisLine={false} tick={{fontWeight: 700}} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '12px', fontSize: '10px' }}
                                />
                                <Bar dataKey="load" radius={[4, 4, 0, 0]} barSize={16}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.load > 85 ? '#ef4444' : '#2563eb'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
        
        {/* Selected Vehicle Context */}
        <div className="pointer-events-auto mt-4 sm:mt-6 w-full">
          <VehicleDetailPanel />
        </div>

        {/* Fleet Sidebar List */}
        <div className="mt-4 sm:mt-auto h-20 sm:h-24 bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-[2.5rem] shadow-2xl border border-slate-200 flex items-center gap-3 sm:gap-4 px-4 sm:px-8 mb-2 pointer-events-auto overflow-x-auto no-scrollbar w-full shrink-0">
           {vehicles.map((v) => (
             <button 
                key={v.id}
                onClick={() => useFleetStore.getState().selectVehicle(v.id)}
                className={cn(
                    "flex flex-col min-w-[130px] sm:min-w-[150px] p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all truncate text-left",
                    useFleetStore.getState().selectedVehicleId === v.id 
                    ? "bg-blue-600 border-blue-500 shadow-lg text-white" 
                    : "bg-white border-slate-100 hover:border-blue-600/30 text-slate-900"
                )}
             >
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <span className={cn(
                      "text-[8px] sm:text-[9px] font-black uppercase tracking-widest",
                      useFleetStore.getState().selectedVehicleId === v.id ? "text-blue-100" : "text-slate-400"
                    )}>{v.vehicleCode}</span>
                    <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        v.alertState === 'critical' ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : v.operationalStatus === 'ACTIVE' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-300"
                    )} />
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-base sm:text-lg font-black tracking-tighter leading-none tabular-nums">{Math.round(v.speed)}</span>
                    <span className={cn(
                      "text-[7px] sm:text-[8px] font-black opacity-60 uppercase",
                      useFleetStore.getState().selectedVehicleId === v.id ? "text-white" : "text-slate-400"
                    )}>KM/H</span>
                </div>
                <div className={cn(
                  "w-full h-1 mt-2 sm:mt-2.5 rounded-full overflow-hidden shadow-inner",
                  useFleetStore.getState().selectedVehicleId === v.id ? "bg-blue-900/40" : "bg-slate-50"
                )}>
                    <div className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      useFleetStore.getState().selectedVehicleId === v.id ? "bg-white" : "bg-blue-600"
                    )} style={{ width: `${v.fuelLevel}%` }} />
                </div>
             </button>
           ))}
        </div>
      </div>
    </div>
  );
};

export default FleetPage;
