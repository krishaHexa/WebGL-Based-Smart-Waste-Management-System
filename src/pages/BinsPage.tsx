import React, { useMemo } from 'react';
import { useBinStore } from '@/store/binStore';
import DigitalTwinView from '@/components/visualization/DigitalTwinView';
import BinDetailPanel from '@/components/features/bins/BinDetailPanel';
import { Trash2, AlertCircle, TrendingUp, CheckCircle, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChartSkeleton, WidgetSkeleton } from '@/components/shared/Skeleton';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';

const BinsPage: React.FC = () => {
  const { bins, filters, setFilters } = useBinStore();
  const isInitialLoad = bins.length === 0;
  
  const overflowBins = bins.filter(b => b.fillLevel > 90);
  const avgFill = bins.reduce((acc, b) => acc + b.fillLevel, 0) / (bins.length || 1);

  const wasteTypeData = useMemo(() => {
    const types: any = {};
    bins.forEach(b => {
      types[b.wasteType] = (types[b.wasteType] || 0) + 1;
    });
    return Object.entries(types).map(([name, value]) => ({ name, value }));
  }, [bins]);

  const COLORS = ['#22d3ee', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="relative flex flex-col h-full bg-slate-950 overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
        <DigitalTwinView />
      </div>

      <div className="relative z-10 p-4 sm:p-6 flex flex-col h-full pointer-events-none overflow-y-auto no-scrollbar items-center lg:items-stretch">
        {/* Header HUD */}
        <div className="flex flex-col lg:flex-row justify-between items-center sm:items-stretch lg:items-start gap-4 sm:gap-6 w-full">
          <div className="glass-panel p-4 rounded-xl border-l-4 border-l-purple-500 backdrop-blur-xl pointer-events-auto shrink-0 w-full sm:w-auto text-center sm:text-left">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white mb-1">Bin Network Intelligence</h1>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium">City-wide sensor mesh monitoring</p>
          </div>

          <div className="flex gap-3 sm:gap-4 pointer-events-auto overflow-x-auto no-scrollbar w-full sm:w-auto pb-2 sm:pb-0">
            {isInitialLoad ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-16 sm:h-20 bg-slate-900/40 rounded-xl border border-slate-800 animate-pulse flex-1 min-w-[120px]" />
                ))
            ) : (
                <>
                    <div className="glass-panel px-4 sm:px-6 py-3 rounded-xl border-slate-800 min-w-[120px] sm:min-w-[140px] flex-1">
                        <div className="flex items-center gap-2 sm:gap-3 mb-1">
                            <Trash2 size={14} className="text-slate-400" />
                            <span className="text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">Active</span>
                        </div>
                        <span className="text-xl sm:text-2xl font-bold text-white tracking-widest">{bins.length}</span>
                    </div>
                    <div className="glass-panel px-4 sm:px-6 py-3 rounded-xl border-slate-800 min-w-[120px] sm:min-w-[140px] flex-1">
                        <div className="flex items-center gap-2 sm:gap-3 mb-1">
                            <AlertCircle size={14} className="text-red-400" />
                            <span className="text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">Overflow</span>
                        </div>
                        <span className="text-xl sm:text-2xl font-bold text-red-500 tracking-widest">{overflowBins.length}</span>
                    </div>
                    <div className="glass-panel px-4 sm:px-6 py-3 rounded-xl border-slate-800 min-w-[120px] sm:min-w-[140px] flex-1">
                        <div className="flex items-center gap-2 sm:gap-3 mb-1">
                            <TrendingUp size={14} className="text-amber-400" />
                            <span className="text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">Avg Fill</span>
                        </div>
                        <span className="text-xl sm:text-2xl font-bold text-amber-500 tracking-widest">{Math.round(avgFill)}%</span>
                    </div>
                </>
            )}
          </div>
        </div>

        {/* Analytics & Search (Left) */}
        <div className="mt-4 sm:mt-8 flex flex-col gap-4 w-full sm:w-80 pointer-events-auto shrink-0">
            {/* Search & Filter */}
            <div className="glass-panel p-3 sm:p-4 rounded-xl border-slate-800">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input 
                        type="text" 
                        placeholder="Filter by code or location..." 
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-lg py-2 pl-9 pr-3 text-[10px] focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-slate-600 font-medium"
                        value={filters.search}
                        onChange={(e) => setFilters({ search: e.target.value })}
                    />
                </div>
                <div className="mt-2 flex gap-1 flex-wrap">
                   {['all', 'general', 'recyclable', 'hazardous'].map(type => (
                       <button 
                        key={type}
                        onClick={() => setFilters({ wasteType: type })}
                        className={cn(
                            "px-2 sm:px-3 py-1 rounded text-[8px] sm:text-[9px] font-bold uppercase transition-all",
                            filters.wasteType === type ? "bg-purple-600 text-white" : "bg-slate-900 text-slate-500 hover:bg-slate-800"
                        )}
                       >
                           {type === 'all' ? 'All' : type}
                       </button>
                   ))}
                </div>
            </div>

            {/* Waste Type Dist */}
            {isInitialLoad ? (
                <ChartSkeleton />
            ) : (
                <div className="glass-panel p-4 rounded-xl border-slate-800 h-60 sm:h-64 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                        <Filter size={14} className="text-purple-400" />
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-200">Waste Distribution</h3>
                    </div>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={wasteTypeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={35}
                                    outerRadius={55}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {wasteTypeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '10px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-1 mt-2">
                        {wasteTypeData.map((d, i) => (
                            <div key={d.name} className="flex items-center gap-1.5 text-[8px] sm:text-[9px] text-slate-400 truncate">
                                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                <span className="capitalize truncate">{d.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* Selected Bin Panel */}
        <div className="w-full">
          <BinDetailPanel />
        </div>

        {/* Real-time Health Monitor (Right/Bottom) */}
        <div className="mt-4 lg:mt-0 lg:absolute lg:right-6 lg:bottom-24 w-full lg:w-64 glass-panel p-4 rounded-xl border-slate-800 pointer-events-auto shrink-0 mb-4 sm:mb-0">
            <h3 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3 flex justify-between">
                System Health
                <span className="text-emerald-500 uppercase tracking-tighter">98.4% Normal</span>
            </h3>
            <div className="space-y-3">
                {[
                    { label: 'Comm. Latency', value: '42ms', color: 'bg-emerald-500' },
                    { label: 'Battery Avg', value: '72%', color: 'bg-cyan-500' },
                    { label: 'Mesh Topology', value: 'Stable', color: 'bg-emerald-500' },
                ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-black tracking-widest">{stat.label}</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] sm:text-[10px] font-mono text-slate-200">{stat.value}</span>
                            <div className={cn("w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]", stat.color)} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default BinsPage;
