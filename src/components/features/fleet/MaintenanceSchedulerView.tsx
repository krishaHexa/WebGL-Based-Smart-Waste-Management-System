import React, { useState } from 'react';
import { useFleetStore } from '@/store/fleetStore';
import { 
  Wrench, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  History, 
  Truck, 
  Search,
  Plus,
  ChevronRight,
  Filter,
  User,
  ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TruckStatus } from '@/types';

const MaintenanceSchedulerView: React.FC = () => {
  const { vehicles, scheduleMaintenance } = useFleetStore();
  const [search, setSearch] = useState('');
  const [selectedTruckId, setSelectedTruckId] = useState<string | null>(null);

  const maintenanceTrucks = vehicles.filter(v => 
    v.vehicleCode.toLowerCase().includes(search.toLowerCase()) ||
    v.operationalStatus === 'MAINTENANCE' ||
    v.operationalStatus === 'INSPECTION'
  );

  const selectedTruck = vehicles.find(v => v.id === selectedTruckId);

  const upcomingTasks = [
    { id: 1, truck: 'TRK-RIY-002', issue: 'Hydraulic Pressure Low', priority: 'high', date: 'Today, 18:00' },
    { id: 2, truck: 'TRK-RIY-005', issue: 'Engine Oil Change', priority: 'medium', date: 'Tomorrow, 09:00' },
    { id: 3, truck: 'TRK-RIY-001', issue: 'Brake Pad Inspection', priority: 'medium', date: 'May 16, 10:30' },
  ];

  const maintenanceHistory = [
    { id: 101, truck: 'TRK-RIY-003', task: 'Sensor Recalibration', tech: 'Hassan K.', date: 'Yesterday', status: 'completed' },
    { id: 102, truck: 'TRK-RIY-004', task: 'Transmission Flush', tech: 'Ziad A.', date: 'May 12, 2024', status: 'completed' },
    { id: 103, truck: 'TRK-RIY-006', task: 'Tire Replacement', tech: 'Hassan K.', date: 'May 10, 2024', status: 'completed' },
  ];

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden font-sans">
      {/* Truck Inventory for Maintenance */}
      <div className="w-80 border-r border-slate-200 bg-white flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-100">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Truck Health Registry</h3>
           <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
              <input 
                 type="text" 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 placeholder="Search unit..." 
                 className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold outline-none focus:border-blue-600/30 transition-all"
              />
           </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-1">
           {maintenanceTrucks.map(v => (
             <button
               key={v.id}
               onClick={() => setSelectedTruckId(v.id)}
               className={cn(
                 "w-full p-4 rounded-2xl flex items-center gap-3 transition-all text-left group border border-transparent",
                 selectedTruckId === v.id ? "bg-slate-900 text-white shadow-xl" : "hover:bg-slate-50 text-slate-500 hover:border-slate-100"
               )}
             >
                <div className={cn(
                   "w-10 h-10 rounded-xl flex items-center justify-center border transition-colors shrink-0",
                   selectedTruckId === v.id ? "bg-white/10 border-white/10 text-white" : "bg-slate-100 border-slate-200 text-slate-400 group-hover:border-slate-300"
                )}>
                   <Truck size={20} />
                </div>
                <div className="flex-1 min-w-0">
                   <p className={cn("text-[11px] font-black uppercase tracking-tight", selectedTruckId === v.id ? "text-white" : "text-slate-900")}>{v.vehicleCode}</p>
                   <div className="flex items-center gap-2 mt-0.5">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        v.operationalStatus === 'ACTIVE' ? "bg-emerald-500" :
                        v.operationalStatus === 'MAINTENANCE' ? "bg-amber-500" :
                        v.operationalStatus === 'INSPECTION' ? "bg-blue-500" :
                        "bg-slate-300"
                      )} />
                      <span className={cn("text-[8px] font-bold uppercase tracking-widest", selectedTruckId === v.id ? "text-slate-400" : "text-slate-400")}>
                        {v.operationalStatus.replace('_', ' ')}
                      </span>
                   </div>
                </div>
             </button>
           ))}
        </div>
      </div>

      {/* Main Scheduler Panel */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Center Panel - Detailed View / Actions */}
           <div className="lg:col-span-2 space-y-8">
              {!selectedTruck ? (
                <div className="h-[400px] border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 bg-white/50">
                   <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-4 text-slate-300">
                      <Wrench size={32} />
                   </div>
                   <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">No Unit Selected</h3>
                   <p className="text-xs text-slate-400 mt-2 max-w-xs uppercase font-bold tracking-widest">Select a vehicle from the registry to manage its maintenance lifecycle and operational state.</p>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-2xl relative overflow-hidden">
                   <div className="flex justify-between items-start mb-10 relative z-10">
                      <div className="flex items-center gap-4">
                         <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                            <Truck size={28} />
                         </div>
                         <div>
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">{selectedTruck.vehicleCode}</h2>
                            <span className={cn(
                               "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border",
                               selectedTruck.alertState === 'critical' ? "bg-red-50 text-red-600 border-red-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                            )}>System Health: {selectedTruck.alertState === 'normal' ? 'Optimal' : selectedTruck.alertState.toUpperCase()}</span>
                         </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-white transition-all">Service Manual</button>
                        <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10">Add Service Log</button>
                      </div>
                   </div>

                   <div className="space-y-8 relative z-10">
                      <div>
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Update Operational State</h4>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                              { id: 'ACTIVE', label: 'Active', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                              { id: 'MAINTENANCE', label: 'In Maintenance', icon: Wrench, color: 'text-amber-600', bg: 'bg-amber-50' },
                              { id: 'INSPECTION', label: 'Waiting Insp.', icon: Search, color: 'text-blue-600', bg: 'bg-blue-50' },
                              { id: 'AVAILABLE', label: 'Ready for Dispatch', icon: ShieldAlert, color: 'text-slate-600', bg: 'bg-slate-100' },
                            ].map(state => (
                              <button
                                key={state.id}
                                onClick={() => scheduleMaintenance(selectedTruck.id, state.id as TruckStatus)}
                                className={cn(
                                  "p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-3 group",
                                  selectedTruck.operationalStatus === state.id 
                                    ? "border-blue-600 bg-blue-50 shadow-inner" 
                                    : "border-slate-100 bg-white hover:border-slate-200 shadow-sm"
                                )}
                              >
                                 <state.icon size={20} className={cn(selectedTruck.operationalStatus === state.id ? "text-blue-600" : "text-slate-400")} />
                                 <span className={cn(
                                   "text-[10px] font-black uppercase tracking-tight text-center",
                                   selectedTruck.operationalStatus === state.id ? "text-blue-600" : "text-slate-600"
                                 )}>{state.label}</span>
                              </button>
                            ))}
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Maintenance Parameters</h4>
                            <div className="space-y-2">
                               <StatusIndicator label="Engine Hours" value="4,240 h" progress={85} />
                               <StatusIndicator label="Tire Tread Life" value="62%" progress={62} />
                               <StatusIndicator label="Hydraulic Purity" value="94%" progress={94} />
                               <StatusIndicator label="Battery Health" value="78%" progress={78} />
                            </div>
                         </div>
                         <div className="bg-slate-50 p-6 rounded-3xl space-y-4 border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-900">
                               <ShieldAlert size={16} />
                               <h4 className="text-[10px] font-black uppercase tracking-tight">Maintenance Conflict Detection</h4>
                            </div>
                            <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
                               Truck is currently NOT assigned to any active routes. Setting to maintenance will not cause immediate dispatch disruption.
                            </p>
                            <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                               <span className="text-[9px] font-black text-slate-400 uppercase">Conflict Risk</span>
                               <span className="text-[9px] font-black text-emerald-600 uppercase">Zero</span>
                            </div>
                         </div>
                      </div>
                   </div>
                   
                   <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 -z-0">
                      <Wrench size={200} />
                   </div>
                </div>
              )}

              {/* Maintenance Queue */}
              <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Upcoming Maintenance Queue</h3>
                    <Plus size={18} className="text-slate-400 cursor-pointer hover:text-blue-600 transition-all" />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {upcomingTasks.map(task => (
                      <div key={task.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                         <div className="flex justify-between items-start">
                            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[8px] font-black text-slate-900 uppercase">{task.truck}</span>
                            <div className={cn(
                               "w-2 h-2 rounded-full",
                               task.priority === 'high' ? "bg-red-500" : "bg-amber-500"
                            )} />
                         </div>
                         <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-none">{task.issue}</p>
                         <div className="flex items-center gap-2 text-slate-400">
                            <Calendar size={12} />
                            <span className="text-[9px] font-bold uppercase tracking-widest">{task.date}</span>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Right Panel - Timeline / Workshop */}
           <div className="space-y-8">
              <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Workshop Assignment</h3>
                    <Filter size={16} className="text-slate-400" />
                 </div>
                 <div className="space-y-4">
                    <WorkshopItem name="Riyadh Main Terminal" load={85} techCount={12} />
                    <WorkshopItem name="Eastern Hub Garage" load={42} techCount={8} />
                    <WorkshopItem name="North-West Annex" load={20} techCount={4} />
                 </div>
              </div>

              <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none">History Log</h3>
                    <History size={18} className="text-slate-400" />
                 </div>
                 <div className="space-y-6">
                    {maintenanceHistory.map(log => (
                      <div key={log.id} className="flex gap-4 relative">
                         <div className="absolute left-[7px] top-[14px] bottom-[-24px] w-0.5 bg-slate-100" />
                         <div className="w-4 h-4 rounded-full bg-slate-100 border border-white mt-1 shrink-0 z-10 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{log.task}</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">{log.truck} // {log.date}</p>
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg w-fit">
                               <User size={10} className="text-slate-400" />
                               <span className="text-[9px] font-black text-slate-600 uppercase tabular-nums">{log.tech}</span>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatusIndicator = ({ label, value, progress }: any) => (
  <div className="space-y-1.5">
     <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-900">{value}</span>
     </div>
     <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-1000",
            progress < 30 ? "bg-red-500" : progress < 70 ? "bg-amber-500" : "bg-emerald-500"
          )} 
          style={{ width: `${progress}%` }} 
        />
     </div>
  </div>
);

const WorkshopItem = ({ name, load, techCount }: any) => (
  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-blue-600/30 transition-all cursor-pointer">
     <div className="flex justify-between items-start mb-2">
        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-tight leading-tight max-w-[120px]">{name}</h4>
        <span className={cn(
          "text-[10px] font-black uppercase tabular-nums",
          load > 80 ? "text-red-500" : "text-emerald-500"
        )}>{load}% Load</span>
     </div>
     <div className="flex items-center gap-4 text-slate-400">
        <div className="flex items-center gap-1.5">
           <User size={12} />
           <span className="text-[9px] font-bold uppercase tracking-widest">{techCount} TECHS</span>
        </div>
        <div className="flex items-center gap-1.5">
           <Clock size={12} />
           <span className="text-[9px] font-bold uppercase tracking-widest">3 SLOT OPEN</span>
        </div>
     </div>
  </div>
);

export default MaintenanceSchedulerView;
