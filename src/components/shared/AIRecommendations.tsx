import React from 'react';
import { useAIAssistantStore } from '@/store/aiAssistantStore';
import { 
  Zap, 
  ChevronRight, 
  TrendingUp, 
  ShieldAlert, 
  ArrowRightCircle,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

const AIRecommendations: React.FC = () => {
  const { recommendations } = useAIAssistantStore();

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col h-full font-sans">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Zap size={18} />
          </div>
          <div>
            <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-tight leading-none">AI Control Room</h3>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5 leading-none">Real-time Operational Advisories</p>
          </div>
        </div>
        <div className="h-6 px-2.5 rounded-lg bg-blue-50 border border-blue-100 flex items-center gap-1.5">
           <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
           <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest leading-none">Live Sync</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
        {recommendations.map((rec) => (
          <motion.div 
            key={rec.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-white border border-slate-100 hover:border-blue-600/30 hover:shadow-lg transition-all group relative overflow-hidden"
          >
            {/* Priority Indicator */}
            <div className={cn(
              "absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[8px] font-black uppercase tracking-widest shadow-sm z-10",
              rec.priority === 'high' ? "bg-red-500 text-white" : "bg-blue-600 text-white"
            )}>
              {rec.priority}_PRIORITY
            </div>

            <div className="flex items-start gap-4 mb-4">
               <div className={cn(
                 "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border",
                 rec.type === 'optimization' ? "bg-purple-50 text-purple-600 border-purple-100" :
                 rec.type === 'risk' ? "bg-red-50 text-red-600 border-red-100" :
                 "bg-blue-50 text-blue-600 border-blue-100"
               )}>
                  {rec.type === 'optimization' && <TrendingUp size={18} />}
                  {rec.type === 'risk' && <ShieldAlert size={18} />}
                  {rec.type === 'efficiency' && <Lightbulb size={18} />}
               </div>
               <div className="flex flex-col pt-0.5">
                  <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-tight leading-none mb-1.5 pr-20">{rec.title}</h4>
                  <div className="flex items-center gap-2">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{rec.type}</span>
                     <div className="w-1 h-1 rounded-full bg-slate-200" />
                     <span className="text-[8px] font-black text-emerald-600 uppercase tracking-tighter">Impact: {rec.impact}</span>
                  </div>
               </div>
            </div>

            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed mb-5 bg-slate-50 p-4 rounded-xl border border-slate-100/50">
               {rec.description}
            </p>

            <div className="flex items-center justify-between">
               <span className="text-[8px] font-black text-slate-300 tabular-nums uppercase tracking-widest">
                  Recommendation ID: {rec.id.toUpperCase()}
               </span>
               <button className="flex items-center gap-2 text-[9px] font-black text-blue-600 uppercase tracking-widest group-hover:gap-3 transition-all">
                  Apply Advisory
                  <ArrowRightCircle size={14} />
               </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-100">
         <button className="w-full h-12 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
            <TrendingUp size={14} className="text-blue-400" />
            Strategic View
         </button>
      </div>
    </div>
  );
};

export default AIRecommendations;
