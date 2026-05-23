import React from 'react';
import OperationalMap from './OperationalMap';
import OperationalMapLayers from './OperationalMapLayers';
import { useLoadingStore } from '@/store/loadingStore';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface DigitalTwinViewProps {
  onlyShowLayer?: string;
  theme?: 'light' | 'dark';
}

const DigitalTwinView: React.FC<DigitalTwinViewProps> = ({ onlyShowLayer, theme = 'dark' }) => {
  const isMapReady = useLoadingStore(state => state.isMapReady);

  return (
    <div className={cn("relative w-full h-full overflow-hidden", theme === 'dark' ? "bg-slate-950" : "bg-slate-50")}>
      <OperationalMap>
        <OperationalMapLayers onlyShowLayer={onlyShowLayer} />
      </OperationalMap>
      
      {/* Map Loader Overlay */}
      <AnimatePresence mode="wait">
        {!isMapReady && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn("absolute inset-0 z-30 flex flex-col items-center justify-center transition-opacity backdrop-blur-md", theme === 'dark' ? "bg-slate-950/80" : "bg-white/80")}
          >
            <div className="relative flex flex-col items-center gap-4 text-center">
              <div className="relative">
                <div className={cn("h-16 w-16 rounded-2xl border-4 animate-spin", theme === 'dark' ? "border-slate-800 border-t-blue-500" : "border-slate-50 border-t-blue-600")} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                </div>
              </div>
              <div>
                <span className={cn("text-xs font-bold uppercase tracking-widest block", theme === 'dark' ? "text-white" : "text-slate-900")}>Environment Initialising</span>
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter mt-1 block">Riyadh Operational Zone #01</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DigitalTwinView;
