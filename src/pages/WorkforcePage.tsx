import React, { useMemo, useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Truck, 
  Zap, 
  ChevronRight,
  Send,
  MoreVertical,
  Clock,
  AlertTriangle,
  SendHorizontal
} from 'lucide-react';
import { useWorkforceStore } from '@/store/workforceStore';
import { useIncidentStore } from '@/store/incidentStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import WorkforceCrewCard from '@/components/features/workforce/WorkforceCrewCard';
import { WorkforceRole, WorkforceStatus } from '@/types';

const WorkforcePage: React.FC = () => {
  const { crews, selectedCrewId, selectCrew } = useWorkforceStore();
  const { incidents } = useIncidentStore();
  
  const [roleFilter, setRoleFilter] = useState<WorkforceRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<WorkforceStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCrews = useMemo(() => {
    return crews.filter(crew => {
      const matchesRole = roleFilter === 'all' || crew.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || crew.operationalStatus === statusFilter;
      const matchesSearch = crew.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          crew.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          crew.assignedZone.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [crews, roleFilter, statusFilter, searchQuery]);

  const selectedCrew = useMemo(() => 
    crews.find(c => c.id === selectedCrewId),
    [selectedCrewId, crews]
  );

  const stats = useMemo(() => {
    return {
      total: crews.length,
      available: crews.filter(c => c.operationalStatus === 'available').length,
      responding: crews.filter(c => c.operationalStatus === 'responding').length,
      onDuty: crews.filter(c => c.shiftStatus === 'onDuty' || c.shiftStatus === 'overtime').length,
      avgWorkload: crews.length ? crews.reduce((acc, c) => acc + c.workloadLevel, 0) / crews.length : 0
    };
  }, [crews]);

  const activeIncidents = useMemo(() => 
    incidents.filter(i => i.status !== 'resolved' && i.status !== 'closed'),
    [incidents]
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 p-4 sm:p-6 gap-4 sm:gap-6 overflow-y-auto no-scrollbar font-sans text-slate-900">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex flex-col">
            <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3 leading-none">
                <Users className="text-blue-600" />
                Workforce Intelligence
            </h1>
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 mt-1.5 uppercase tracking-[0.2em] leading-none shrink-0">Unified dispatch coordination and personnel logistics</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
            <div className="flex items-center justify-around sm:justify-start gap-3 sm:gap-6 px-4 py-3 sm:px-5 sm:py-3 rounded-2xl bg-white border border-slate-200 shadow-xl grow sm:grow-0">
                <div className="flex flex-col">
                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">On Duty</span>
                   <span className="text-xs sm:text-sm font-black text-blue-600 tracking-tighter leading-none truncate">{stats.onDuty} <span className="hidden xs:inline text-[9px] text-slate-400 font-bold opacity-60">UNITS</span></span>
                </div>
                <div className="w-px h-6 bg-slate-100" />
                <div className="flex flex-col">
                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Availability</span>
                   <span className="text-xs sm:text-sm font-black text-emerald-600 tracking-tighter leading-none truncate">{stats.available} <span className="hidden xs:inline text-[9px] text-slate-400 font-bold opacity-60">READY</span></span>
                </div>
                <div className="w-px h-6 bg-slate-100" />
                <div className="flex flex-col">
                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Density</span>
                   <span className="text-xs sm:text-sm font-black text-orange-600 tracking-tighter leading-none truncate text-right sm:text-left">{Math.floor(stats.avgWorkload)}%</span>
                </div>
            </div>
            
            <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 mb-0 lg:mb-[-4px] shrink-0">
                <UserPlus size={14} />
                Onboard Personnel
            </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 flex-1 min-h-0">
        {/* Workforce Overview & Filter */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden min-h-0">
             <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shrink-0">
                <div className="flex-1 max-w-full md:max-w-sm relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                   <input 
                     type="text"
                     placeholder="Identify personnel ID or sector..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full bg-white border border-slate-200 text-[10px] font-black uppercase rounded-xl py-3 pl-9 pr-4 text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 transition-all shadow-sm placeholder:text-slate-300 tracking-widest"
                   />
                </div>
                
                <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm shrink-0">
                    <div className="flex items-center p-0.5 grow xs:grow-0">
                        <button 
                          onClick={() => setRoleFilter('all')}
                          className={cn("flex-1 xs:flex-none px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", roleFilter === 'all' ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-600")}
                        >
                          All
                        </button>
                        <button 
                          onClick={() => setRoleFilter('driver')}
                          className={cn("flex-1 xs:flex-none px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", roleFilter === 'driver' ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-600")}
                        >
                          Drivers
                        </button>
                    </div>
                    
                    <div className="hidden xs:block w-px h-4 bg-slate-100 mx-1" />
                    
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="bg-slate-50 xs:bg-transparent text-[10px] font-black uppercase rounded-lg px-3 py-2 text-slate-400 outline-none hover:text-slate-900 cursor-pointer tracking-widest text-center xs:text-left"
                    >
                      <option value="all">Status</option>
                      <option value="available">Available</option>
                      <option value="responding">Responding</option>
                      <option value="offline">Offline</option>
                    </select>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 overflow-y-auto no-scrollbar pb-10 min-h-0">
                <AnimatePresence mode="popLayout" initial={false}>
                  {filteredCrews.map((crew) => (
                    <WorkforceCrewCard 
                      key={crew.id}
                      crew={crew}
                      isSelected={selectedCrewId === crew.id}
                      onSelect={() => selectCrew(crew.id)}
                    />
                  ))}
                </AnimatePresence>
             </div>
        </div>

        {/* Dispatch & Assignment Panel */}
        <div className="w-full xl:w-[400px] 2xl:w-[450px] flex flex-col gap-4 sm:gap-6 shrink-0 lg:mb-10 xl:mb-0">
             {/* Selected Crew Assignment */}
             <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-slate-200 shadow-xl flex flex-col min-h-[450px]">
                <h3 className="text-[10px] sm:text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6 sm:mb-8 flex items-center gap-2 leading-none">
                    <Zap size={14} className="text-blue-600" />
                    Unit Allocation
                </h3>

                {selectedCrew ? (
                   <div className="flex flex-col flex-1">
                       <div className="flex items-center gap-4 mb-8 sm:mb-10">
                           <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-inner shrink-0">
                               <Users size={28} />
                           </div>
                           <div className="flex flex-col min-w-0">
                               <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight leading-none mb-1.5 truncate">{selectedCrew.name}</h2>
                               <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none truncate">CODE: {selectedCrew.employeeCode}</span>
                           </div>
                       </div>

                       <div className="space-y-4 sm:space-y-6">
                           <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 shadow-sm space-y-3">
                               <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                                  <span className="text-slate-400">Current Vector</span>
                                  <span className={cn("px-2 py-0.5 rounded leading-none transition-colors truncate", 
                                    selectedCrew.operationalStatus === 'available' ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50")}>
                                    {selectedCrew.operationalStatus}
                                  </span>
                               </div>
                               <div className="h-px bg-slate-100 w-full" />
                               <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                                  <span className="text-slate-400">Assignment Sector</span>
                                  <span className="text-slate-900 truncate ml-4">{selectedCrew.assignedZone}</span>
                                </div>
                           </div>

                           <div>
                              <label className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase flex items-center gap-2 mb-3 sm:mb-4 pl-1 tracking-widest">
                                 <AlertTriangle size={12} className="text-amber-500" />
                                 Priority Assignments
                              </label>
                              <div className="space-y-3 max-h-48 overflow-y-auto no-scrollbar pr-1">
                                 {activeIncidents.length > 0 ? (
                                   activeIncidents.map(inc => (
                                     <button 
                                       key={inc.id}
                                       className="w-full flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-100 hover:border-blue-600/30 hover:shadow-lg transition-all group shadow-sm text-left"
                                     >
                                        <div className="flex flex-col items-start gap-1 min-w-0">
                                           <span className="text-[10px] sm:text-[11px] font-black text-slate-900 uppercase tracking-tight line-clamp-1">{inc.title}</span>
                                           <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-tighter truncate w-full">{inc.incidentCode} / {inc.severity}</span>
                                        </div>
                                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                                            <Send size={14} />
                                        </div>
                                     </button>
                                   ))
                                 ) : (
                                   <div className="p-6 rounded-2xl border-2 border-dashed border-slate-100 text-center opacity-40">
                                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Status: Clean</span>
                                   </div>
                                 )}
                              </div>
                           </div>
                       </div>

                       <div className="mt-auto pt-8 sm:pt-10 flex gap-3 pb-2 sm:pb-0">
                           <button className={cn(
                             "flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-600/10",
                             selectedCrew.operationalStatus === 'available' ? "bg-blue-600 text-white hover:bg-blue-500 active:scale-95" : "bg-slate-50 text-slate-400 cursor-not-allowed"
                           )}>
                               Dispatch Node
                           </button>
                           <button className="px-4 sm:px-5 py-4 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                              <MoreVertical size={18} />
                           </button>
                       </div>
                   </div>
                ) : (
                   <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 px-4">
                       <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 border border-slate-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 sm:mb-8 shadow-inner shrink-0">
                          <Users size={32} className="text-slate-200" />
                       </div>
                       <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest max-w-[220px] leading-relaxed italic">
                         "Select personnel node from matrix to initiate tactical dispatch telemetry."
                       </p>
                   </div>
                )}
             </div>

             {/* Shift Summary */}
             <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-slate-200 shadow-xl mb-4 sm:mb-0">
                <div className="flex items-center justify-between mb-5 sm:mb-6">
                    <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2 leading-none">
                        <Clock size={14} className="text-blue-600" />
                        Tactical Log
                    </h3>
                    <div className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-100 text-[8px] font-black text-blue-600 uppercase tracking-widest leading-none">
                        ALPHA-SYNC
                    </div>
                </div>

                <div className="space-y-4">
                    {[
                        { label: 'Tactical Load', value: Math.floor(stats.avgWorkload), color: 'bg-indigo-600' },
                        { label: 'Network Sync', value: Math.round((stats.available / (stats.total || 1)) * 100), color: 'bg-emerald-600' },
                    ].map((m, i) => (
                        <div key={i} className="space-y-2">
                           <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
                               <span>{m.label}</span>
                               <span className="text-slate-900 tabular-nums">{m.value}%</span>
                           </div>
                           <div className="h-1.5 bg-slate-50 border border-slate-100 rounded-full overflow-hidden shadow-inner">
                              <div className={cn("h-full rounded-full transition-all duration-1000", m.color)} style={{ width: `${m.value}%` }} />
                           </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-[9px] font-black">
                   <div className="flex flex-col gap-1">
                      <span className="text-slate-400 uppercase tracking-widest leading-none">Transition</span>
                      <span className="text-slate-900 leading-none">14:00_SAST</span>
                   </div>
                   <button className="text-blue-600 border-b-2 border-blue-600/20 hover:border-blue-600 pb-0.5 transition-all uppercase tracking-widest leading-none">
                      Personnel Register
                   </button>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default WorkforcePage;
