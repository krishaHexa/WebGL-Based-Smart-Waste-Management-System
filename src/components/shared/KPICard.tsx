import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';

interface KPICardProps {
  label: string;
  value: string | number;
  unit?: string;
  subValue?: string;
  icon?: LucideIcon;
  variant?: 'emerald' | 'red' | 'blue' | 'orange' | 'purple' | 'indigo' | 'amber';
  progress?: number;
}

const KPICard: React.FC<KPICardProps> = ({ 
  label, 
  value, 
  unit,
  subValue, 
  icon: Icon, 
  variant = 'blue',
  progress
}) => {
  const variantStyles = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'bg-emerald-100 text-emerald-600', bar: 'bg-emerald-500' },
    red: { bg: 'bg-red-500/5', text: 'text-red-600', icon: 'bg-red-100 text-red-600', bar: 'bg-red-500' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'bg-blue-100 text-blue-600', bar: 'bg-blue-500' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'bg-orange-100 text-orange-600', bar: 'bg-orange-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'bg-purple-100 text-purple-600', bar: 'bg-purple-500' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', icon: 'bg-indigo-100 text-indigo-600', bar: 'bg-indigo-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', icon: 'bg-amber-100 text-amber-600', bar: 'bg-amber-500' },
  };

  const style = variantStyles[variant];

  // Format value if it's a number
  const displayValue = typeof value === 'number' ? formatNumber(value) : value;
  const formattedValue = unit ? `${displayValue}${unit}` : displayValue;

  return (
    <div className="rounded-2xl p-4 bg-white border border-slate-200 shadow-sm flex flex-col justify-between h-[104px] hover:shadow-md hover:border-slate-300 transition-all group">
      <div className="flex justify-between items-start">
        <div className="space-y-0.5">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
          <div className="flex items-center gap-1.5 single-line">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">{formattedValue}</h3>
            {subValue && <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap">{subValue}</span>}
          </div>
        </div>
        {Icon && (
          <div className={cn("p-2 rounded-lg transition-all group-hover:scale-105 shadow-sm border border-transparent", style.icon)}>
            <Icon size={16} />
          </div>
        )}
      </div>

      <div className="mt-2">
        {progress !== undefined ? (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[8px] font-bold uppercase tracking-widest">
              <span className="text-slate-400">Optimization</span>
              <span className={style.text}>{progress}%</span>
            </div>
            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={cn("h-full rounded-full transition-all duration-1000", style.bar)} 
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <div className={cn("h-1 w-1 rounded-full animate-pulse", style.bar)} />
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Active Link</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPICard;
