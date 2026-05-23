import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, style }) => {
  return (
    <div 
      className={cn("animate-pulse bg-slate-800/50 rounded", className)} 
      style={style}
    />
  );
};

export const WidgetSkeleton: React.FC = () => {
  return (
    <div className="glass-panel p-4 rounded-xl border-slate-800 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-10 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="glass-panel p-4 rounded-xl border-slate-800 h-64 flex flex-col gap-4">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-8" />
        </div>
      </div>
      <div className="flex-1 flex items-end gap-2">
         {Array.from({ length: 8 }).map((_, i) => (
           <Skeleton 
            key={i} 
            className="flex-1" 
            style={{ height: `${Math.random() * 60 + 20}%` }} 
           />
         ))}
      </div>
    </div>
  );
};

export const DetailPanelSkeleton: React.FC = () => {
  return (
    <div className=" glass-panel rounded-xl overflow-hidden shadow-2xl border-slate-800 w-80">
      <div className="p-4 border-b border-slate-800 flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-2 w-16" />
        </div>
      </div>
      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  );
};
