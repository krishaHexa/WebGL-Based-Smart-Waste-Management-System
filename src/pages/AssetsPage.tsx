import React, { useState, useMemo } from 'react';
import { useBinStore } from '@/store/binStore';
import { useFleetStore } from '@/store/fleetStore';
import { useFacilityStore } from '@/store/facilityStore';
import { useSurveillanceStore } from '@/store/surveillanceStore';
import { useWorkforceStore } from '@/store/workforceStore';
import { useMapStore } from '@/store/mapStore';
import { 
  Search, 
  Download, 
  Plus, 
  Trash2, 
  Truck, 
  ExternalLink,
  ChevronRight,
  Filter,
  MoreVertical,
  Activity,
  Building2,
  Camera,
  Users,
  ShieldAlert,
  Zap,
  Globe,
  MapPin,
  BatteryMedium
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import KPICard from '@/components/shared/KPICard';

const AssetsPage: React.FC = () => {
  const navigate = useNavigate();
  const { bins, selectBin } = useBinStore();
  const { vehicles, selectVehicle } = useFleetStore();
  const { facilities, selectFacility } = useFacilityStore();
  const { cameras, selectCamera } = useSurveillanceStore();
  const { crews, selectCrew } = useWorkforceStore();
  const { setCenter, setZoom } = useMapStore();
  
  const [activeTab, setActiveTab] = useState('All Assets');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = ['All Assets', 'Vehicles', 'Smart Bins', 'Facilities', 'Surveillance', 'Workforce'];

  const metrics = [
    { label: 'Total Fleet', value: vehicles.length, subValue: '84% Utilization', variant: 'blue' as const, icon: Truck },
    { label: 'IoT Smart Bins', value: bins.length, subValue: '92% Active', variant: 'emerald' as const, icon: Trash2 },
    { label: 'Industrial Nodes', value: facilities.length, subValue: 'Ops Ready', variant: 'purple' as const, icon: Building2 },
    { label: 'Field Units', value: crews.length, subValue: 'On Mission', variant: 'orange' as const, icon: Users },
  ];

  // Combine ALL assets for the table
  const allAssets = useMemo(() => [
    ...vehicles.map(v => ({
      id: v.id,
      code: v.vehicleCode,
      name: v.name,
      type: 'Vehicle',
      category: 'Logistics',
      location: 'Mobile Vector',
      status: v.operationalStatus === 'ACTIVE' ? 'Active' : 'Maintenance',
      health: 94,
      lastSync: '2 min ago',
      icon: Truck,
      color: v.operationalStatus === 'ACTIVE' ? 'blue' : 'orange',
      telemetry: { label: 'Fuel', value: v.fuelLevel, unit: '%' },
      onSelect: () => { 
        selectVehicle(v.id); 
        setCenter([v.location.lat, v.location.lng]);
        setZoom(16);
        navigate('/'); 
      }
    })),
    ...bins.map(b => ({
      id: b.id,
      code: b.binCode,
      name: b.name,
      type: 'Smart Bin',
      category: 'IoT Node',
      location: b.name || 'Riyadh Zone',
      status: b.fillLevel > 85 ? 'Critical' : b.fillLevel > 70 ? 'Warning' : 'Healthy',
      health: b.batteryLevel,
      lastSync: '5 min ago',
      icon: Trash2,
      color: b.fillLevel > 85 ? 'red' : b.fillLevel > 70 ? 'orange' : 'emerald',
      telemetry: { label: 'Fill', value: b.fillLevel, unit: '%' },
      onSelect: () => { 
        selectBin(b.id); 
        setCenter([b.location.lat, b.location.lng]);
        setZoom(17);
        navigate('/'); 
      }
    })),
    ...facilities.map(f => ({
      id: f.id,
      code: f.id.split('-').pop() || 'FAC-001',
      name: f.name,
      type: 'Facility',
      category: 'Industrial',
      location: 'Fixed Node',
      status: f.operationalStatus === 'operational' ? 'Operational' : 'Degraded',
      health: f.equipmentHealth,
      lastSync: '12 min ago',
      icon: Building2,
      color: f.operationalStatus === 'operational' ? 'purple' : 'orange',
      telemetry: { label: 'Load', value: f.capacityPercentage, unit: '%' },
      onSelect: () => { 
        selectFacility(f.id); 
        setCenter([f.location.lat, f.location.lng]);
        setZoom(15);
        navigate('/'); 
      }
    })),
    ...cameras.map(c => ({
      id: c.id,
      code: c.cameraCode,
      name: c.cameraName,
      type: 'Surveillance',
      category: 'Security',
      location: c.facilityZone,
      status: c.operationalStatus === 'online' ? 'Online' : 'Offline',
      health: c.networkHealth,
      lastSync: 'Live Feed',
      icon: Camera,
      color: c.operationalStatus === 'online' ? 'blue' : 'red',
      telemetry: { label: 'Sync', value: c.networkHealth, unit: '%' },
      onSelect: () => { 
        selectCamera(c.id); 
        setCenter([c.location.lat, c.location.lng]);
        setZoom(17);
        navigate('/'); 
      }
    })),
    ...crews.map(w => ({
      id: w.id,
      code: w.employeeCode,
      name: w.name,
      type: 'Workforce',
      category: 'Personnel',
      location: w.assignedZone,
      status: w.operationalStatus === 'available' ? 'Available' : 'Assigned',
      health: 100 - (w.workloadLevel || 0),
      lastSync: '4 min ago',
      icon: Users,
      color: w.operationalStatus === 'available' ? 'emerald' : 'blue',
      telemetry: { label: 'Load', value: w.workloadLevel, unit: '%' },
      onSelect: () => { 
        selectCrew(w.id); 
        setCenter([w.location.lat, w.location.lng]);
        setZoom(16);
        navigate('/'); 
      }
    }))
  ], [vehicles, bins, facilities, cameras, crews, navigate, selectBin, selectVehicle, selectFacility, selectCamera, selectCrew, setCenter, setZoom]);

  const filteredAssets = useMemo(() => {
    const assets = activeTab === 'All Assets' 
      ? allAssets 
      : allAssets.filter(a => {
          if (activeTab === 'Vehicles') return a.type === 'Vehicle';
          if (activeTab === 'Smart Bins') return a.type === 'Smart Bin';
          if (activeTab === 'Facilities') return a.type === 'Facility';
          if (activeTab === 'Surveillance') return a.type === 'Surveillance';
          if (activeTab === 'Workforce') return a.type === 'Workforce';
          return false;
        });
    
    return assets.filter(a => 
      a.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allAssets, activeTab, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-slate-50 p-4 sm:p-6 overflow-hidden font-sans text-slate-900">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Enterprise Asset Inventory</h1>
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 mt-0.5 uppercase tracking-[0.2em] leading-none sm:leading-normal">Lifecycle monitoring for fleet, smart bins, facilities and workforce nodes</p>
        </div>
        <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-400 hover:text-slate-900 transition-all shadow-sm uppercase tracking-widest flex-1 sm:flex-none">
            <Download size={14} /> <span className="hidden sm:inline">Export</span><span className="sm:hidden">Export Manifest</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 uppercase tracking-widest flex-1 sm:flex-none">
            <Plus size={14} /> Register Asset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 shrink-0">
        {metrics.map((m, i) => (
          <div key={i} className={cn(i >= 2 && "hidden sm:block md:block")}>
            <KPICard  {...m} value={m.value.toString()} subValue={m.subValue} />
          </div>
        ))}
      </div>

      {/* Filters & Table */}
      <div className="bg-white rounded-2xl sm:rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col flex-1 min-h-[400px]">
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-100 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-slate-50/20">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl sm:rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-3 sm:px-4 py-2 text-[9px] font-black rounded-lg sm:rounded-xl transition-all uppercase tracking-[0.15em] whitespace-nowrap flex-1 lg:flex-none",
                  activeTab === tab 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative flex-1 lg:max-w-xl">
            <Search className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets..." 
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-11 pr-4 text-[11px] font-bold focus:ring-4 focus:ring-blue-600/5 outline-none transition-all placeholder:text-slate-300 uppercase tracking-widest text-slate-900"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto no-scrollbar relative min-w-0">
          <div className="min-w-[1000px] xl:min-w-0 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-slate-100 font-black">
                <tr>
                  <th className="px-4 sm:px-6 py-4 text-[9px] text-slate-400 uppercase tracking-[0.2em]">Asset Identity</th>
                  <th className="px-4 sm:px-6 py-4 text-[9px] text-slate-400 uppercase tracking-[0.2em]">Category</th>
                  <th className="px-4 sm:px-6 py-4 text-[9px] text-slate-400 uppercase tracking-[0.2em]">Operational Pulse</th>
                  <th className="px-4 sm:px-6 py-4 text-[9px] text-slate-400 uppercase tracking-[0.2em]">Sensor Telemetry</th>
                  <th className="px-4 sm:px-6 py-4 text-[9px] text-slate-400 uppercase tracking-[0.2em]">Integrity Index</th>
                  <th className="px-4 sm:px-6 py-4 text-[9px] text-slate-400 uppercase tracking-[0.2em] text-right">Interface</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-bold">
                {filteredAssets.map((asset) => (
                  <tr 
                    key={asset.id} 
                    className="hover:bg-slate-50 transition-colors group cursor-pointer border-l-4 border-transparent hover:border-blue-600"
                    onClick={asset.onSelect}
                  >
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border transition-transform group-hover:scale-110 shrink-0",
                          asset.type === 'Vehicle' ? "bg-blue-50 text-blue-600 border-blue-100" :
                          asset.type === 'Smart Bin' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                          asset.type === 'Facility' ? "bg-purple-50 text-purple-600 border-purple-100" :
                          asset.type === 'Surveillance' ? "bg-slate-50 text-slate-600 border-slate-100" :
                          "bg-orange-50 text-orange-600 border-orange-100"
                        )}>
                          <asset.icon size={20} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[12px] font-black text-slate-900 uppercase tracking-tight block leading-none truncate">{asset.name || asset.code}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-1 block truncate">Loc Index: {asset.location}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex flex-col">
                         <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{asset.type}</span>
                         <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{asset.category}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-2">
                         <div className={cn(
                           "w-1.5 h-1.5 rounded-full",
                           asset.color === 'emerald' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" :
                           asset.color === 'red' ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]" :
                           asset.color === 'orange' ? "bg-orange-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]" :
                           "bg-blue-500 shadow-[0_0_8_rgba(37,99,235,0.3)]"
                         )} />
                         <span className={cn(
                          "text-[9px] font-black uppercase tracking-widest leading-none",
                          asset.color === 'emerald' ? "text-emerald-600" :
                          asset.color === 'red' ? "text-red-600" :
                          asset.color === 'orange' ? "text-orange-600" : "text-blue-600"
                         )}>
                          {asset.status}
                         </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100 w-fit">
                         <div className="flex flex-col">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{asset.telemetry.label}</span>
                            <span className="text-[11px] font-black text-slate-900 tabular-nums">{asset.telemetry.value}{asset.telemetry.unit}</span>
                         </div>
                         <div className="w-px h-5 bg-slate-200" />
                         <div className="flex flex-col">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Network</span>
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-tight">{asset.lastSync}</span>
                         </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="w-28 space-y-1.5">
                         <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-400">
                            <span>Health</span>
                            <span className="text-slate-900">{asset.health}%</span>
                         </div>
                         <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full transition-all duration-1000",
                                asset.health > 80 ? "bg-emerald-500" : asset.health > 50 ? "bg-blue-500" : "bg-red-500"
                              )}
                              style={{ width: `${asset.health}%` }}
                            />
                         </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white border border-transparent hover:border-slate-200 text-slate-400 hover:text-slate-900 transition-all font-black">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-3 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between border-t border-slate-900 gap-4 shrink-0">
          <div className="flex items-center gap-3">
             <Radio className="text-blue-500 animate-pulse" size={12} />
             <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500">Node Signal Live</span>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">{filteredAssets.length} Nodes</span>
            <div className="flex gap-1.5">
              <button className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-[9px] font-black text-slate-400 hover:text-white transition-all shadow-sm uppercase tracking-widest">Prev</button>
              <button className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-[9px] font-black text-slate-400 hover:text-white transition-all shadow-sm uppercase tracking-widest">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Radio: React.FC<{ className?: string, size?: number }> = ({ className, size = 16 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M4.9 19.1C3.1 17.3 2 14.8 2 12s1.1-5.3 2.9-7.1" />
    <path d="M7.8 16.2c-1.1-1.1-1.8-2.6-1.8-4.2s.7-3.1 1.8-4.2" />
    <circle cx="12" cy="12" r="2" />
    <path d="M16.2 7.8c1.1 1.1 1.8 2.6 1.8 4.2s-.7 3.1-1.8 4.2" />
    <path d="M19.1 4.9C20.9 6.7 22 9.2 22 12s-1.1 5.3-2.9 7.1" />
  </svg>
);

export default AssetsPage;
