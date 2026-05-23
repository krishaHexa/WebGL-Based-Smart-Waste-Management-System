import React, { useState } from 'react';
import { useIncidentStore } from '@/store/incidentStore';
import { IncidentStatus } from '@/types';
import { X, Clock, MapPin, ArrowRight, Shield, AlertCircle, CheckCircle2, MessageSquare, User, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { motion } from 'motion/react';

export const IncidentDetailPanel: React.FC = () => {
  const { selectedIncidentId, incidents, setSelectedIncidentId, updateIncidentStatus, escalateIncident } = useIncidentStore();
  const [resolutionNotes, setResolutionNotes] = useState('');
  
  const incident = incidents.find(i => i.id === selectedIncidentId);

  if (!incident) return null;

  const handleStatusUpdate = (status: IncidentStatus) => {
    updateIncidentStatus(incident.id, status, resolutionNotes);
    setResolutionNotes('');
  };

  const statusColors: Record<IncidentStatus, string> = {
    'detected': 'bg-slate-100 text-slate-600 border-slate-200',
    'acknowledged': 'bg-blue-50 text-blue-600 border-blue-100',
    'assigned': 'bg-purple-50 text-purple-600 border-purple-100',
    'in-progress': 'bg-amber-50 text-amber-600 border-amber-100',
    'escalated': 'bg-red-50 text-red-600 border-red-100',
    'resolved': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'closed': 'bg-slate-900 text-white border-slate-800'
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed top-0 right-0 h-full w-[400px] bg-white border-l border-slate-200 shadow-2xl flex flex-col z-[50] font-sans"
    >
      {/* Header */}
      <div className={cn(
        "p-6 border-b flex items-center justify-between",
        incident.severity === 'critical' ? "bg-red-50/50 border-red-100" : "bg-slate-50/50 border-slate-100"
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
               "p-3 rounded-xl shadow-sm border",
               incident.severity === 'critical' ? "bg-white text-red-600 border-red-100" : "bg-white text-blue-600 border-blue-100"
          )}>
            <AlertCircle size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
               <h3 className="text-xs font-black text-slate-400 tracking-widest uppercase">{incident.incidentCode}</h3>
               <span className={cn(
                  "text-[8px] font-black uppercase px-2 py-0.5 rounded border shadow-sm",
                  statusColors[incident.status]
               )}>{incident.status}</span>
            </div>
            <h2 className="text-[13px] font-black text-slate-900 uppercase tracking-tight mt-1 truncate w-48">
                {incident.incidentType.replace('_', ' ')}
            </h2>
          </div>
        </div>
        <button 
          onClick={() => setSelectedIncidentId(null)}
          className="h-8 w-8 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
        {/* Core Description */}
        <div className="space-y-3">
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none pl-1">Incident Intelligence</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed font-bold bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner italic">
                "{incident.description}"
            </p>
        </div>

        {/* Operational Context Grid */}
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl group hover:bg-white hover:shadow-lg transition-all">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2">Assigned Unit</span>
                <div className="flex items-center gap-2">
                   <div className="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <User size={12} />
                   </div>
                   <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight truncate">{incident.assignedOperator || 'Unassigned'}</span>
                </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl group hover:bg-white hover:shadow-lg transition-all">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2">Severity Level</span>
                <div className="flex items-center gap-2">
                   <div className={cn(
                      "h-2 w-2 rounded-full",
                      incident.severity === 'critical' ? "bg-red-500 animate-pulse" : "bg-amber-500"
                   )} />
                   <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{incident.severity.toUpperCase()}</span>
                </div>
            </div>
        </div>

        {/* Linked Assets */}
        <div className="space-y-3">
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none pl-1">Relational Assets</h3>
            <div className="flex flex-wrap gap-2">
               {incident.linkedAssets?.map(assetId => (
                 <div key={assetId} className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-[10px] font-black text-slate-600 uppercase tracking-tight flex items-center gap-2 shadow-sm hover:border-blue-600/30 transition-all cursor-pointer">
                    <Shield size={10} className="text-blue-500" />
                    {assetId}
                 </div>
               ))}
               <button className="px-3 py-1.5 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-[9px] font-black text-slate-400 uppercase flex items-center gap-2 hover:bg-white hover:border-blue-500/50 hover:text-blue-600 transition-all">
                  <ArrowRight size={10} />
                  Link New
               </button>
            </div>
        </div>

        {/* Lifecycle Discovery Timeline */}
        <div className="space-y-4">
           <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none pl-1">Operational Lifecycle</h3>
           <div className="space-y-4 relative pl-3">
              <div className="absolute left-[3.5px] top-2 bottom-2 w-[1px] bg-slate-100" />
              {incident.history?.map((event, i) => (
                <div key={i} className="relative pl-6">
                   <div className={cn(
                     "absolute left-[-1.5px] top-1 h-2 w-2 rounded-full ring-2 ring-white",
                     i === incident.history.length - 1 ? "bg-blue-600 animate-pulse" : "bg-slate-200"
                   )} />
                   <div className="flex items-center justify-between">
                      <span className="text-[8px] font-black text-slate-400 tabular-nums uppercase tracking-widest">{format(new Date(event.timestamp), 'HH:mm:ss')} // {event.status.toUpperCase()}</span>
                      {event.operator && <span className="text-[7px] font-black text-blue-500 uppercase">{event.operator}</span>}
                   </div>
                   <p className="text-[10px] font-bold text-slate-700 mt-1 uppercase tracking-tight leading-relaxed">{event.message}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Tactical Actions */}
        {incident.status !== 'resolved' && incident.status !== 'closed' && (
            <div className="pt-6 border-t border-slate-100 bg-slate-50 -mx-6 px-6 pb-6 rounded-b-3xl">
                <div className="space-y-3 mb-6">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 pl-1">
                        <MessageSquare size={12} className="text-blue-500" />
                        Resolution Directives
                    </label>
                    <textarea 
                        value={resolutionNotes}
                        onChange={(e) => setResolutionNotes(e.target.value)}
                        placeholder="Log operational directives..."
                        className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-[10px] text-slate-900 focus:outline-none focus:border-blue-600 focus:shadow-lg transition-all h-24 no-scrollbar resize-none font-bold uppercase tracking-tight shadow-sm"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => handleStatusUpdate('in-progress')}
                        className="py-3.5 px-4 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-blue-600/30 hover:text-blue-600 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        Deploy Unit
                    </button>
                    <button 
                         onClick={() => handleStatusUpdate('resolved')}
                         className="py-3.5 px-4 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10 active:scale-95"
                    >
                        <CheckCircle2 size={14} />
                        Resolve
                    </button>
                    <button 
                         onClick={() => escalateIncident(incident.id)}
                         className="py-3 px-4 rounded-xl border border-red-100 bg-red-50/50 text-red-600 text-[9px] font-black uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2 col-span-2 mt-1"
                    >
                        <Shield size={12} />
                        Protocol Escalation
                    </button>
                </div>
            </div>
        )}
      </div>

      {/* Persistence Interface */}
      <div className="p-6 border-t border-slate-100 bg-white flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
               <History size={14} />
            </div>
            <div>
               <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest leading-none">Command Audit</p>
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1 leading-none">Last sync: Just Now</p>
            </div>
         </div>
         <span className="text-[9px] font-black text-slate-300 tabular-nums uppercase tracking-widest">OP_SEQ_{incident.id.slice(-4)}</span>
      </div>
    </motion.div>
  );
};
