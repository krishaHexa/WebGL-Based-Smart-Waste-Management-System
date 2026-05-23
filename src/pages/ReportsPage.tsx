import React, { useState, useMemo } from 'react';
import { useReportStore, ExportFormat } from '@/store/reportStore';
import { 
  FileText, 
  Download, 
  Share2, 
  Printer, 
  Calendar, 
  Filter, 
  ChevronRight,
  BarChart3,
  Truck,
  Trash2,
  Building2,
  ShieldAlert,
  Leaf,
  Zap,
  Loader2,
  CheckCircle2,
  FileBarChart,
  Grid,
  Activity,
  ArrowRight,
  Sparkles,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import KPICard from '@/components/shared/KPICard';

const reportCategories = [
  { id: 'executive', label: 'Executive Intelligence', icon: BarChart3, description: 'Overall operational performance and strategic growth ROI' },
  { id: 'fleet', label: 'Fleet Dynamics', icon: Truck, description: 'Real-time vehicle utilization and fuel efficiency metrics' },
  { id: 'bins', label: 'Asset Fill Matrix', icon: Trash2, description: 'Pattern analysis and logistical overflow hotspot mapping' },
  { id: 'facilities', label: 'Processing Throughput', icon: Building2, description: 'Infrastructure node output and sorting efficiency logs' },
  { id: 'incidents', label: 'Security & Safety Audit', icon: ShieldAlert, description: 'Comprehensive event history and rapid response intervals' },
  { id: 'environmental', label: 'Ecological Impact', icon: Leaf, description: 'Carbon sequestration and recycling diverted tonnage' },
];

const ReportsPage: React.FC = () => {
  const { config, setConfig, generateReport, isGenerating, lastGeneratedReport, exportReport } = useReportStore();
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = reportCategories.filter(cat => 
    cat.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 p-4 sm:p-6 overflow-hidden font-sans text-slate-900">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none">Intelligence & Analytics Hub</h1>
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 mt-1.5 uppercase tracking-[0.2em] leading-none shrink-0">Unified reporting engine for operational business intelligence</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
           {lastGeneratedReport && (
             <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm grow sm:grow-0 justify-center">
                <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                   <Printer size={16} />
                </button>
                <div className="w-px h-4 bg-slate-100 mx-1 self-center" />
                <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                   <Share2 size={16} />
                </button>
             </div>
           )}
           <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all font-black text-[10px] uppercase tracking-widest grow">
              <Sparkles size={12} />
              AI Insight Engine
           </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col xl:flex-row gap-4 sm:gap-6 min-h-0 overflow-y-auto lg:overflow-hidden pb-4 sm:pb-0">
        {/* Config Sidebar */}
        <div className="w-full xl:w-80 flex flex-col gap-6 overflow-hidden shrink-0 h-[400px] xl:h-full">
           <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl flex flex-col overflow-hidden h-full">
             <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <h3 className="text-[9px] sm:text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Report Architect</h3>
                <Filter size={12} className="text-slate-400" />
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
                <div>
                   <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Filter matrices..." 
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-8 pr-4 text-[10px] font-bold focus:ring-4 focus:ring-blue-600/5 outline-none transition-all placeholder:text-slate-300"
                      />
                   </div>
                   <div className="space-y-1.5 overflow-x-auto no-scrollbar">
                      {filteredCategories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setConfig({ type: cat.id as any })}
                          className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-xl sm:rounded-2xl border transition-all text-left group shrink-0",
                            config.type === cat.id 
                              ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20" 
                              : "bg-white border-slate-50 text-slate-400 hover:bg-slate-50 hover:border-slate-100"
                          )}
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-lg sm:rounded-xl flex items-center justify-center transition-all shrink-0",
                            config.type === cat.id ? "bg-white/20 text-white" : "bg-slate-50 text-slate-400 group-hover:bg-white"
                          )}>
                             <cat.icon size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                             <p className={cn(
                               "text-[10px] sm:text-[11px] font-black uppercase tracking-tight leading-none",
                               config.type === cat.id ? "text-white" : "text-slate-900"
                             )}>{cat.label}</p>
                             <p className={cn(
                               "text-[8px] sm:text-[9px] font-bold truncate mt-1 leading-none uppercase tracking-tighter",
                               config.type === cat.id ? "text-blue-100" : "text-slate-400"
                             )}>{cat.description}</p>
                          </div>
                        </button>
                      ))}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 pl-1">Temporal Scope</label>
                    <button className="w-full flex items-center justify-between p-3 rounded-xl sm:rounded-2xl border border-slate-100 text-[10px] font-black text-slate-900 hover:bg-slate-50 transition-all bg-white shadow-sm uppercase tracking-tight">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-blue-600" />
                          Last 30 Days
                        </div>
                        <ChevronRight size={12} className="text-slate-300" />
                    </button>
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 pl-1">Export encoding</label>
                    <div className="grid grid-cols-3 gap-2">
                        {['pdf', 'csv', 'json'].map(fmt => (
                          <button
                            key={fmt}
                            onClick={() => setSelectedFormat(fmt as any)}
                            className={cn(
                              "py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all",
                              selectedFormat === fmt 
                                ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/10" 
                                : "bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-600"
                            )}
                          >
                            {fmt}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
             </div>

             <div className="p-4 sm:p-5 bg-slate-50 shrink-0">
                <button 
                  onClick={() => generateReport()}
                  disabled={isGenerating}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                  {isGenerating ? 'Compiling...' : 'Generate Matrix'}
                </button>
             </div>
           </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-white rounded-2xl sm:rounded-[2rem] border border-slate-200 shadow-xl flex flex-col overflow-hidden relative group min-h-[500px]">
           <AnimatePresence mode="wait">
             {lastGeneratedReport ? (
               <motion.div 
                 key="report"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="flex-1 flex flex-col p-6 sm:p-10 overflow-y-auto no-scrollbar pb-24 sm:pb-32"
               >
                 {/* Report Header */}
                 <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8 pb-8 border-b border-slate-100">
                    <div>
                       <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 shadow-sm leading-none shrink-0">REP_{lastGeneratedReport.id.slice(0,8)}</span>
                          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm leading-none shrink-0">
                             <CheckCircle2 size={10} />
                             <span className="text-[9px] font-black uppercase tracking-widest">Verified</span>
                          </div>
                       </div>
                       <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">{reportCategories.find(c => c.id === lastGeneratedReport.config.type)?.label}</h2>
                       <p className="text-[10px] font-bold text-slate-400 mt-2 flex items-center gap-2 uppercase tracking-widest leading-none">
                         <Activity size={12} className="text-slate-300" />
                         Sync: {new Date(lastGeneratedReport.timestamp).toLocaleDateString()} // {new Date(lastGeneratedReport.timestamp).toLocaleTimeString()}
                       </p>
                    </div>
                    <div className="text-left sm:text-right">
                       <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1 leading-none">Security Protocol</p>
                       <p className="text-base sm:text-lg font-black text-slate-900 tracking-tighter uppercase leading-none">INTERNAL_ONLY</p>
                    </div>
                 </div>

                 {/* KPIs Row */}
                 <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
                    {Object.entries(lastGeneratedReport.summary).map(([key, value]) => (
                      <div key={key} className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl transition-all border-l-4 border-l-blue-600">
                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 leading-none">{key.replace(/([A-Z])/g, ' $1')}</span>
                         <div className="flex items-end gap-1 font-black">
                            <span className="text-lg sm:text-xl text-slate-900 tracking-tighter">{String(value)}</span>
                            <span className="text-[9px] text-slate-400 mb-0.5">PTS</span>
                         </div>
                      </div>
                    ))}
                 </div>

                 {/* Content Sections */}
                 <div className="flex-1 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                         <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 leading-none">
                           <FileBarChart size={14} className="text-blue-600" />
                           Node Intelligence
                         </h3>
                         <div className="space-y-2">
                            {lastGeneratedReport.datasets.map((data: any, i: number) => (
                              <div key={i} className="flex items-center justify-between p-3.5 bg-white border border-slate-50 rounded-xl hover:border-blue-600/30 hover:shadow-lg transition-all group/item shadow-sm">
                                 <span className="text-[10px] sm:text-[11px] font-black text-slate-600 uppercase tracking-tight truncate mr-2">{data.name}</span>
                                 <div className="flex items-center gap-3 shrink-0">
                                    <div className="w-12 sm:w-20 bg-slate-100 h-1 rounded-full overflow-hidden hidden xs:block">
                                       <div className="bg-blue-600 h-full w-2/3 group-hover/item:scale-x-110 transition-transform origin-left" />
                                    </div>
                                    <span className="text-[11px] sm:text-[12px] font-black text-slate-900 tabular-nums">{data.value}</span>
                                 </div>
                              </div>
                            ))}
                         </div>
                       </div>

                       <div className="space-y-4">
                          <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 leading-none">
                            <Zap size={14} className="text-blue-600" />
                            AI Insight Synthesis
                          </h3>
                          <div className="p-5 sm:p-6 bg-slate-900 rounded-2xl text-white shadow-xl relative overflow-hidden group/box">
                             <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 blur-[40px] rounded-full group-hover/box:bg-blue-600/20 transition-all" />
                             <p className="text-[11px] sm:text-[12px] font-bold text-blue-100 leading-relaxed italic relative z-10 uppercase tracking-tight">
                                "Operation Intelligence suggests significant efficiency gain in route vector #4 Riyadh. Predicted carbon diversion for current scope remains within target boundaries of 88.5%."
                             </p>
                             <div className="mt-6 flex items-center justify-between relative z-10 text-[8px] font-black uppercase tracking-widest text-blue-500">
                                <span>Engine: GEMINI_FLASH</span>
                                <span>Confidence: 99%</span>
                             </div>
                          </div>
                          
                          <div className="p-3 sm:p-4 rounded-xl border border-blue-100 bg-blue-50/20 flex items-center justify-between group/link cursor-pointer hover:bg-blue-50 transition-all">
                             <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-white border border-blue-50 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                                  <Activity size={14} />
                                </div>
                                <div>
                                   <p className="text-[9px] font-black text-slate-900 uppercase tracking-tight">Real-time Pulse</p>
                                   <p className="text-[8px] font-bold text-slate-400 uppercase leading-none mt-1">Operational view</p>
                                </div>
                             </div>
                             <ArrowRight size={14} className="text-blue-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Bottom Actions */}
                 <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row justify-between items-center bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200 gap-4 shadow-xl">
                    <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest text-center sm:text-left">Compiled autonomously by SmartWaste OS</p>
                    <button 
                      onClick={() => exportReport(selectedFormat)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95 group"
                    >
                      <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                      Export: .{selectedFormat}
                    </button>
                 </div>
               </motion.div>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-40">
                  <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 shadow-inner border border-slate-100">
                    <Grid size={32} className="text-slate-200" />
                  </div>
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Intelligence Matrix Empty</h3>
                  <p className="text-xs font-bold text-slate-400 max-w-xs mt-2 leading-relaxed uppercase tracking-tighter">The analytical engine is on standby. Select an operational sector to compile a intelligence matrix.</p>
               </div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
