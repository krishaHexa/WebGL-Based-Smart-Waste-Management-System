import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  MapPin, 
  Clock, 
  User, 
  ShieldAlert, 
  AlertTriangle, 
  History, 
  MessageSquare, 
  UserPlus,
  ArrowUpCircle,
  CheckCircle2
} from 'lucide-react';
import { OperationalIncident, IncidentStatus, IncidentSeverity } from '@/types';
import { cn, formatNumber } from '@/lib/utils';

import { useWorkforceStore } from '@/store/workforceStore';

interface IncidentDetailModalProps {
  incident: OperationalIncident;
  onClose: () => void;
  onUpdateStatus: (status: IncidentStatus, notes?: string) => void;
  onAssignOperator: (operatorName: string) => void;
  onEscalate: () => void;
}

const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({ 
  incident, 
  onClose, 
  onUpdateStatus,
  onAssignOperator,
  onEscalate
}) => {
  const { crews } = useWorkforceStore();
  const [activeTab, setActiveTab] = React.useState<'details' | 'timeline' | 'notes'>('details');
  const [resolutionNote, setResolutionNote] = React.useState('');

  const availableCrews = crews.filter(c => c.operationalStatus === 'available' || c.name === incident.assignedOperator);

  const severityColors = {
    low: 'bg-blue-50 text-blue-600 border-blue-100',
    medium: 'bg-amber-50 text-amber-600 border-amber-100',
    high: 'bg-orange-50 text-orange-600 border-orange-100',
    critical: 'bg-red-50 text-red-600 border-red-100',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg",
              incident.severity === 'critical' ? "bg-red-600 text-white" : "bg-blue-600 text-white"
            )}>
              <ShieldAlert size={24} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white border border-slate-100 px-2 py-0.5 rounded shadow-sm">
                  {incident.incidentCode}
                </span>
                <span className={cn(
                  "text-[10px] font-black uppercase px-2 py-0.5 rounded border shadow-sm",
                  severityColors[incident.severity]
                )}>
                  {incident.severity}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">{incident.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 transition-all shadow-sm">
            <X size={20} />
          </button>
        </div>

        {/* Content Tabs */}
        <div className="flex border-b border-slate-50 px-8 bg-white">
          {[
            { id: 'details', label: 'Incident Assessment', icon: AlertTriangle },
            { id: 'timeline', label: 'Operational Timeline', icon: History },
            { id: 'notes', label: 'Communication Log', icon: MessageSquare }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "py-4 px-6 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 border-b-2 transition-all",
                activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"
              )}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-8 no-scrollbar bg-white">
          {activeTab === 'details' && (
            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-2 space-y-8">
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Incident Summary</h3>
                  <p className="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                    {incident.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Origin Context</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                          <MapPin size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Source Module</p>
                          <p className="text-xs font-bold text-slate-900">{incident.sourceModule.toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                          <Clock size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Detected At</p>
                          <p className="text-xs font-bold text-slate-900">{new Date(incident.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Tactical Status</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <User size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Assigned Personnel</p>
                          <p className="text-xs font-bold text-slate-900">{incident.assignedOperator || 'Awaiting Dispatch'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                          <ArrowUpCircle size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Escalation Rank</p>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-slate-900">Level {incident.escalationLevel}</p>
                            <button 
                              onClick={onEscalate}
                              className="p-1 hover:bg-slate-100 rounded-lg text-blue-600 transition-all"
                              title="Escalate Severity"
                            >
                              <ArrowUpCircle size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {incident.status !== 'resolved' && (
                  <div className="p-6 rounded-2xl bg-slate-900 text-white">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Command Action: Resolve Incident</h4>
                    <textarea 
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                      placeholder="Input operational resolution summary..."
                      className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-xs font-medium focus:ring-4 focus:ring-blue-600/20 outline-none transition-all min-h-[100px] placeholder:text-white/20"
                    />
                    <div className="flex justify-end mt-4">
                       <button 
                         disabled={!resolutionNote}
                         onClick={() => onUpdateStatus('resolved', resolutionNote)}
                         className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all font-bold text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                         <CheckCircle2 size={14} />
                         Execute Resolution
                       </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-xl h-full">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Dispatch Control</h4>
                  <div className="space-y-4">
                    {availableCrews.map(crew => (
                      <button 
                        key={crew.id}
                        disabled={incident.assignedOperator === crew.name}
                        onClick={() => onAssignOperator(crew.name)}
                        className={cn(
                          "w-full p-4 rounded-2xl border transition-all text-left flex items-center gap-4 group",
                          incident.assignedOperator === crew.name 
                            ? "bg-blue-600 border-blue-600 text-white" 
                            : "bg-slate-50 border-slate-50 hover:bg-white hover:border-blue-100 hover:shadow-lg"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shadow-lg italic",
                          incident.assignedOperator === crew.name ? "bg-white text-blue-600" : "bg-blue-600 text-white"
                        )}>
                          {crew.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <p className={cn("text-xs font-bold", incident.assignedOperator === crew.name ? "text-white" : "text-slate-900")}>
                            {crew.name}
                          </p>
                          <p className={cn("text-[10px] font-bold uppercase tracking-tighter", incident.assignedOperator === crew.name ? "text-blue-100" : "text-slate-400")}>
                            {crew.role} // {crew.assignedZone}
                          </p>
                        </div>
                        {incident.assignedOperator !== crew.name && <UserPlus size={14} className="text-slate-300 group-hover:text-blue-600" />}
                      </button>
                    ))}
                    {availableCrews.length === 0 && (
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic text-center py-8">
                        No available personnel within range.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="max-w-2xl mx-auto space-y-8 py-4">
              {[
                { time: '10:05', label: 'Incident Detected', desc: 'System AI triggered alert based on telemetry anomaly.', icon: ShieldAlert, color: 'bg-red-500' },
                { time: '10:07', label: 'Auto-Logged', desc: 'Secure database entry generated for INC-2026-004.', icon: Clock, color: 'bg-blue-500' },
                { time: '10:10', label: 'Queue Placement', desc: 'Incident moved to high priority dispatch queue.', icon: History, color: 'bg-slate-400' },
              ].map((step, idx) => (
                <div key={idx} className="flex gap-6 relative">
                  {idx < 2 && <div className="absolute left-6 top-10 bottom-[-32px] w-px bg-slate-100" />}
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg", step.color)}>
                    <step.icon size={20} />
                  </div>
                  <div className="pt-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{step.time} SYNC</p>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{step.label}</h4>
                    <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex flex-col items-center justify-center py-20 text-center">
                 <MessageSquare size={48} className="text-slate-100 mb-4" />
                 <p className="text-xs font-bold text-slate-300 uppercase tracking-widest lg:w-64 leading-loose">Internal comms log is restricted to authorized operators only.</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default IncidentDetailModal;
