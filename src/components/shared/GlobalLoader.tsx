import React, { useEffect, useState } from 'react';
import { useLoadingStore } from '@/store/loadingStore';
import { useAuthStore } from '@/store/authStore';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, ShieldCheck, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import BrandLogo from './BrandLogo';

const GlobalLoader: React.FC = () => {
  const { isSystemReady, isMapReady, isSocketConnected, isTelemetryInitialized } = useLoadingStore();
  const { user } = useAuthStore();
  const [show, setShow] = useState(true);

  // Define if map is required based on role
  const needsMap = user?.role !== 'CITIZEN' && user?.role !== 'CCTV_OPERATOR';
  const ready = isSocketConnected && isTelemetryInitialized && (!needsMap || isMapReady);

  useEffect(() => {
    if (ready) {
      const timer = setTimeout(() => setShow(false), 800);
      return () => clearTimeout(timer);
    }
  }, [ready]);

  const steps = [
    { label: 'Map Engine Optimization', status: isMapReady, skip: !needsMap },
    { label: 'Operational Node Handshake', status: isSocketConnected },
    { label: 'Telemetry Stream Sync', status: isTelemetryInitialized },
  ].filter(s => !s.skip);

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center pointer-events-auto"
        >
          {/* Professional Clean Background */}
          <div className="absolute inset-0 overflow-hidden opacity-40 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-blue-50 to-transparent" />
            <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-blue-50 rounded-full blur-[100px]" />
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>
 
          <div className="relative flex flex-col items-center max-w-sm w-full px-8">
            {/* Logo area */}
            <div className="mb-10 relative">
               <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-xl shadow-blue-500/5">
                  <BrandLogo size="lg" theme="dark" />
               </div>
               <div className="absolute -top-1 -right-1">
                  <div className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
                  </div>
               </div>
            </div>
 
            <div className="text-center mb-8">
              <h1 className="text-xl font-black tracking-tight text-slate-950 mb-1 uppercase">KSA Smart Waste</h1>
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-[0.2em] leading-none mb-4">Management Platform</p>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">Initializing Operational Control Systems...</p>
            </div>
 
            <div className="w-full space-y-3 px-4">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center justify-between group py-1 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all duration-500",
                      step.status ? "bg-emerald-500" : "bg-slate-200"
                    )} />
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest transition-colors duration-500",
                      step.status ? "text-slate-700" : "text-slate-300"
                    )}>{step.label}</span>
                  </div>
                  {step.status ? (
                    <ShieldCheck size={14} className="text-emerald-500" />
                  ) : (
                    <Loader2 size={12} className="text-slate-300 animate-spin" />
                  )}
                </div>
              ))}
            </div>
 
            <div className="mt-10 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
               <motion.div 
                 className="h-full bg-blue-600"
                 initial={{ width: "0%" }}
                 animate={{ width: ready ? "100%" : "30%" }}
                 transition={{ duration: ready ? 0.3 : 8 }}
               />
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-3 opacity-40">
               <div className="h-px w-8 bg-slate-200" />
               <div className="flex items-center gap-1.5 text-[8px] text-slate-400 font-bold uppercase tracking-tight">
                  <Database size={8} />
                  <span>SECURE CONNECTED NODE v1.0.4</span>
               </div>
               <div className="h-px w-8 bg-slate-200" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalLoader;
