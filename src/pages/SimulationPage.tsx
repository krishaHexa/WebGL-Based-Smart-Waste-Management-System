import React, { useMemo, useEffect } from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import { useAIAssistantStore } from '@/store/aiAssistantStore';
import { 
  Play, 
  PlayCircle,
  Square, 
  Zap, 
  Activity,
  ShieldCheck,
  Bot,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

const SimulationPage: React.FC = () => {
  const { state, scenarios, startSimulation, stopSimulation, tick, cascadingRisks } = useSimulationStore();
  const { sendMessage, toggleChat } = useAIAssistantStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state.isActive) {
      interval = setInterval(tick, 1000);
    }
    return () => clearInterval(interval);
  }, [state.isActive, tick]);

  const activeScenario = useMemo(() => 
    scenarios.find(s => s.id === state.activeScenarioId),
    [state.activeScenarioId, scenarios]
  );

  const mockStressData = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      time: i,
      load: state.isActive ? 60 + Math.random() * 30 : 20 + Math.random() * 10,
      risk: state.isActive ? 40 + Math.random() * 50 : 10 + Math.random() * 5
    }));
  }, [state.isActive]);

  const handleAskAI = () => {
    if (!activeScenario) return;
    sendMessage(`Analyze the current simulation: ${activeScenario.name}. What are the predicted operational bottlenecks and cascading risks?`);
    toggleChat(true);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 p-6 gap-6 overflow-y-auto no-scrollbar font-sans text-slate-900">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
            <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3 leading-none">
                <PlayCircle className="text-indigo-600" />
                Scenario Control Center
            </h1>
            <p className="text-[11px] font-bold text-slate-400 mt-1.5 uppercase tracking-[0.2em] leading-none">Stress-testing resource allocation and response protocols</p>
        </div>

        <div className="flex items-center gap-3">
            {state.isActive && (
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest leading-none">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm" />
                    Runtime: {Math.floor(state.elapsedSeconds / 60)}M {state.elapsedSeconds % 60}S
                </div>
            )}
            <button 
                onClick={state.isActive ? stopSimulation : undefined}
                disabled={!state.isActive}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all shadow-sm",
                    state.isActive 
                        ? "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/10" 
                        : "bg-white text-slate-300 cursor-not-allowed border border-slate-100"
                )}
            >
                <Square size={12} fill="currentColor" />
                Stop Simulation
            </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 min-h-0">
        {/* Scenario Selection */}
        <div className="col-span-8 flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
                {scenarios.map((scenario) => (
                    <button
                        key={scenario.id}
                        onClick={() => !state.isActive && startSimulation(scenario.id)}
                        disabled={state.isActive && state.activeScenarioId !== scenario.id}
                        className={cn(
                            "bg-white p-5 rounded-[2rem] border transition-all relative group overflow-hidden shadow-sm",
                            state.activeScenarioId === scenario.id 
                                ? "border-indigo-600 ring-4 ring-indigo-600/5 shadow-xl" 
                                : state.isActive 
                                    ? "opacity-40 grayscale cursor-not-allowed border-slate-100" 
                                    : "border-slate-100 hover:border-indigo-600/30 hover:shadow-lg"
                        )}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={cn(
                                "p-3 rounded-2xl border transition-all",
                                state.activeScenarioId === scenario.id 
                                  ? "bg-indigo-600 text-white border-indigo-500 shadow-lg" 
                                  : "bg-slate-50 text-slate-400 border-slate-100 group-hover:bg-white"
                            )}>
                                <Activity size={20} />
                            </div>
                            <div className={cn(
                                "text-[8px] font-black uppercase px-2 py-0.5 rounded-lg border tracking-widest shadow-sm",
                                scenario.severity === 'critical' ? "bg-red-50 text-red-600 border-red-100" : "bg-amber-50 text-amber-600 border-amber-100"
                            )}>
                                {scenario.severity} Priority
                            </div>
                        </div>
                        <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{scenario.name}</h3>
                        <p className="text-[10px] font-bold text-slate-400 mt-2 leading-relaxed uppercase tracking-tighter">{scenario.description}</p>
                        
                        {state.activeScenarioId === scenario.id && (
                           <div className="absolute bottom-4 right-4">
                               <div className="text-[8px] text-indigo-600 font-black uppercase tracking-[0.2em] flex items-center gap-1.5 animate-pulse">
                                   Active Logic <Play size={8} fill="currentColor" />
                               </div>
                           </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Simulation Impact Visualization */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex flex-col">
                        <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] leading-none">Stress Test Vector: Load vs Risk Matrix</h3>
                        <span className="text-[9px] text-slate-400 font-black mt-2 uppercase tracking-tight">Isolated telemetric simulation stream</span>
                    </div>
                </div>
                <div className="flex-1 w-full min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mockStressData}>
                            <defs>
                                <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis hide />
                            <YAxis hide />
                            <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                            <Area type="monotone" dataKey="load" stroke="#4f46e5" fillOpacity={1} fill="url(#colorLoad)" strokeWidth={3} />
                            <Area type="monotone" dataKey="risk" stroke="#ef4444" fillOpacity={1} fill="url(#colorRisk)" strokeWidth={3} strokeDasharray="6 4" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Control & Impact Panel */}
        <div className="col-span-4 flex flex-col gap-6">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl flex flex-col">
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-2 leading-none">
                    <Zap size={14} className="text-amber-500" />
                    Impact Intelligence
                </h3>
                
                <div className="space-y-6">
                    {[
                        { label: 'Cumulative Impact', value: state.metrics.impactScore, unit: 'PTS', color: 'bg-indigo-600', text: 'text-indigo-600' },
                        { label: 'Affected Zones', value: state.metrics.affectedZones, unit: 'NODES', color: 'bg-blue-600', text: 'text-blue-600' },
                        { label: 'Escalated Alerts', value: state.metrics.escalatedAlerts, unit: 'ACTIVE', color: 'bg-red-500', text: 'text-red-500' },
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col gap-3">
                             <div className="flex justify-between items-end">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{stat.label}</span>
                                <div className="flex items-baseline gap-1 font-black">
                                    <span className={cn("text-xl tracking-tighter leading-none", stat.text)}>{stat.value}</span>
                                    <span className="text-[8px] text-slate-400 uppercase tracking-widest">{stat.unit}</span>
                                </div>
                             </div>
                             <div className="h-1.5 bg-slate-50 border border-slate-100 rounded-full overflow-hidden shadow-inner">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(stat.value / 100) * 100}%` }}
                                    className={cn("h-full rounded-full shadow-sm", stat.color)}
                                />
                             </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
                     <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                        <span className="text-slate-400">Resilience Index</span>
                        <span className="text-emerald-500 font-black">High Stability</span>
                     </div>
                     <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                        <span className="text-slate-400">Stress Vector</span>
                        <span className="text-blue-600 font-black tracking-widest">{state.isActive ? 'ELEVATED_LOAD' : 'NOMINAL_IDLE'}</span>
                     </div>
                </div>
            </div>

            {/* Cascading Risk Propagation */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl flex flex-col">
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2 leading-none">
                    <Layers size={14} className="text-blue-600" />
                    Cascading Risk Propagation
                </h3>
                
                <div className="space-y-3">
                    {cascadingRisks.map((risk) => (
                        <div key={risk.id} className="p-3.5 rounded-2xl bg-white border border-slate-100 flex items-center justify-between group hover:border-blue-600/30 transition-all">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-2 h-2 rounded-full",
                                    risk.status === 'affected' ? "bg-red-500 animate-pulse" :
                                    risk.status === 'imminent' ? "bg-amber-500" : "bg-emerald-500"
                                )} />
                                <div>
                                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{risk.name}</p>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">{risk.status}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-900 tabular-nums leading-none tracking-tighter">{risk.load}%</p>
                                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-1 leading-none">Stress</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Integration */}
            <div className="bg-slate-900 p-8 rounded-[2rem] shadow-2xl flex-1 flex flex-col gap-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity text-white pointer-events-none">
                    <Bot size={120} />
                </div>
                
                <div className="z-10 relative">
                    <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                       <Bot size={14} className="text-blue-500" />
                       Simulation Copilot
                    </h3>
                    <p className="text-[12px] font-bold text-slate-400 leading-relaxed italic uppercase tracking-tighter">
                      "Autonomous stress-testing identifies 94.2% of likely system failures before deployment."
                    </p>
                </div>

                <div className="mt-auto z-10">
                    <button 
                        onClick={handleAskAI}
                        disabled={!state.isActive}
                        className={cn(
                            "w-full flex items-center justify-center gap-2 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-black/20",
                            state.isActive 
                                ? "bg-blue-600 text-white hover:bg-blue-500 active:scale-95" 
                                : "bg-slate-800 text-slate-600 cursor-not-allowed"
                        )}
                    >
                        <Zap size={14} />
                        Synthesize Scenarios
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-auto border-t border-slate-200 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">
              <span className="flex items-center gap-2 leading-none">
                 <ShieldCheck size={12} className="text-emerald-500" />
                 Secure Protocol
              </span>
              <span className="flex items-center gap-2 leading-none">
                 <Layers size={12} className="text-blue-600" />
                 Isolated State
              </span>
          </div>
          <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">NODE_HASH: SC_SIM_ALPHAINE // REV_9</p>
      </div>
    </div>
  );
};

export default SimulationPage;
