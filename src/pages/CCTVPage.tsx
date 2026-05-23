import React, { useState, useMemo } from 'react';
import { useSurveillanceStore } from '@/store/surveillanceStore';
import { 
  Camera, 
  Search, 
  Grid, 
  Maximize2, 
  ChevronRight,
  Settings2, 
  AlertCircle, 
  Layout, 
  Video,
  Monitor,
  Activity,
  Zap,
  Globe,
  Radio,
  LayoutGrid
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CameraFeed from '@/components/features/cctv/CameraFeed';
import KPICard from '@/components/shared/KPICard';
import CCTVInspectModal from '@/components/features/cctv/CCTVInspectModal';
import { SurveillanceCamera } from '@/types';
import { AnimatePresence } from 'motion/react';

const CCTVPage: React.FC = () => {
  const { cameras, selectedCameraId, selectCamera } = useSurveillanceStore();
  const [viewMode, setViewMode] = useState<'grid' | 'wall'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingCamera, setInspectingCamera] = useState<SurveillanceCamera | null>(null);

  const stats = useMemo(() => ({
    online: cameras.filter(c => c.operationalStatus === 'online').length,
    offline: cameras.filter(c => c.operationalStatus === 'offline').length,
    incidents: cameras.filter(c => c.incidentLinked).length
  }), [cameras]);

  const filteredCameras = useMemo(() => {
    return cameras.filter(c => 
      c.cameraName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.cameraCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.facilityZone.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [cameras, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden font-sans p-4 sm:p-6 text-slate-900">
      {/* Header HUD */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Visual Intelligence Network</h1>
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 mt-0.5 uppercase tracking-[0.2em] leading-none">Real-time edge analytics and multi-sector visual oversight</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
           <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm grow sm:grow-0">
             <button 
               onClick={() => setViewMode('grid')}
               className={cn(
                 "flex-1 sm:flex-none p-2 rounded-lg transition-all flex items-center justify-center",
                 viewMode === 'grid' ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-400 hover:text-slate-600"
               )}
             >
               <Grid size={16} />
             </button>
             <button 
               onClick={() => setViewMode('wall')}
               className={cn(
                 "flex-1 sm:flex-none p-2 rounded-lg transition-all flex items-center justify-center",
                 viewMode === 'wall' ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-400 hover:text-slate-600"
               )}
             >
               <Layout size={16} />
             </button>
           </div>
           <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all font-black text-[10px] uppercase tracking-widest grow sm:grow-0">
              <Zap size={14} />
              AI Recognition
           </button>
        </div>
      </div>

      {/* KPI Row - Responsive Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 shrink-0">
         <KPICard label="Stream Health" value={99.2} unit="%" variant="emerald" progress={99} icon={Activity} />
         <KPICard label="Active Nodes" value={stats.online} subValue={`${stats.offline} offline`} variant="blue" icon={Camera} />
         <div className="hidden md:block">
           <KPICard label="Detection Alarms" value={stats.incidents} subValue="Last 24h" variant="red" icon={AlertCircle} />
         </div>
         <div className="hidden md:block">
           <KPICard label="Network Load" value="4.2" unit="Gbps" variant="purple" icon={Globe} />
         </div>
      </div>

      <div className="flex-1 flex flex-col xl:flex-row gap-4 sm:gap-6 min-h-0 overflow-y-auto lg:overflow-hidden pb-4 sm:pb-0">
        {/* Camera List Sidebar - Drawer style on tablets, list on desktop */}
        <div className="w-full xl:w-80 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl flex flex-col overflow-hidden h-[300px] xl:h-full shrink-0">
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/30">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Identify camera node..." 
                  className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-[11px] font-bold focus:ring-4 focus:ring-blue-600/5 outline-none transition-all placeholder:text-slate-300"
                />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 no-scrollbar">
             {filteredCameras.map(cam => (
               <button
                 key={cam.id}
                 onClick={() => selectCamera(cam.id)}
                 className={cn(
                   "w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all text-left group relative border",
                   selectedCameraId === cam.id ? "bg-blue-600 text-white border-blue-500 shadow-lg" : "hover:bg-slate-50 border border-slate-50 bg-white shadow-sm"
                 )}
               >
                 <div className={cn(
                   "w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center relative border shrink-0",
                   selectedCameraId === cam.id ? "bg-white/20 border-white/20" : "bg-slate-50 text-slate-400 border-slate-100"
                 )}>
                   <Video size={16} className="sm:size-[18px]" />
                   {cam.operationalStatus === 'offline' && (
                     <div className="absolute -top-1 -right-1 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-red-500 border-2 border-white rounded-full shadow-sm" />
                   )}
                   {cam.incidentLinked && (
                     <div className="absolute -bottom-1 -right-1 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-amber-500 border-2 border-white rounded-full shadow-sm" />
                   )}
                 </div>
                 <div className="flex-1 min-w-0 font-black">
                    <p className={cn(
                      "text-[10px] sm:text-[11px] truncate uppercase tracking-tight leading-none",
                      selectedCameraId === cam.id ? "text-white" : "text-slate-900"
                    )}>
                      {cam.cameraCode}
                    </p>
                    <p className={cn(
                      "text-[8px] sm:text-[9px] mt-1 truncate tracking-widest uppercase leading-none",
                      selectedCameraId === cam.id ? "text-blue-100" : "text-slate-400"
                    )}>
                      {cam.facilityZone}
                    </p>
                 </div>
                 <ChevronRight size={14} className={cn(
                   "transition-all",
                   selectedCameraId === cam.id ? "text-white transform translate-x-1" : "text-slate-300 opacity-0 group-hover:opacity-100"
                 )} />
               </button>
             ))}
          </div>
          <div className="p-4 sm:p-5 bg-slate-900 text-blue-200">
             <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em]">
               <span className="flex items-center gap-2 font-black"><Radio size={12} className="text-blue-500 animate-pulse" /> Signal Sync</span>
               <span className="text-emerald-500">Live</span>
             </div>
          </div>
        </div>

        {/* Video Walls - Adapting Grid */}
        <div className="flex-1 bg-white rounded-2xl sm:rounded-[2rem] shadow-xl overflow-hidden flex flex-col relative border border-slate-200 min-h-[400px]">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/20 backdrop-blur-md">
            <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
               <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 font-black text-[8px] sm:text-[9px] uppercase tracking-widest leading-none shrink-0">
                 <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-blue-600 animate-pulse" />
                 Grid Display
               </div>
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none truncate hidden sm:block">Global Sector Oversight // Visual Matrix Ready</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-all hover:text-slate-900">
                <Maximize2 size={16} />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-all hover:text-slate-900">
                <Settings2 size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 overflow-y-auto no-scrollbar bg-slate-50/30">
             {cameras.slice(0, 9).map(cam => (
               <div key={cam.id} className="relative group rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 bg-white transition-all hover:ring-4 hover:ring-blue-600/10 h-36 sm:h-40 shadow-sm cursor-pointer">
                 <CameraFeed 
                    camera={cam} 
                    isSelected={selectedCameraId === cam.id}
                    onSelect={() => {
                      selectCamera(cam.id);
                      setInspectingCamera(cam);
                    }}
                    variant="compact"
                 />
                 {/* Overlay Info */}
                 <div className="absolute top-2 left-2 z-10">
                    <div className="bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-2">
                       <span className={cn(
                         "w-1 h-1 rounded-full",
                         cam.operationalStatus === 'online' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)]"
                       )} />
                       <span className="text-[8px] font-black text-white uppercase tracking-widest">{cam.cameraCode}</span>
                    </div>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Right Alert Panel */}
        <div className="w-72 flex flex-col gap-6">
          <div className="flex-1 bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-xl text-amber-600 border border-amber-100 shadow-sm">
                <AlertCircle size={18} />
              </div>
              <div>
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Detection Alerts</h3>
                <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Live AI Analysis Feed</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
              {cameras.filter(c => c.incidentLinked).map(cam => (
                <div key={cam.id} className="p-4 rounded-2xl border border-amber-50 bg-amber-50/20 flex flex-col gap-3 group hover:bg-amber-50/40 transition-all cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest">{cam.cameraCode}</span>
                    <span className="text-[8px] font-black text-amber-400 font-mono">LIVE</span>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-900 uppercase leading-none">Anomaly Detected</h4>
                    <p className="text-[9px] text-slate-500 mt-1.5 font-bold leading-relaxed uppercase tracking-tighter">AI engine detected unauthorized asset movement in zone {cam.facilityZone}.</p>
                  </div>
                  <button className="w-full py-2 bg-white border border-amber-200 rounded-xl text-[9px] font-black text-amber-600 uppercase tracking-widest hover:bg-amber-600 hover:text-white transition-all shadow-sm">
                    Review Metadata
                  </button>
                </div>
              ))}
              {cameras.filter(c => c.incidentLinked).length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-40">
                  <Monitor size={32} className="text-slate-200 mb-4" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">No visual threats detected</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-slate-50">
              <button className="w-full py-4 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
                Security Audit
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {inspectingCamera && (
          <CCTVInspectModal 
            camera={inspectingCamera} 
            onClose={() => setInspectingCamera(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CCTVPage;
