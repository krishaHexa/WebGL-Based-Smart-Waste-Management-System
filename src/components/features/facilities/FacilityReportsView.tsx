import React from 'react';
import { 
  BarChart3, 
  Download, 
  FileText, 
  Filter, 
  Calendar, 
  Layout, 
  PieChart, 
  TrendingUp,
  Activity,
  FileDown
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { motion } from 'motion/react';

const FacilityReportsView: React.FC = () => {
  const reports = [
    { title: 'Processing Efficiency Q2', type: 'Operations', date: '2026-05-13', format: 'PDF', size: '2.4 MB' },
    { title: 'Environmental Compliance May', type: 'Regulatory', date: '2026-05-12', format: 'PDF', size: '1.8 MB' },
    { title: 'Machinery Utilization Metrics', type: 'Technical', date: '2026-05-10', format: 'XLSX', size: '4.2 MB' },
    { title: 'Hazardous Waste Audit Log', type: 'Safety', date: '2026-05-08', format: 'PDF', size: '3.1 MB' },
    { title: 'Energy Recovery vs Consumption', type: 'Sustainability', date: '2026-05-05', format: 'CSV', size: '0.8 MB' },
    { title: 'Facility Daily Throughput', type: 'Operations', date: '2026-05-14', format: 'PDF', size: '1.2 MB' },
  ];

  return (
    <div className="h-full flex flex-col p-8 space-y-8 overflow-y-auto no-scrollbar bg-slate-50">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Facility Data Intelligence</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Export Ready Intelligence // Regulatory Frameworks</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                 type="text" 
                 placeholder="Search reports..." 
                 className="h-11 pl-12 pr-6 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest focus:outline-none shadow-sm w-[280px]"
              />
           </div>
           <button className="h-11 px-8 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all">
              Initialize Report Build
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 flex flex-col gap-4">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600">
               <TrendingUp size={20} />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Build Velocity</p>
               <p className="text-2xl font-black text-slate-900 leading-none tabular-nums">+14.2%</p>
               <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest mt-2 leading-none">Intelligence Gain</p>
            </div>
         </div>
         <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 flex flex-col gap-4">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-purple-50 text-purple-600">
               <PieChart size={20} />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Compliance Rating</p>
               <p className="text-2xl font-black text-slate-900 leading-none tabular-nums">98.4</p>
               <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-2 leading-none">Score Index</p>
            </div>
         </div>
         <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 flex flex-col gap-4">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
               <Download size={20} />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Total Exports</p>
               <p className="text-2xl font-black text-slate-900 leading-none tabular-nums">1,242</p>
               <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-2 leading-none">Ready Archive</p>
            </div>
         </div>
         <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 flex flex-col gap-4">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-orange-50 text-orange-600">
               <Activity size={20} />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Active Queries</p>
               <p className="text-2xl font-black text-slate-900 leading-none tabular-nums">04</p>
               <p className="text-[8px] font-bold text-orange-500 uppercase tracking-widest mt-2 leading-none">Processing...</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
         {/* Reports List */}
         <div className="lg:col-span-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Intelligence Ledger // Ready Repos</h3>
               <div className="flex gap-2">
                  <div className="h-8 px-4 flex items-center rounded-lg bg-slate-50 border border-slate-100 text-[8px] font-black uppercase tracking-widest text-slate-400">
                     OPERATIONS
                  </div>
                  <div className="h-8 px-4 flex items-center rounded-lg bg-slate-50 border border-slate-100 text-[8px] font-black uppercase tracking-widest text-slate-400">
                     SYSTEM
                  </div>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
               {reports.map((report, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:border-blue-600/30 hover:shadow-xl hover:shadow-blue-600/5 transition-all group cursor-pointer"
                  >
                     <div className="flex justify-between items-start mb-6">
                        <div className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 flex items-center justify-center transition-colors">
                           <FileText size={24} />
                        </div>
                        <div className="text-right">
                           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded group-hover:bg-blue-600 group-hover:text-white transition-colors">{report.format}</span>
                           <p className="text-[9px] font-black text-slate-900 mt-2 tabular-nums leading-none tracking-tight">{report.size}</p>
                        </div>
                     </div>
                     <div>
                        <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-tight mb-1 group-hover:text-blue-600 transition-colors">{report.title}</h4>
                        <div className="flex items-center justify-between">
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Cat: {report.type}</span>
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none flex items-center gap-1">
                              <Calendar size={10} /> {report.date}
                           </span>
                        </div>
                     </div>
                     <button className="w-full mt-6 py-3 bg-slate-50 group-hover:bg-blue-600 border border-slate-100 group-hover:border-blue-600 text-slate-400 group-hover:text-white rounded-2xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all">
                        Download Report <FileDown size={14} />
                     </button>
                  </motion.div>
               ))}
            </div>
         </div>

         {/* Right Action Panel */}
         <div className="lg:col-span-4 bg-slate-900 rounded-[2rem] border border-white/10 shadow-2xl p-8 flex flex-col justify-between overflow-hidden relative">
            <div className="absolute top-0 right-0 p-12 opacity-5 translate-x-8 -translate-y-4">
               <PieChart size={280} strokeWidth={1} />
            </div>
            <div className="relative z-10 flex flex-col gap-8 h-full">
               <div className="h-14 w-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-white">
                  <BarChart3 size={28} />
               </div>
               <div>
                  <h3 className="text-[18px] font-black text-white uppercase tracking-tight leading-none mb-3">Facility Performance Console</h3>
                  <p className="text-[11px] font-bold text-white/40 uppercase tracking-[0.2em] leading-relaxed">
                     Automated data processing engine with multi-regional export protocols.
                  </p>
               </div>
               <div className="flex-1 space-y-6 pt-8 border-t border-white/10">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center group hover:bg-white/10 transition-all cursor-pointer">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-blue-600 border border-blue-500 flex items-center justify-center text-white">
                           <Layout size={20} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-white uppercase tracking-tight leading-none mb-1">Visual Insights</p>
                           <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest leading-none">Interactive Charts & Heatmaps</p>
                        </div>
                     </div>
                     <Download size={14} className="text-white/20 group-hover:text-white transition-colors" />
                  </div>

                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center group hover:bg-white/10 transition-all cursor-pointer">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-orange-600 border border-orange-500 flex items-center justify-center text-white">
                           <PieChart size={20} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-white uppercase tracking-tight leading-none mb-1">Raw Dataset</p>
                           <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest leading-none">CSV/JSON Export Logic</p>
                        </div>
                     </div>
                     <Download size={14} className="text-white/20 group-hover:text-white transition-colors" />
                  </div>
               </div>
               
               <div className="pt-8 border-t border-white/10">
                  <div className="flex items-center gap-3">
                     <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                     <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Global Analytics Data Stream Active</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default FacilityReportsView;
