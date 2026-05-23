import React, { useEffect } from 'react';
import { useLoadingStore } from '@/store/loadingStore';
import { Loader2 } from 'lucide-react';

const RouteLoader: React.FC = () => {
  const setRouteLoading = useLoadingStore(state => state.setRouteLoading);

  useEffect(() => {
    setRouteLoading(true);
    return () => setRouteLoading(false);
  }, [setRouteLoading]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-[2px] z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Loader2 className="text-cyan-500 animate-spin" size={40} />
          <div className="absolute inset-0 blur-xl bg-cyan-500/20 animate-pulse" />
        </div>
        <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Syncing Operational State</span>
            <span className="text-[8px] text-slate-600 font-mono mt-1">MODULE_LOAD_SEQUENCE_ONGOING</span>
        </div>
      </div>
    </div>
  );
};

export default RouteLoader;
