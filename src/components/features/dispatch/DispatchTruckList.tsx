import React, { useState } from 'react';
import { useFleetStore } from '@/store/fleetStore';
import { TruckStatus, WasteType } from '@/types';
import { Search, Filter, Truck, Fuel, Package, MapPin, Activity, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const DispatchTruckList: React.FC = () => {
  const { 
    vehicles, 
    selectedVehicleId, 
    selectVehicle, 
    batchDispatch,
    selectedVehicleIds,
    toggleVehicleSelection,
    isBatchMode,
    setBatchMode
  } = useFleetStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TruckStatus | 'ALL'>('ALL');
  const [wasteTypeFilter, setWasteTypeFilter] = useState<WasteType | 'ALL'>('ALL');
  const [fuelThreshold, setFuelThreshold] = useState<number>(0);
  const [regionFilter, setRegionFilter] = useState<string>('ALL');

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.vehicleCode.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         v.driverName.toLowerCase().includes(searchQuery.toLowerCase());
    const truckStatus = v.operationalStatus.toString().toUpperCase() as TruckStatus;
    
    // Hide unavailable trucks if 'ALL' is selected
    const matchesStatus = statusFilter === 'ALL' 
      ? !['MAINTENANCE', 'INSPECTION', 'OFFLINE'].includes(truckStatus)
      : truckStatus === statusFilter;

    const matchesWaste = wasteTypeFilter === 'ALL' || v.wasteType === wasteTypeFilter;
    const matchesFuel = v.fuelLevel >= fuelThreshold;
    const matchesRegion = regionFilter === 'ALL' || v.currentRoute?.includes(regionFilter);
    
    return matchesSearch && matchesStatus && matchesWaste && matchesFuel && matchesRegion;
  });

  const getStatusStyle = (status: string) => {
    const s = status.toUpperCase();
    switch (s) {
      case 'AVAILABLE': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'ACTIVE': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'MAINTENANCE': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'OFFLINE': return 'bg-slate-100 text-slate-500 border-slate-200';
      case 'OVERLOADED': return 'bg-red-50 text-red-600 border-red-100';
      case 'RESERVED': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white font-sans relative">
      <div className="p-4 border-b border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">Vehicle Inventory</h2>
            <button 
              onClick={() => {
                setBatchMode(!isBatchMode);
              }}
              className={cn(
                "px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest transition-all",
                isBatchMode ? "bg-blue-600 text-white shadow-lg" : "bg-slate-50 text-slate-400 hover:text-slate-900"
              )}
            >
              {isBatchMode ? 'Cancel Batch' : 'Batch Mode'}
            </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search vessels or operators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold uppercase tracking-tight focus:outline-none focus:border-blue-600/30 transition-all"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {(['ALL', 'AVAILABLE', 'ACTIVE', 'MAINTENANCE', 'OVERLOADED'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest whitespace-nowrap border transition-all",
                statusFilter === s ? "bg-slate-900 text-white border-slate-900 shadow-lg" : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
           <select 
             value={regionFilter}
             onChange={(e) => setRegionFilter(e.target.value)}
             className="bg-slate-50 border border-slate-100 rounded-lg px-2 py-1.5 text-[9px] font-black uppercase tracking-tight focus:outline-none"
           >
              <option value="ALL">All Regions</option>
              <option value="NORTH">North Zone</option>
              <option value="SOUTH">South Zone</option>
              <option value="RIY">Riyadh Central</option>
           </select>
           <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-2 py-1.5">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Min Fuel:</span>
              <input 
                type="number"
                value={fuelThreshold}
                onChange={(e) => setFuelThreshold(Number(e.target.value))}
                className="w-10 bg-transparent text-[9px] font-black text-slate-900 focus:outline-none"
              />
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredVehicles.map((vehicle) => (
            <motion.div
              layout
              key={vehicle.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => {
                if (isBatchMode) {
                  toggleVehicleSelection(vehicle.id);
                } else {
                  selectVehicle(vehicle.id);
                }
              }}
              className={cn(
                "p-3 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden",
                (selectedVehicleId === vehicle.id || selectedVehicleIds.includes(vehicle.id))
                  ? "bg-white border-blue-600 shadow-xl shadow-blue-600/5 ring-1 ring-blue-600/30" 
                  : "bg-white border-slate-100 hover:border-blue-600/30 hover:bg-slate-50"
              )}
            >
              {isBatchMode && (
                <div className={cn(
                  "absolute top-3 right-3 h-4 w-4 rounded-md border-2 z-10 transition-all flex items-center justify-center",
                  selectedVehicleIds.includes(vehicle.id) ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-600/30" : "bg-white border-slate-200"
                )}>
                  {selectedVehicleIds.includes(vehicle.id) && <div className="h-1.5 w-1.5 bg-white rounded-sm" />}
                </div>
              )}
              
              <div className="flex items-start justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center transition-all shadow-sm",
                    selectedVehicleId === vehicle.id ? "bg-blue-600 text-white shadow-xl shadow-blue-600/30" : "bg-slate-50 text-slate-400"
                  )}>
                    <Truck size={16} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{vehicle.vehicleCode}</h4>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">DRV: {vehicle.driverName.split(' ')[0]}</span>
                  </div>
                </div>
                <div className={cn(
                  "px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest border shadow-sm shrink-0",
                  getStatusStyle(vehicle.operationalStatus)
                )}>
                  {vehicle.operationalStatus}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2.5">
                <div className="flex-1 p-1.5 rounded-lg bg-slate-50/50 border border-slate-100/50 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Fuel size={8} className={cn(vehicle.fuelLevel < 20 ? "text-red-500" : "text-blue-500")} />
                    <span className="text-[9px] font-black text-slate-900 tabular-nums">{Math.round(vehicle.fuelLevel)}%</span>
                  </div>
                  <div className="flex items-center gap-1 border-l border-slate-200 pl-2 ml-1">
                    <Package size={8} className="text-orange-500" />
                    <span className="text-[9px] font-black text-slate-900 tabular-nums">{Math.round(vehicle.loadPercentage)}%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[8px] font-black text-slate-400 uppercase tracking-tight">
                    <MapPin size={8} className="text-slate-300" /> RIY_ZONE_4
                  </div>
                  <div className="flex items-center gap-1 text-[8px] font-black text-blue-600 uppercase tracking-tight">
                    <Activity size={8} /> {vehicle.currentRoute === 'NONE' ? 'Idle' : vehicle.currentRoute.split('-')[0]}
                  </div>
                </div>
                <ChevronRight size={12} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isBatchMode && selectedVehicleIds.length > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="absolute bottom-4 left-4 right-4 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl z-30 flex items-center justify-between"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{selectedVehicleIds.length} Units Selection</span>
              <span className="text-xs font-bold truncate max-w-[120px]">Ready for Dispatch</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DispatchTruckList;
