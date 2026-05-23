import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useSurveillanceStore } from '../../store/surveillanceStore';
import CameraFeed from '../../components/features/cctv/CameraFeed';
import KPICard from '../../components/shared/KPICard';
import { Video, Shield, AlertCircle, Activity, Camera, Maximize2 } from 'lucide-react';

const CCTVDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { cameras, alerts } = useSurveillanceStore();

  const metrics = [
    { label: 'Active Streams', value: cameras.filter(c => c.operationalStatus === 'online').length, subValue: `of ${cameras.length}`, icon: Video, variant: 'blue' as const },
    { label: 'Network Health', value: 99.4, unit: '%', icon: Activity, variant: 'emerald' as const },
    { label: 'Incident Triggers', value: alerts.length, subValue: 'Last 24h', icon: Shield, variant: 'purple' as const },
    { label: 'System Alerts', value: cameras.filter(c => c.operationalStatus !== 'online').length, icon: AlertCircle, variant: 'red' as const },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Surveillance Hub</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Enterprise visual intelligence & AI incident detection grid</p>
        </div>
        <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-slate-900/10">
           <Maximize2 size={14} /> Full Grid View
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <KPICard key={i} {...m} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cameras.slice(0, 6).map(camera => (
          <div key={camera.id} className="group relative bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden aspect-video">
            <CameraFeed camera={camera} />
            <div className="absolute top-4 left-4 z-10">
               <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                  <Camera size={12} className="text-blue-400" />
                  <span className="text-[9px] font-black text-white uppercase tracking-widest">{camera.cameraCode}</span>
               </div>
            </div>
            <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="p-2 bg-white rounded-lg text-slate-900 shadow-2xl">
                  <Maximize2 size={14} />
               </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-6">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-6">Surveillance Alerts</h2>
        <div className="space-y-4">
          {alerts.map(alert => (
            <div key={alert.id} className="flex items-start gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
               <div className={`p-2 rounded-xl bg-red-100 text-red-600`}>
                  <AlertCircle size={18} />
               </div>
               <div className="flex-1">
                  <div className="flex justify-between items-start">
                     <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{alert.type}</p>
                     <span className="text-[9px] font-bold text-slate-400 tabular-nums">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{alert.message}</p>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CCTVDashboard;
