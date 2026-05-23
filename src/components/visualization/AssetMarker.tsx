import React from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { formatNumber } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface AssetMarkerProps {
  position: [number, number];
  icon: React.ReactNode;
  color: string;
  label?: string;
  onClick?: () => void;
  isSelected?: boolean;
  tooltipData: {
    title: string;
    status: string;
    metrics: { label: string; value: string | number; unit?: string }[];
    type?: string;
  };
}

const AssetMarker: React.FC<AssetMarkerProps> = ({ 
  position, 
  icon, 
  color, 
  label, 
  onClick, 
  isSelected,
  tooltipData 
}) => {
  const customIcon = L.divIcon({
    html: renderToStaticMarkup(
      <div className={cn(
        "operational-marker flex items-center justify-center relative",
        isSelected && "z-50 scale-125 transition-transform duration-500"
      )}>
        {isSelected && (
          <div className="absolute inset-0 z-[-1]">
             <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: color }} />
             <div className="absolute inset-[-10px] rounded-full animate-pulse opacity-10" style={{ backgroundColor: color }} />
          </div>
        )}
        {label && <div className="marker-label">{label}</div>}
        <div 
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-lg border-2 transition-all",
            isSelected ? "shadow-2xl ring-4 ring-white/50" : ""
          )}
          style={{ borderColor: color }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
        <div 
          className="absolute -bottom-1 h-2 w-2 rotate-45 border-r border-b"
          style={{ backgroundColor: 'white', borderColor: color }}
        />
      </div>
    ),
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  return (
    <Marker position={position} icon={customIcon} eventHandlers={{ click: onClick }}>
      <Tooltip 
        direction="top" 
        offset={[0, -40]} 
        opacity={1} 
        className="asset-tooltip"
        sticky
        permanent={isSelected}
      >
        <div className="w-64 overflow-hidden rounded-xl bg-white">
          <div className="flex items-center justify-between bg-slate-50 px-4 py-3 border-b border-slate-100">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                {tooltipData.type || 'Asset Detail'}
              </p>
              <h4 className="text-xs font-bold text-slate-900">{tooltipData.title}</h4>
            </div>
            <div className={cn(
              "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
              tooltipData.status.toLowerCase().includes('ok') || tooltipData.status.toLowerCase().includes('active') || tooltipData.status.toLowerCase().includes('resolved')
                ? "bg-emerald-50 text-emerald-600"
                : "bg-amber-50 text-amber-600"
            )}>
              {tooltipData.status}
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              {tooltipData.metrics.map((metric, idx) => (
                <div key={idx}>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{metric.label}</p>
                  <p className="text-xs font-bold text-slate-900">
                    {typeof metric.value === 'number' ? formatNumber(metric.value) : metric.value}
                    {metric.unit && <span className="ml-0.5 text-[10px] font-medium text-slate-400">{metric.unit}</span>}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 italic text-[9px] text-slate-400">
            Click asset for full operational telemetry
          </div>
        </div>
      </Tooltip>
    </Marker>
  );
};

export default AssetMarker;
