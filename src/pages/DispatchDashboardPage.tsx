import React from 'react';
import DigitalTwinView from '@/components/visualization/DigitalTwinView';
import DispatchTruckList from '@/components/features/dispatch/DispatchTruckList';
import DispatchIntelligence from '@/components/features/dispatch/DispatchIntelligence';
import DispatchKPIBar from '@/components/features/dispatch/DispatchKPIBar';
import DispatchAssignmentPanel from '@/components/features/dispatch/DispatchAssignmentPanel';
import { useAuthStore } from '@/store/authStore';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface DispatchDashboardPageProps {
  embedded?: boolean;
}

const DispatchDashboardPage: React.FC<DispatchDashboardPageProps> = ({ embedded }) => {
  const { user } = useAuthStore();
  
  // Role Guard - Only if not embedded (parent will handle auth)
  const isAuthorized = user && ['SUPER_ADMIN', 'DISPATCH_OPERATOR', 'FLEET_SUPERVISOR', 'FLEET_MANAGER'].includes(user.role);
  
  if (!isAuthorized && !embedded) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className={cn(
      "flex flex-col bg-slate-50 overflow-hidden font-sans",
      embedded ? "h-full" : "h-screen"
    )}>
      {/* Top KPI Bar */}
      <div className="z-30 shrink-0">
        <DispatchKPIBar />
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Column (22%): Operational Controls */}
        <motion.div 
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-[22%] min-w-[340px] max-w-[420px] flex flex-col bg-white border-r border-slate-100 z-20 shadow-2xl"
        >
          <div className="flex-[3] overflow-hidden border-b border-slate-100">
            <DispatchTruckList />
          </div>
          <div className="flex-[2] bg-slate-50/10 min-h-[350px]">
            <DispatchAssignmentPanel />
          </div>
        </motion.div>

        {/* Center Panel: Operational Map */}
        <div className="flex-1 relative bg-slate-100 overflow-hidden">
          <div className="absolute inset-0 z-0">
             <DigitalTwinView theme="light" />
          </div>
          
          <div className="absolute top-6 left-6 z-10 pointer-events-none">
             <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-[2rem] border border-slate-200 shadow-xl pointer-events-auto">
                <h1 className="text-[13px] font-black tracking-tight text-slate-900 uppercase leading-none">Operations Command</h1>
                <p className="text-[8px] font-black text-slate-400 mt-2 uppercase tracking-[0.3em] leading-none">Theater Logic // Zone 4 Central</p>
             </div>
          </div>

          <div className="absolute bottom-6 right-6 z-10 pointer-events-none">
             <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 pointer-events-auto border border-white/10">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-80">Live Telemetry Feed Active</span>
             </div>
          </div>
        </div>

        {/* Right Column (18-20%): Operational Intelligence */}
        <motion.div 
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-[18%] min-w-[280px] max-w-[360px] bg-white border-l border-slate-100 z-20 shadow-2xl overflow-hidden"
        >
          <DispatchIntelligence />
        </motion.div>
      </div>
    </div>
  );
};

export default DispatchDashboardPage;
