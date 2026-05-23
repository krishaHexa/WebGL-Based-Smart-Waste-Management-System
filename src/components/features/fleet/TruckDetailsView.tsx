import React, { useState } from 'react';
import { useFleetStore } from '@/store/fleetStore';
import { 
  Truck, 
  Fuel, 
  Package, 
  Calendar,
  History,
  Activity,
  AlertTriangle,
  Clock,
  ArrowRight,
  User,
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const TruckDetailsView: React.FC = () => {
  const { vehicles, selectedVehicleId, selectVehicle } = useFleetStore();
  const [search, setSearch] = useState('');
  
  const vehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  const telemetryHistory = [
    { time: '08:00', load: 10, fuel: 95, speed: 45 },
    { time: '10:00', load: 35, fuel: 88, speed: 52 },
    { time: '12:00', load: 72, fuel: 75, speed: 38 },
    { time: '14:00', load: 85, fuel: 62, speed: 41 },
    { time: '16:00', load: 55, fuel: 50, speed: 48 },
    { time: '18:00', load: 20, fuel: 45, speed: 30 },
  ];

  const filteredVehicles = vehicles.filter(v => 
    v.vehicleCode.toLowerCase().includes(search.toLowerCase()) || 
    v.driverName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar Selector */}
      <div className="w-80 border-r border-slate-200 bg-white flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-100 space-y-4">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Vehicle Registry</h3>
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
              <input 
                 type="text" 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 placeholder="Search unit or driver..." 
                 className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold outline-none focus:border-blue-600/30 transition-all"
              />
           </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-1">
           {filteredVehicles.map(v => (
             <button
               key={v.id}
               onClick={() => selectVehicle(v.id)}
               className={cn(
                 "w-full p-4 rounded-2xl flex items-center gap-3 transition-all text-left group",
                 selectedVehicleId === v.id ? "bg-blue-600 text-white shadow-xl" : "hover:bg-slate-50 text-slate-500"
               )}
             >
                <div className={cn(
                   "w-10 h-10 rounded-xl flex items-center justify-center border transition-colors flex-shrink-0",
                   selectedVehicleId === v.id ? "bg-white/20 border-white/20 text-white" : "bg-slate-100 border-slate-200 text-slate-400 group-hover:border-blue-600/30"
                )}>
                   <Truck size={20} />
                </div>
                <div className="flex-1 min-w-0">
                   <p className={cn("text-[11px] font-black uppercase tracking-tight", selectedVehicleId === v.id ? "text-white" : "text-slate-900")}>{v.vehicleCode}</p>
                   <p className={cn("text-[8px] font-bold uppercase tracking-widest truncate", selectedVehicleId === v.id ? "text-blue-100" : "text-slate-400")}>{v.driverName}</p>
                </div>
                {selectedVehicleId === v.id && (
                  <ArrowRight size={14} className="text-white" />
                )}
             </button>
           ))}
        </div>
      </div>

      {/* Main Details Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-8">
        {!vehicle ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
             <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Truck size={32} className="text-slate-300" />
             </div>
             <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Select an active unit to view telemetry</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start">
               <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-blue-600 shadow-2xl shadow-blue-600/20 flex items-center justify-center text-white border border-blue-500">
                     <Truck size={36} />
                  </div>
                  <div>
                     <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">{vehicle.vehicleCode}</h1>
                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-widest">Active Status</span>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                           <User size={14} className="text-slate-400" />
                           <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{vehicle.driverName}</span>
                        </div>
                        <div className="h-1 w-1 bg-slate-300 rounded-full" />
                        <div className="flex items-center gap-2">
                           <ShieldCheck size={14} className="text-blue-500" />
                           <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">Verified Operations</span>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="flex gap-3">
                  <button className="px-5 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm hover:border-slate-300 transition-all">Audit Logs</button>
                  <button className="px-5 py-3 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all">Emergency Halt</button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                 { label: 'Current Load', value: vehicle.loadPercentage, unit: '%', icon: Package, color: 'text-orange-500' },
                 { label: 'Energy Life', value: vehicle.fuelLevel, unit: '%', icon: Fuel, color: 'text-blue-500' },
                 { label: 'Active Speed', value: vehicle.speed, unit: 'km/h', icon: Activity, color: 'text-amber-500' },
                 { label: 'Daily Distance', value: '142.4', unit: 'km', icon: ArrowRight, color: 'text-purple-500' }
               ].map((kpi, i) => (
                 <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 space-y-4">
                    <div className="flex justify-between items-center">
                       <div className={cn("w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100", kpi.color)}>
                          <kpi.icon size={18} />
                       </div>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                       <span className="text-3xl font-black text-slate-900 tracking-tighter tabular-nums leading-none">{kpi.value}</span>
                       <span className="text-xs font-black text-slate-400 uppercase">{kpi.unit}</span>
                    </div>
                 </div>
               ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                  <div className="flex items-center justify-between mb-8">
                     <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none">Real-time Telemetry Loop</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 leading-none">Operational Data Streams // 24H Window</p>
                     </div>
                     <Activity size={20} className="text-blue-600 animate-pulse" />
                  </div>
                  <div className="h-[300px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={telemetryHistory}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                           <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} dy={10} />
                           <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} />
                           <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                           <Line type="monotone" dataKey="load" stroke="#f97316" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: 'white' }} />
                           <Line type="monotone" dataKey="fuel" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: 'white' }} />
                           <Line type="monotone" dataKey="speed" stroke="#a855f7" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                        </LineChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none">Incident History</h3>
                     <History size={18} className="text-slate-400" />
                  </div>
                  <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar">
                     {[
                       { event: 'Load Imbalance Detected', time: 'Today, 14:02', type: 'warning' },
                       { event: 'Route Extension Authorized', time: 'Today, 11:45', type: 'info' },
                       { event: 'Routine Calibration', time: 'Yesterday, 09:20', type: 'success' },
                       { event: 'Unscheduled Refueling', time: 'May 12, 16:30', type: 'info' }
                     ].map((log, i) => (
                       <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
                          <div className={cn(
                             "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
                             log.type === 'warning' ? "bg-amber-50 text-amber-600 border-amber-100" :
                             log.type === 'success' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                             "bg-blue-50 text-blue-600 border-blue-100"
                          )}>
                             <AlertTriangle size={14} />
                          </div>
                          <div>
                             <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{log.event}</p>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{log.time}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
               <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Vehicle Integrity</h4>
                     <p className="text-sm font-bold text-slate-300 leading-relaxed uppercase tracking-tight">System suggests routine maintenance check on hydraulic compression unit within 48 operational hours.</p>
                  </div>
                  <div className="flex flex-col justify-center">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Overall Health Index</span>
                     <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-white leading-none tracking-tighter">94.2</span>
                        <span className="text-xs font-black text-blue-400 uppercase">A+ UNIT</span>
                     </div>
                  </div>
                  <div className="flex items-center justify-end">
                     <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-all">Download Metrics</button>
                  </div>
               </div>
               <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                  <Truck size={200} />
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TruckDetailsView;
