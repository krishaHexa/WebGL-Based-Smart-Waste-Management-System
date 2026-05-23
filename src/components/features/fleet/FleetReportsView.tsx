import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar, 
  MapPin, 
  Truck, 
  User, 
  CheckCircle2,
  ChevronRight,
  Printer,
  Share2,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import KPICard from '@/components/shared/KPICard';

type ReportType = 'utilization' | 'fuel' | 'performance' | 'driver' | 'maintenance' | 'delay';

const FleetReportsView: React.FC = () => {
  const [activeReport, setActiveReport] = useState<ReportType>('utilization');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    { id: 'utilization', label: 'Fleet Utilization', description: 'Operational uptime & asset loading' },
    { id: 'fuel', label: 'Fuel Consumption', description: 'Thermal efficiency & distance delta' },
    { id: 'performance', label: 'Route Performance', description: 'SLA compliance & vector optimization' },
    { id: 'driver', label: 'Driver Activity', description: 'Shift logs & behavioral analytics' },
    { id: 'maintenance', label: 'Maintenance History', description: 'Component lifecycle & fault logs' },
    { id: 'delay', label: 'Delayed Route Report', description: 'Root cause analysis for bottlenecks' },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 1000);
  };

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar Selector */}
      <div className="w-80 border-r border-slate-200 bg-white flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-100">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Operational Reports</h3>
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Select report template</p>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-1">
           {reportTypes.map(r => (
             <button
               key={r.id}
               onClick={() => setActiveReport(r.id as ReportType)}
               className={cn(
                 "w-full p-4 rounded-2xl flex items-start gap-4 transition-all text-left group",
                 activeReport === r.id ? "bg-blue-600 text-white shadow-xl" : "hover:bg-slate-50 text-slate-500"
               )}
             >
                <div className={cn(
                   "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors",
                   activeReport === r.id ? "bg-white/20 border-white/20 text-white" : "bg-slate-50 border-slate-100 text-slate-400 group-hover:border-blue-600/30"
                )}>
                   <FileText size={16} />
                </div>
                <div className="flex-1 min-w-0">
                   <p className={cn("text-xs font-black uppercase tracking-tight", activeReport === r.id ? "text-white" : "text-slate-900")}>{r.label}</p>
                   <p className={cn("text-[9px] font-bold mt-0.5 tracking-tight line-clamp-1", activeReport === r.id ? "text-blue-100" : "text-slate-400")}>{r.description}</p>
                </div>
                <ChevronRight size={14} className={cn("mt-1 shrink-0", activeReport === r.id ? "text-white" : "text-slate-300")} />
             </button>
           ))}
        </div>
      </div>

      {/* Report Preview Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-8 bg-slate-50">
        <div className="max-w-5xl mx-auto space-y-8">
           {/* Top Bar / Filters */}
           <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 cursor-pointer hover:bg-slate-100 transition-all">
                    <Calendar size={14} />
                    <span>Last 30 Days</span>
                 </div>
                 <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 cursor-pointer hover:bg-slate-100 transition-all">
                    <MapPin size={14} />
                    <span>All Regions</span>
                 </div>
                 <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 cursor-pointer hover:bg-slate-100 transition-all">
                    <Filter size={14} />
                    <span>More Filters</span>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <button onClick={handleGenerate} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">Run Analysis</button>
                 <div className="w-px h-6 bg-slate-200 mx-2" />
                 <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-600/30 transition-all"><Download size={16} /></button>
                 <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-600/30 transition-all"><Printer size={16} /></button>
                 <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-600/30 transition-all"><Share2 size={16} /></button>
              </div>
           </div>

           {/* Report Content */}
           <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl p-12 relative overflow-hidden">
              {isGenerating ? (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                   <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                   <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Aggregating Global Telemetry...</p>
                </div>
              ) : null}

              {/* Header */}
              <div className="flex justify-between items-start mb-12">
                 <div>
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                          <FileText size={20} />
                       </div>
                       <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight tracking-tighter">{activeReport.replace('_', ' ')} Report</h2>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <span>Ref: AUDIT-2024-05-14</span>
                       <span className="w-1 h-1 bg-slate-300 rounded-full" />
                       <span>System Generated</span>
                       <span className="w-1 h-1 bg-slate-300 rounded-full" />
                       <span>Security Cleared</span>
                    </div>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-slate-900 uppercase">KSA Smart Waste Platform</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 text-right">Operational Intelligence Unit</span>
                 </div>
              </div>

              {/* Summary KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                 <ReportKPI label="Operational Rank" value="A+" sub="Top 5% Sector" />
                 <ReportKPI label="Sync Integrity" value="99.2%" sub="Zero Leakage" />
                 <ReportKPI label="Efficiency Gain" value="+14.2%" sub="vs Prev Month" />
                 <ReportKPI label="Cost Delta" value="-8.4%" sub="Energy Savings" />
              </div>

              {/* Report Visuals Component */}
              <div className="space-y-12">
                 {activeReport === 'utilization' && <UtilizationReportContent />}
                 {activeReport === 'fuel' && <FuelReportContent />}
                 {activeReport === 'performance' && <PerformanceReportContent />}
                 {activeReport === 'driver' && <DriverReportContent />}
                 {activeReport === 'maintenance' && <MaintenanceReportContent />}
                 {activeReport === 'delay' && <DelayReportContent />}
              </div>

              {/* Footer Stamp */}
              <div className="mt-16 pt-8 border-t border-slate-100 flex justify-between items-end opacity-50">
                 <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Authorized by AI Compliance Engine</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Timestamp: 2024-05-14T09:14:00Z</p>
                 </div>
                 <div className="flex gap-2">
                    <div className="w-8 h-8 rounded bg-slate-100" />
                    <div className="w-8 h-8 rounded bg-slate-100" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ReportKPI: React.FC<{ label: string, value: string, sub: string }> = ({ label, value, sub }) => (
  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{label}</p>
     <p className="text-2xl font-black text-slate-900 leading-none mb-1">{value}</p>
     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">{sub}</p>
  </div>
);

// Report Content Modules
const UtilizationReportContent = () => {
  const data = [
    { name: 'Mon', active: 94, idle: 6 },
    { name: 'Tue', active: 88, idle: 12 },
    { name: 'Wed', active: 92, idle: 8 },
    { name: 'Thu', active: 85, idle: 15 },
    { name: 'Fri', active: 96, idle: 4 },
    { name: 'Sat', active: 78, idle: 22 },
    { name: 'Sun', active: 65, idle: 35 },
  ];

  return (
    <div className="space-y-8">
       <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
             <BarChart data={data} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="active" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="idle" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
             </BarChart>
          </ResponsiveContainer>
       </div>
       <div className="grid grid-cols-2 gap-8">
          <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
             <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Operational Peak Metrics</h4>
             <p className="text-xs text-slate-500 leading-relaxed font-medium">Fleet reached maximum utilization on Friday at 09:00 AM, maintaining an average load factor of 92%. Weekend utilization shows a significant drop-off, suggesting maintenance scheduling windows.</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
             <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Asset Recommendation</h4>
             <div className="space-y-2">
                <RecommendationItem icon={<TrendingUp size={12}/>} text="Optimize Sunday maintenance" />
                <RecommendationItem icon={<Activity size={12}/>} text="Balance mid-week load delta" />
             </div>
          </div>
       </div>
    </div>
  );
};

const FuelReportContent = () => {
  const data = [
    { time: 'Week 1', consumption: 4200, optimized: 3800 },
    { time: 'Week 2', consumption: 4500, optimized: 3600 },
    { time: 'Week 3', consumption: 4100, optimized: 3400 },
    { time: 'Week 4', consumption: 3900, optimized: 3200 },
  ];

  return (
    <div className="space-y-8">
       <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
             <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} />
                <Tooltip contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="consumption" stroke="#f59e0b" strokeWidth={4} dot={{r: 6, fill: '#f59e0b', strokeWidth: 0}} />
                <Line type="monotone" dataKey="optimized" stroke="#10b981" strokeWidth={4} strokeDasharray="10 10" dot={false} />
             </LineChart>
          </ResponsiveContainer>
       </div>
       <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl">
          <div className="flex items-start gap-4">
             <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
             <div>
                <h4 className="text-sm font-black text-emerald-900 uppercase tracking-tight">Fuel Efficiency Optimization Success</h4>
                <p className="text-xs text-emerald-700 leading-relaxed mt-1 font-medium italic">Route vector synchronization has reduced overall fleet idling by 24.2 hours this month, resulting in a direct saving of approximately 1,200L of diesel compared to the baseline forecast.</p>
             </div>
          </div>
       </div>
    </div>
  );
};

const PerformanceReportContent = () => {
    const data = [
        { name: 'Completed', value: 84 },
        { name: 'Delayed', value: 12 },
        { name: 'Cancelled', value: 4 },
    ];
    const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} innerRadius={80} outerRadius={120} paddingAngle={8} dataKey="value">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="space-y-6">
                <div>
                   <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-4">SLA Breakdown</h4>
                   <div className="space-y-3">
                      {data.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                           <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}} />
                              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{item.name}</span>
                           </div>
                           <span className="text-xs font-black text-slate-900">{item.value}%</span>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                   <p className="text-[9px] font-black text-blue-900 uppercase tracking-widest leading-relaxed">System optimization successfully mitigated 4 potential delay incidents by rerouting active assets.</p>
                </div>
            </div>
        </div>
    );
};

const DriverReportContent = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DriverCard name="Ahmed Al-Farsi" shifts={22} safety={98} rating={4.9} />
            <DriverCard name="Khalid Mansour" shifts={20} safety={95} rating={4.8} />
            <DriverCard name="Omar Ziad" shifts={24} safety={92} rating={4.7} />
            <DriverCard name="Youssef Tariq" shifts={18} safety={99} rating={4.9} />
        </div>
    </div>
);

const DriverCard = ({ name, shifts, safety, rating }: any) => (
    <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
            <User size={24} />
        </div>
        <div className="flex-1">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{name}</h4>
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Shifts</span>
                   <span className="text-[11px] font-black text-slate-900">{shifts}</span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Safety</span>
                   <span className="text-[11px] font-black text-emerald-500">{safety}%</span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Rating</span>
                   <span className="text-[11px] font-black text-blue-600">{rating}</span>
                </div>
            </div>
        </div>
    </div>
);

const MaintenanceReportContent = () => {
    const data = [
        { name: 'Hydraulics', value: 45 },
        { name: 'Engine', value: 25 },
        { name: 'Tires', value: 15 },
        { name: 'Electronics', value: 10 },
        { name: 'Filters', value: 5 },
    ];
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const DelayReportContent = () => (
    <div className="p-8 bg-slate-900 rounded-[2rem] text-white">
        <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Activity size={24} className="text-blue-400" />
            </div>
            <div>
                <h4 className="text-xl font-black uppercase tracking-tight">Bottleneck Identification</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Sector Alpha-9 Delay Map</p>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">Traffic congestion at Facility Riyadh-West contributes to 64% of documented delays. Average turnaround time has increased by 8 minutes per vehicle due to queuing inefficiencies.</p>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[64%]" />
                </div>
            </div>
            <div className="space-y-4">
                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recommended Corrective Measure</h5>
                <p className="text-xs text-blue-400 font-bold uppercase tracking-tight leading-relaxed italic">Redirect non-priority fleet units to Riyadh-South Facility during peak hours (09:00 - 11:00).</p>
            </div>
        </div>
    </div>
);

const RecommendationItem = ({ icon, text }: any) => (
  <div className="flex items-center gap-2">
     <div className="text-blue-600">{icon}</div>
     <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{text}</span>
  </div>
);

export default FleetReportsView;
