import React from 'react';
import { useIncidentStore } from '@/store/incidentStore';
import { OperationalIncident, IncidentSeverity } from '@/types';
import { AlertTriangle, Info, AlertCircle, Clock, MapPin, CheckCircle, ChevronRight, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const SeverityBadge: React.FC<{ severity: IncidentSeverity }> = ({ severity }) => {
  const config = {
    low: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/50', icon: Info },
    medium: { color: 'bg-amber-500/20 text-amber-400 border-amber-500/50', icon: AlertTriangle },
    high: { color: 'bg-orange-500/20 text-orange-400 border-orange-500/50', icon: AlertCircle },
    critical: { color: 'bg-red-500/20 text-red-400 border-red-500/50', icon: AlertCircle },
  };

  const { color, icon: Icon } = config[severity];

  return (
    <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider", color)}>
      <Icon size={10} />
      {severity}
    </div>
  );
};

export const IncidentFeed: React.FC = () => {
  const { setSelectedIncidentId, selectedIncidentId, getFilteredIncidents, filters, setFilters } = useIncidentStore();
  const incidents = getFilteredIncidents();

  return (
    <div className="flex flex-col h-full pointer-events-auto">
      {/* Filters HUD */}
      <div className="glass-panel p-3 rounded-t-xl border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">Incident Feed</h3>
        </div>
        <div className="flex gap-2">
            <select 
                className="bg-slate-900 border border-slate-700 text-[10px] text-slate-300 rounded px-1 py-0.5"
                value={filters.severity}
                onChange={(e) => setFilters({ severity: e.target.value as any })}
            >
                <option value="all">SVR: ALL</option>
                <option value="low">LOW</option>
                <option value="medium">MED</option>
                <option value="high">HIGH</option>
                <option value="critical">CRIT</option>
            </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden glass-panel border-t-0 rounded-b-xl border-slate-800 custom-scrollbar p-2 space-y-2">
        {incidents.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 opacity-50">
                <CheckCircle size={32} className="text-emerald-500 mb-2" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Active Incidents</span>
            </div>
        ) : (
            incidents.map((incident) => (
                <div 
                    key={incident.id}
                    onClick={() => setSelectedIncidentId(incident.id)}
                    className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-all duration-200 group relative",
                        selectedIncidentId === incident.id 
                            ? "bg-slate-800/80 border-cyan-500/50 shadow-lg shadow-cyan-500/10" 
                            : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40"
                    )}
                >
                    <div className="flex justify-between items-start mb-2">
                        <SeverityBadge severity={incident.severity} />
                        <span className="text-[9px] font-mono text-slate-500">{format(new Date(incident.createdAt), 'HH:mm:ss')}</span>
                    </div>
                    
                    <h4 className="text-[11px] font-bold text-slate-200 mb-1 leading-tight">{incident.title}</h4>
                    
                    <div className="flex items-center gap-2 text-[9px] text-slate-500 mb-2">
                        <span className="uppercase font-bold text-slate-600">{incident.sourceModule}</span>
                        <span>•</span>
                        <span className="font-mono">{incident.incidentCode}</span>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-1 text-[9px] text-slate-400">
                            <MapPin size={10} className="text-slate-500" />
                            <span>{incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)}</span>
                        </div>
                        <ChevronRight size={14} className={cn(
                            "transition-transform",
                            selectedIncidentId === incident.id ? "text-cyan-400 translate-x-0" : "text-slate-700 group-hover:translate-x-1"
                        )} />
                    </div>

                    {incident.escalationLevel > 0 && (
                        <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden pointer-events-none">
                            <div className={cn(
                                "absolute top-1 right-[-24px] rotate-45 text-[7px] font-bold py-0.5 px-6 text-center text-white",
                                incident.escalationLevel === 2 ? "bg-red-600 shadow-sm" : "bg-orange-500"
                            )}>
                                ESC-{incident.escalationLevel}
                            </div>
                        </div>
                    )}
                </div>
            ))
        )}
      </div>
    </div>
  );
};
