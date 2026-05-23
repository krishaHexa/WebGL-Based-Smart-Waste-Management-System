import React, { Suspense, lazy } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { useIncidentStore } from '@/store/incidentStore';
import { formatNumber } from '@/lib/utils';
import { useSettingsStore } from '@/store/settingsStore';
import { useMapStore } from '@/store/mapStore';
import AIRecommendations from '@/components/shared/AIRecommendations';
import KPICard from '@/components/shared/KPICard';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Database, 
  Bell, 
  Layers,
  X,
  PlayCircle,
  Zap,
  Activity,
  History,
  Info,
  ChevronRight,
  Filter,
  Settings,
  Users
} from 'lucide-react';
import RouteLoader from '@/components/shared/RouteLoader';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const DigitalTwinView = lazy(() => import('@/components/visualization/DigitalTwinView'));
const VehicleDetailPanel = lazy(() => import('@/components/features/fleet/VehicleDetailPanel'));
const BinDetailPanel = lazy(() => import('@/components/features/bins/BinDetailPanel'));

const DashboardPage: React.FC = () => {
  const metrics = useDashboardStore(state => state.metrics);
  const { incidents } = useIncidentStore();
  const { isRTL } = useSettingsStore();
  const { layers, toggleLayer } = useMapStore();
  const { t } = useTranslation();
  
  const activeIncidents = incidents.filter(i => i.status !== 'resolved');
  const [activeTab, setActiveTab] = React.useState('incidents');
  const [isQueueOpen, setIsQueueOpen] = React.useState(true);

  return (
    <div className="flex flex-col h-full bg-slate-50 p-4 sm:p-6 overflow-hidden font-sans text-slate-900">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
            <Zap className="text-blue-600" size={20} />
            Command Center
          </h1>
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 mt-0.5 uppercase tracking-[0.2em]">Live Smart Waste Lifecycle Management</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="hidden xs:flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm grow sm:grow-0">
             <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Fleet Sync</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-900 uppercase tabular-nums">98.2%</span>
                </div>
             </div>
             <div className="w-px h-6 bg-slate-100" />
             <div className="flex flex-col text-right">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Collected</span>
                <span className="text-[10px] font-black text-blue-600 uppercase tabular-nums">{formatNumber(metrics.totalWasteCollectedToday)} <span className="text-[8px] opacity-60">TONS</span></span>
             </div>
          </div>
          <button className="flex flex-1 sm:flex-none items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all font-black text-[10px] uppercase tracking-widest">
            <Activity size={14} />
            Operations
          </button>
        </div>
      </div>

      {/* Primary KPIs - Industrial Dense Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 2xl:grid-cols-10 gap-3 mb-6 shrink-0">
        <KPICard 
          label="Active Trucks" 
          value={metrics.activeTrucks} 
          subValue={`${metrics.trucksDelivering} Delivering`}
          variant="blue" 
          icon={Zap}
        />
        <KPICard 
          label="Bin Fill Goal" 
          value={metrics.collectionEfficiency} 
          unit="%"
          variant="emerald" 
          progress={metrics.collectionEfficiency}
          icon={CheckCircle2}
        />
        <KPICard 
          label="Queue Load" 
          value={metrics.facilityQueueLoad} 
          unit="%"
          variant="orange" 
          progress={metrics.facilityQueueLoad}
          icon={Clock}
        />
        <KPICard 
          label="Capacity" 
          value={metrics.facilityProcessingCapacity}
          unit="%"
          variant="indigo" 
          icon={Database}
        />
        <KPICard 
          label="Workforce" 
          value={metrics.activeWorkforceUnits} 
          variant="purple" 
          icon={Users}
        />
        
        {/* Extended Tactical KPIs */}
        <div className="contents lg:hidden 2xl:contents">
          <KPICard 
            label="Route Conflict" 
            value={metrics.routeOptimizationConflicts} 
            variant="red" 
            icon={AlertCircle}
          />
          <KPICard 
            label="Risk Zones" 
            value={metrics.overflowRiskZones} 
            variant="orange" 
            icon={Activity}
          />
          <KPICard 
            label="Env Alerts" 
            value={metrics.activeEnvironmentalAlerts} 
            variant="red" 
            icon={AlertCircle}
          />
          <KPICard 
            label="CCTV Alerts" 
            value={metrics.activeCCTVAlerts} 
            variant="amber" 
            icon={Bell}
          />
          <KPICard 
            label="Active Alert" 
            value={metrics.alertCount} 
            variant="red" 
            icon={Info}
          />
        </div>
      </div>

      {/* Main Content: Map + Details */}
      <div className="flex-1 flex flex-col xl:flex-row gap-4 sm:gap-6 min-h-0 overflow-hidden">
        {/* Map Viewport Area */}
        <div className="flex-1 flex flex-col relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-white min-h-[300px]">
          <div className="flex-1 relative">
            <Suspense fallback={<RouteLoader />}>
              <DigitalTwinView theme="light" />
            </Suspense>

            {/* Asset Detail Panels (Overlays) */}
            <Suspense fallback={null}>
               <VehicleDetailPanel />
               <BinDetailPanel />
            </Suspense>

            {/* Map Interaction Controls - Responsive Layout */}
            <div className={cn(
              "absolute top-4 sm:top-6 z-20 flex flex-col gap-4 max-w-[calc(100%-2rem)]",
              isRTL ? "right-4 sm:right-6" : "left-4 sm:left-6"
            )}>
              {/* Layer Controls - Compact on mobile */}
              <div className="w-48 sm:w-56 bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl border border-slate-100 p-3 sm:p-5">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-[9px] sm:text-[10px] font-black text-slate-900 uppercase tracking-[0.15em] flex items-center gap-2">
                    <Layers size={14} className="text-blue-600" />
                    Layer Matrix
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:gap-3 max-h-[120px] sm:max-h-none overflow-y-auto no-scrollbar">
                  {[
                    { id: 'trucks', label: t('assets.vehicles', 'Fleet Vehicles'), icon: Zap },
                    { id: 'bins', label: t('assets.bins', 'Smart Bins'), icon: Database },
                    { id: 'facilities', label: t('navigation.facilities', 'Facilities'), icon: CheckCircle2 },
                    { id: 'incidents', label: t('navigation.incidents', 'Incidents'), icon: AlertCircle },
                    { id: 'cctv', label: t('navigation.cctv', 'CCTV Network'), icon: Activity },
                    { id: 'workforce', label: 'Workforce Units', icon: Users },
                  ].map(option => (
                    <label key={option.id} className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={cn(
                          "p-1 rounded sm:p-1.5 rounded-lg transition-colors border",
                          layers[option.id as keyof typeof layers] ? "bg-blue-600 text-white border-blue-500" : "bg-slate-50 text-slate-400 border-slate-100"
                        )}>
                          <option.icon size={10} className="sm:size-[11px]" />
                        </div>
                        <span className={cn(
                          "text-[9px] sm:text-[10px] font-bold transition-colors uppercase tracking-tight",
                          layers[option.id as keyof typeof layers] ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
                        )}>
                          {option.label}
                        </span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={layers[option.id as keyof typeof layers]} 
                        onChange={() => toggleLayer(option.id as keyof typeof layers)}
                        className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded border-slate-200 bg-slate-50 text-blue-600 focus:ring-blue-600/5 transition-all" 
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Map Timeline/Replay Bar - Hide or compact on mobile */}
          <div className="h-14 sm:h-16 bg-white border-t border-slate-100 px-4 sm:px-8 flex items-center gap-4 sm:gap-8 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <div className="flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 font-black text-[8px] sm:text-[9px] uppercase tracking-widest shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden xs:inline">Live Monitoring</span>
                <span className="xs:hidden">Live</span>
              </div>
            </div>
            
            <div className="flex-1 min-w-[120px] space-y-1 sm:space-y-2 pt-1">
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={cn("h-full w-2/3 bg-blue-600 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.2)]", isRTL ? "right-0" : "left-0")} />
              </div>
              <div className="flex justify-between text-[8px] sm:text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">
                <span>06:00</span>
                <span className="text-slate-600 font-black tabular-nums whitespace-nowrap">Current: 14:23</span>
                <span>23:59</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                <div className="text-right whitespace-nowrap hidden sm:block">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Operational Tempo</p>
                  <p className="text-[10px] font-black text-slate-600 uppercase mt-0.5">Real-time Normal</p>
                </div>
                <button className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-lg sm:rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-all hover:bg-slate-50 shadow-sm">
                   <Settings size={14} className="sm:size-[16px]" />
                </button>
            </div>
          </div>
        </div>

        {/* Detail Panel - Drawer style on tablets, stack on mobile */}
        <AnimatePresence>
        {isQueueOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full xl:w-80 flex flex-col gap-4 sm:gap-6 min-h-[300px] xl:h-full shrink-0"
          >
            <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Incident Queue</h3>
                <button 
                  onClick={() => setIsQueueOpen(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-all"
                >
                  <X size={14} />
                </button>
              </div>
            
            <div className="flex border-b border-slate-100 px-2 bg-white">
              {[
                { id: 'incidents', label: 'Incidents', count: activeIncidents.length },
                { id: 'tasks', label: 'Units', count: 12 },
                { id: 'ai', label: 'AI Advisories', count: 2 }
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 py-3.5 text-[9px] font-black text-center border-b-2 transition-all uppercase tracking-widest",
                    activeTab === tab.id ? "border-blue-600 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"
                  )}
                >
                  <div className="flex items-center justify-center gap-2">
                    {tab.label}
                    {tab.count > 0 && (
                      <span className={cn(
                        "px-1.5 py-0.5 rounded text-[8px] font-black tracking-widest",
                        activeTab === tab.id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                      )}>
                        {tab.count}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar bg-slate-50/30">
              {activeTab === 'incidents' && activeIncidents.map(inc => (
                <div key={inc.id} className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-blue-600/30 border-l-4" style={{ borderLeftColor: inc.severity === 'critical' ? '#ef4444' : '#f59e0b' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                      "text-[8px] font-black uppercase px-2 py-0.5 rounded shadow-sm border",
                      inc.severity === 'critical' ? "bg-red-50 text-red-600 border-red-100" : "bg-amber-50 text-amber-600 border-amber-100"
                    )}>
                      {inc.severity}
                    </span>
                    <span className="text-[9px] font-black text-slate-300 uppercase">#{inc.id.split('-')[0]}</span>
                  </div>
                  <h4 className="text-[11px] font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{inc.incidentType}</h4>
                  <p className="text-[10px] text-slate-500 mt-2 font-bold leading-relaxed">{inc.description}</p>
                  
                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                           <Activity size={10} />
                        </div>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Pending Node</span>
                     </div>
                     <ChevronRight size={12} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}

              {activeTab === 'tasks' && (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="p-3.5 rounded-2xl border border-slate-100 bg-white hover:border-blue-600/20 transition-all group flex items-center gap-3 cursor-pointer shadow-sm">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm border border-blue-100">
                        <Users size={16} />
                      </div>
                      <div className="flex-1">
                         <div className="flex items-center justify-between">
                           <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">Team Alpha-{i}</span>
                           <div className="h-1 w-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.2)]" />
                         </div>
                         <div className="text-[9px] font-black text-slate-400 mt-0.5 flex items-center gap-2 uppercase tracking-widest">
                            <span>S-{i+2}</span>
                            <span className="h-0.5 w-0.5 rounded-full bg-slate-200" />
                            <span>88% CAP</span>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'ai' && (
                <div className="flex-1 overflow-y-auto no-scrollbar -mx-4 -mt-3">
                   <AIRecommendations />
                </div>
              )}
            </div>
            
            {activeTab !== 'ai' && (
              <button className="m-4 p-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                 Operational Command Wall
              </button>
            )}
          </div>
        </motion.div>
        )}
        </AnimatePresence>

        {!isQueueOpen && (
          <button 
            onClick={() => setIsQueueOpen(true)}
            className="absolute right-10 top-1/2 -translate-y-1/2 z-30 w-10 h-32 bg-white border border-slate-200 rounded-l-3xl shadow-2xl flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all group"
          >
             <div className="flex flex-col items-center gap-3">
                <ChevronRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                <div className="[writing-mode:vertical-lr] text-[9px] font-black tracking-[0.3em] uppercase text-slate-400 group-hover:text-blue-600">Events</div>
             </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
