import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useFleetStore } from '../../store/fleetStore';
import { useRouteStore } from '../../store/routeStore';
import { 
  Truck, 
  Route as RouteIcon, 
  BarChart3, 
  Zap, 
  Settings,
  Activity,
  History,
  LayoutDashboard,
  FileText,
  Wrench
} from 'lucide-react';
import { cn } from '../../lib/utils';
import DispatchDashboardPage from '../DispatchDashboardPage';
import FleetEfficiencyView from '../../components/features/fleet/FleetEfficiencyView';
import TruckDetailsView from '../../components/features/fleet/TruckDetailsView';
import FleetReportsView from '../../components/features/fleet/FleetReportsView';
import MaintenanceSchedulerView from '../../components/features/fleet/MaintenanceSchedulerView';

type FleetView = 'dispatch' | 'efficiency' | 'details' | 'reports' | 'maintenance';

const FleetDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab ] = useState<FleetView>('dispatch');

  const navItems = [
    { id: 'dispatch', label: 'Dispatch Center', icon: Zap },
    { id: 'efficiency', label: 'Fleet Efficiency', icon: BarChart3 },
    { id: 'details', label: 'Truck Details', icon: History },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'maintenance', label: 'Maintenance Scheduler', icon: Wrench },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden font-sans">
      {/* Internal Fleet Navigation */}
      <div className="bg-white border-b border-slate-200 px-6 shrink-0 z-40">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-8 h-full">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as FleetView)}
                className={cn(
                  "flex items-center gap-2 h-full px-1 border-b-2 transition-all relative group",
                  activeTab === item.id 
                    ? "border-blue-600 text-blue-600" 
                    : "border-transparent text-slate-400 hover:text-slate-600"
                )}
              >
                <item.icon size={16} />
                <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                {activeTab === item.id && (
                  <div className="absolute inset-x-0 -bottom-px h-px bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end leading-none">
                <span className="text-[10px] font-black text-slate-900 uppercase">Fleet Manager Console</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Region: Riyadh North</span>
             </div>
             <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                <Settings size={14} />
             </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'dispatch' && (
          <div className="absolute inset-0">
            <DispatchDashboardPage embedded={true} />
          </div>
        )}
        
        {activeTab === 'efficiency' && (
          <div className="absolute inset-0 overflow-y-auto no-scrollbar">
            <FleetEfficiencyView />
          </div>
        )}

        {activeTab === 'details' && (
          <div className="absolute inset-0 overflow-y-auto no-scrollbar">
            <TruckDetailsView />
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="absolute inset-0 overflow-y-auto no-scrollbar">
            <FleetReportsView />
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="absolute inset-0 overflow-y-auto no-scrollbar">
            <MaintenanceSchedulerView />
          </div>
        )}
      </div>
    </div>
  );
};

export default FleetDashboard;
