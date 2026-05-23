import React from 'react';
import { useFleetStore } from '@/store/fleetStore';
import { useRouteStore } from '@/store/routeStore';
import { Truck, Navigation, AlertCircle, Clock, Zap, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const DispatchKPIBar: React.FC = () => {
  const { vehicles } = useFleetStore();
  const { routes } = useRouteStore();

  const activeTrucks = vehicles.filter(v => v.operationalStatus === 'ACTIVE').length;
  const availableTrucks = vehicles.filter(v => v.operationalStatus === 'AVAILABLE').length;
  const delayedRoutes = routes.filter(r => r.status === 'delayed').length;
  const routeConflicts = routes.filter(r => r.status === 'conflict').length;

  const kpis = [
    { label: 'Active Fleet', value: activeTrucks, icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Units Ready', value: availableTrucks, icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Delayed Paths', value: delayedRoutes, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Logic Conflicts', value: routeConflicts, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Avg Cycle Sync', value: '38m', icon: Navigation, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Facility Load', value: '72%', icon: Building2, color: 'text-slate-600', bg: 'bg-slate-50' },
  ];

  return (
    <div className="flex items-center justify-between w-full px-8 py-3 bg-white border-b border-slate-100 overflow-x-auto no-scrollbar">
      {kpis.map((kpi, i) => (
        <div key={i} className="flex items-center gap-3 px-5 py-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm min-w-fit flex-shrink-0 group hover:border-blue-600/20 transition-all cursor-default">
          <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", kpi.bg, kpi.color)}>
            <kpi.icon size={14} />
          </div>
          <div>
             <div className="flex items-baseline gap-1.5">
                <span className="text-[14px] font-black text-slate-900 tabular-nums leading-none tracking-tighter">{kpi.value}</span>
             </div>
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5 leading-none">{kpi.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DispatchKPIBar;
