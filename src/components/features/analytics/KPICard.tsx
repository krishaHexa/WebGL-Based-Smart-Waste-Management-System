import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number;
  icon: LucideIcon;
  color?: string;
  description?: string;
}

export const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  unit, 
  trend, 
  icon: Icon, 
  color = "text-blue-600",
  description 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col gap-3 group hover:border-blue-600/30 transition-all shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className={cn("p-2 rounded-lg bg-slate-50 border border-slate-100", color)}>
           <Icon size={16} />
        </div>
        {trend !== undefined && (
          <div className={cn(
            "text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-widest",
            trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
          )}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      
      <div>
        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">{title}</h4>
        <div className="flex items-baseline gap-1 font-black">
          <span className="text-xl text-slate-900 tracking-tighter leading-none">{value}</span>
          {unit && <span className="text-[9px] text-slate-400 uppercase tracking-widest leading-none">{unit}</span>}
        </div>
        {description && <p className="text-[9px] text-slate-400 mt-2 leading-relaxed font-bold uppercase tracking-tighter">{description}</p>}
      </div>
    </motion.div>
  );
};
