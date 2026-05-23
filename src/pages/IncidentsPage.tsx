import React, { useState, useMemo } from 'react';
import { useIncidentStore } from '@/store/incidentStore';
import { useWorkforceStore } from '@/store/workforceStore';
import DigitalTwinView from '@/components/visualization/DigitalTwinView';
import { motion, AnimatePresence } from 'motion/react';
import { IncidentStatus } from '@/types';
import { 
  ShieldAlert, 
  Activity, 
  Search, 
  Filter, 
  ChevronRight,
  MoreVertical,
  MapPin,
  ExternalLink,
  UserPlus,
  Zap,
  Plus,
  ArrowUpRight,
  Globe,
  PlusCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import KPICard from '@/components/shared/KPICard';
import IncidentDetailModal from '@/components/features/incidents/IncidentDetailModal';

const IncidentsPage: React.FC = () => {
  const { 
    incidents, 
    updateIncidentStatus, 
    setSelectedIncidentId, 
    selectedIncidentId,
    escalateIncident
  } = useIncidentStore();
  const { crews, updateCrew } = useWorkforceStore();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedIncident = useMemo(() => 
    incidents.find(i => i.id === selectedIncidentId), 
  [incidents, selectedIncidentId]);

  const handleUpdateStatus = (status: IncidentStatus, notes?: string) => {
    if (selectedIncidentId) {
      updateIncidentStatus(selectedIncidentId, status, notes);
      
      if (status === 'resolved' && selectedIncident?.assignedOperator) {
        const crew = crews.find(c => c.name === selectedIncident.assignedOperator);
        if (crew) {
          updateCrew(crew.id, { operationalStatus: 'available', activeIncidentId: null });
        }
        setSelectedIncidentId(null);
      }
    }
  };

  const handleAssignOperator = (operatorName: string) => {
    if (selectedIncidentId) {
      const crew = crews.find(c => c.name === operatorName);
      if (crew) {
        updateCrew(crew.id, { operationalStatus: 'responding', activeIncidentId: selectedIncidentId });
        useIncidentStore.setState(state => ({
          incidents: state.incidents.map(inc => 
            inc.id === selectedIncidentId ? { ...inc, assignedOperator: operatorName, status: 'acknowledged' } : inc
          )
        }));
      }
    }
  };

  const handleEscalate = () => {
    if (selectedIncidentId) {
      escalateIncident(selectedIncidentId);
    }
  };

  const stats = useMemo(() => [
    { label: 'Platform Load', value: 94.2, unit: '%', progress: 94, variant: 'blue' as const, icon: Activity },
    { label: 'Unassigned', value: incidents.filter(i => !i.assignedOperator && i.status !== 'resolved' && i.status !== 'closed').length, subValue: 'Pending dispatch', variant: 'red' as const, icon: ShieldAlert },
    { label: 'Escalations', value: incidents.filter(i => i.escalationLevel > 0).length, subValue: 'High priority', variant: 'orange' as const, icon: Zap },
    { label: 'Resolution Rate', value: 89, unit: '%', subValue: 'Last 24h', variant: 'emerald' as const, icon: Activity },
  ], [incidents]);

  const filteredIncidents = useMemo(() => {
    let result = incidents;
    if (activeTab === 'Critical') result = incidents.filter(i => i.severity === 'critical');
    else if (activeTab === 'High') result = incidents.filter(i => i.severity === 'high');
    else if (activeTab === 'Resolved') result = incidents.filter(i => i.status === 'resolved');

    return result.filter(i => 
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.incidentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.incidentType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [incidents, activeTab, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden font-sans p-4 sm:p-6 text-slate-900">
      {/* Header HUD */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Operational Anomaly Matrix</h1>
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 mt-0.5 uppercase tracking-[0.2em] leading-none sm:leading-normal">Real-time incident response, risk mitigation and escalation hub</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm grow sm:grow-0">
             <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 grow sm:grow-0">
                Live Feed
             </button>
             <button className="px-3 sm:px-4 py-2 text-slate-400 hover:text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all grow sm:grow-0">
                Archive
             </button>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all font-black text-[10px] uppercase tracking-widest grow sm:grow-0 whitespace-nowrap">
             <PlusCircle size={12} />
             <span className="hidden xs:inline">Manual Escalation</span>
             <span className="xs:hidden">Manual</span>
          </button>
        </div>
      </div>

      {/* KPI HUD - Responsive Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 shrink-0">
        {stats.map((m, i) => (
          <div key={i} className={cn(i >= 2 && "hidden sm:block md:block")}>
            <KPICard {...m} value={m.value} subValue="Live Signal" />
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col xl:flex-row gap-4 sm:gap-6 min-h-0 overflow-y-auto lg:overflow-hidden pb-4 sm:pb-0">
        {/* Incident List */}
        <div className="flex-1 bg-white rounded-2xl sm:rounded-[2rem] border border-slate-200 shadow-xl flex flex-col overflow-hidden h-[400px] xl:h-full shrink-0">
          <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between bg-white relative z-10 gap-4">
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200 w-full md:w-auto overflow-x-auto no-scrollbar">
              {['All', 'Critical', 'High', 'Resolved'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-3 sm:px-4 py-2 text-[9px] font-black rounded-lg transition-all uppercase tracking-widest flex-1 md:flex-none whitespace-nowrap",
                    activeTab === tab 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Lookup anomaly..." 
                className="bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-11 pr-4 text-[11px] font-bold w-full md:w-72 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all placeholder:text-slate-300"
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto no-scrollbar">
            <div className="min-w-[800px] xl:min-w-0 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-white/80 backdrop-blur-md z-10 text-[9px] uppercase tracking-widest font-black text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="px-4 sm:px-6 py-4">Identity</th>
                    <th className="px-4 sm:px-6 py-4">Incident Matrix</th>
                    <th className="px-4 sm:px-6 py-4">Severity</th>
                    <th className="px-4 sm:px-6 py-4">Units</th>
                    <th className="px-4 sm:px-6 py-4">Status</th>
                    <th className="px-4 sm:px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredIncidents.map((inc) => (
                    <tr 
                      key={inc.id} 
                      onClick={() => setSelectedIncidentId(inc.id)}
                      className="hover:bg-slate-50/50 transition-colors group cursor-pointer border-l-4 border-transparent hover:border-blue-600"
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <span className="text-[10px] sm:text-[11px] font-black text-slate-900 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded shadow-sm">{inc.incidentCode}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 max-w-xs">
                        <div>
                          <p className="text-[11px] sm:text-[12px] font-black text-slate-900 line-clamp-1 uppercase tracking-tight leading-none">{inc.title}</p>
                          <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 line-clamp-1 mt-1 uppercase tracking-tighter">{inc.description}</p>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className={cn(
                          "text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border shadow-sm",
                          inc.severity === 'critical' ? "bg-red-50 text-red-600 border-red-100" :
                          inc.severity === 'high' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-blue-50 text-blue-600 border-blue-100"
                        )}>
                          {inc.severity}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          {inc.assignedOperator ? (
                            <>
                              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-[10px] font-black text-blue-600 border border-blue-100 shadow-sm grow-0 shrink-0">
                                 {inc.assignedOperator.charAt(0)}
                              </div>
                              <span className="text-[10px] font-black text-slate-900 uppercase tabular-nums truncate max-w-[80px]">{inc.assignedOperator}</span>
                            </>
                          ) : (
                            <button className="flex items-center gap-1.5 text-[9px] text-blue-600 font-black uppercase tracking-widest hover:underline group-hover:scale-105 transition-transform">
                              <UserPlus size={14} /> Dispatch
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                         <div className="flex items-center gap-2">
                           <div className={cn("w-1.5 h-1.5 rounded-full shadow-sm", inc.status === 'resolved' ? "bg-emerald-500" : "bg-amber-500")} />
                           <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{inc.status}</span>
                         </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                         <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white border border-transparent hover:border-slate-200 text-slate-400 hover:text-slate-900 transition-all">
                            <MoreVertical size={16} />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="px-4 sm:px-6 py-3 bg-slate-900 text-white shrink-0">
             <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.3em]">
               <span className="flex items-center gap-3"><Activity size={12} className="text-blue-500" /> Operational Matrix Status</span>
               <span className="text-blue-400 hidden xs:inline">Sync Active</span>
             </div>
          </div>
        </div>

        {/* Tactical Map */}
        <div className="w-full xl:w-80 flex flex-col gap-4 sm:gap-6 shrink-0 h-[400px] xl:h-full">
          <div className="flex-1 bg-white rounded-2xl sm:rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col relative">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <h3 className="text-[9px] sm:text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={16} className="text-red-500" />
                Sector Overwatch
              </h3>
              <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-blue-600 transition-all">
                <Filter size={14} />
              </button>
            </div>
            <div className="flex-1 relative bg-slate-50 min-h-0">
               <DigitalTwinView onlyShowLayer="incidents" theme="light" />
               
               {/* Map Controls */}
               <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 z-10">
                 <div className="bg-white/95 backdrop-blur-xl p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-xl border border-slate-100">
                    <div className="flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">
                      <span>Threat Index</span>
                      <span className="text-slate-900">4.2 Alpha</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full w-2/3 shadow-[0_0_8px_rgba(37,99,235,0.2)]" />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                       <span>Nodes Active</span>
                       <ArrowUpRight size={12} className="text-slate-300" />
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Incident Detail Modal */}
      <AnimatePresence>
        {selectedIncident && (
          <IncidentDetailModal 
            incident={selectedIncident}
            onClose={() => setSelectedIncidentId(null)}
            onUpdateStatus={handleUpdateStatus}
            onAssignOperator={handleAssignOperator}
            onEscalate={handleEscalate}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default IncidentsPage;
