import React from 'react';
import { Globe2, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark' | 'glass';
}

const BrandLogo: React.FC<BrandLogoProps> = ({ 
  className, 
  size = 'md', 
  theme = 'dark' 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8 p-1.5',
    md: 'h-10 w-10 p-2',
    lg: 'h-14 w-14 p-3',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 28,
  };

  const themeClasses = {
    light: 'bg-white text-blue-600 shadow-sm border border-slate-100',
    dark: 'bg-slate-900 text-white shadow-xl',
    glass: 'bg-white/10 backdrop-blur-md text-white border border-white/20',
  };

  return (
    <div 
      className={cn(
        "relative flex items-center justify-center rounded-xl transition-all duration-300",
        sizeClasses[size],
        themeClasses[theme],
        className
      )}
    >
      <Globe2 size={iconSizes[size]} strokeWidth={2.5} className="relative z-10" />
      
      {/* Decorative enterprise elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 h-1/2 w-1/2 border-t border-r border-current rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 h-1/2 w-1/2 border-b border-l border-current rounded-bl-lg" />
      </div>

      {/* Subtle "Smart" indicator */}
      <div className={cn(
        "absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 bg-emerald-500",
        theme === 'dark' ? "border-slate-900" : "border-white"
      )}>
        <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
      </div>
    </div>
  );
};

export default BrandLogo;
