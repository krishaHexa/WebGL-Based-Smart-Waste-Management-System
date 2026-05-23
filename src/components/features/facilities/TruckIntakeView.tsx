import React from 'react';
import { useFleetStore } from '../../../store/fleetStore';
import { useFacilityStore } from '../../../store/facilityStore';
import { 
  Truck, 
  MapPin, 
  Clock, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert,
  Search,
  Filter
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const TruckIntakeView: React.FC = () => {
  const { vehicles } = useFleetStore();
  const { facilities, selectedFacilityId } = useFacilityStore();
  
  const facility = facilities.find(f => f.id === selectedFacilityId) || facilities[0];
  
  // Filter trucks heading to this facility or currently unloading
  const inboundTrucks = vehicles.filter(v => 
    v.destinationFacilityId === facility.id || v.operationalState === 'unloading'
  );

  return (
    <div className="h-full flex gap-8 p-8 overflow-hidden bg-slate-50">
      {/* Left Panel: Queue Control */}
      <div className="w-[420px] flex flex-col gap-6 h-full overflow-hidden">
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col h-full">
           <div className="p-8 border-b border-slate-50 flex flex-col gap-6 bg-slate-50/20">
              <div className="flex justify-between items-center text-slate-900">
                 <div>
                    <h3 className="text-sm font-black uppercase tracking-tight">Facility Queue</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Live Vessel Tracking // Dock Coordination</p>
                 </div>
                 <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 shadow-sm transition-all hover:text-blue-600">
                    <Filter size={18} />
                 </div>
              </div>

              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                 <input 
                    type="text" 
                    placeholder="SCAN UNIT ID..." 
                    className="w-full h-12 pl-12 bg-white border border-slate-100 rounded-xl text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-mono"
                 />
              </div>

              <div className="flex gap-2">
                 {['ALL', 'IN_TRANSIT', 'DOCKING', 'UNLOADING'].map(f => (
                   <button 
                      key={f} 
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all",
                        f === 'ALL' ? "bg-slate-900 text-white" : "bg-white border border-slate-100 text-slate-400 hover:text-slate-600"
                      )}
                   >
                      {f.replace('_', ' ')}
                   </button>
                 ))}
              </div>
           </div>

           <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
              <AnimatePresence mode="popLayout">
                {inboundTrucks.map((truck) => (
                  <motion.div
                    key={truck.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-600/30 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                         <div className={cn(
                           "h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-lg",
                           truck.operationalState === 'unloading' ? "bg-emerald-600" : "bg-blue-600"
                         )}>
                            <Truck size={18} />
                         </div>
                         <div>
                            <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-tight leading-none mb-1.5">{truck.vehicleCode}</h4>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">{truck.driverName}</span>
                         </div>
                      </div>
                      <div className={cn(
                        "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border",
                        truck.operationalState === 'unloading' ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-blue-50 border-blue-100 text-blue-600"
                      )}>
                        {truck.operationalState}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                       <div className="flex flex-col gap-1">
                          <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">ETA Status</span>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-900 font-black">
                             <Clock size={10} className="text-blue-500" />
                             {truck.operationalState === 'unloading' ? 'IN_PROGRESS' : '14 MINS'}
                          </div>
                       </div>
                       <div className="flex flex-col gap-1">
                          <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Waste Category</span>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-900 font-black">
                             <MapPin size={10} className="text-orange-500" />
                             {truck.wasteType.toUpperCase()}
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                       <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-tight">
                          Bay Assignment: <span className="text-blue-600">{truck.id.includes('1') ? 'BAY 04' : 'BAY 12'}</span>
                       </div>
                       <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {inboundTrucks.length === 0 && (
                <div className="p-12 flex flex-col items-center justify-center text-center opacity-30">
                   <Truck size={48} className="text-slate-300 mb-4" />
                   <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">No inbound vessels detected</p>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Right Content: Bay Coordination */}
      <div className="flex-1 flex flex-col gap-8 h-full overflow-hidden">
         {/* Live Unloading Dock Monitor */}
         <div className="flex-1 bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-900">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/10">
                     <MapPin size={22} strokeWidth={1.5} />
                  </div>
                  <div>
                     <h3 className="text-[14px] font-black text-white uppercase tracking-tight leading-none mb-2">Unloading Bay Coordination</h3>
                     <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.3em] leading-none italic">Theater Command Zone: RIY_NORTH_DOCKS</p>
                  </div>
               </div>
               <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Fleet Sync Nominal
               </div>
            </div>

            {/* Visual Bay Grid */}
            <div className="flex-1 p-10 grid grid-cols-4 gap-6 bg-slate-50/30 overflow-y-auto no-scrollbar">
               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(bay => {
                  const isActive = bay === 4 || bay === 12;
                  const isMaintenance = bay === 7;
                  
                  return (
                    <div 
                      key={bay} 
                      className={cn(
                        "aspect-video rounded-2xl border flex flex-col transition-all relative group overflow-hidden",
                        isActive ? "bg-white border-blue-600 shadow-xl ring-1 ring-blue-600/30" : 
                        isMaintenance ? "bg-slate-50 border-slate-200 opacity-60" :
                        "bg-white border-slate-100 hover:border-slate-300"
                      )}
                    >
                       <div className="p-4 border-b border-inherit flex justify-between items-center">
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-tight",
                            isActive ? "text-blue-600" : "text-slate-400"
                          )}>Bay {bay < 10 ? `0${bay}` : bay}</span>
                          <div className={cn(
                            "h-2 w-2 rounded-full",
                            isActive ? "bg-emerald-500 animate-pulse" : 
                            isMaintenance ? "bg-orange-500" : "bg-slate-200"
                          )} />
                       </div>
                       
                       <div className="flex-1 flex flex-col items-center justify-center p-4">
                          {isActive ? (
                            <motion.div 
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="text-center"
                            >
                               <Truck size={32} className="text-blue-600 mx-auto mb-2" />
                               <span className="text-[10px] font-black text-slate-900 block leading-none">TRUCK-004</span>
                               <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">Unloading</span>
                            </motion.div>
                          ) : isMaintenance ? (
                            <div className="text-center opacity-40">
                               <AlertCircle size={24} className="text-slate-300 mx-auto mb-1" />
                               <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1 block">Maintenance</span>
                            </div>
                          ) : (
                            <div className="text-center opacity-10">
                               <MapPin size={24} className="text-slate-300 mx-auto mb-1" />
                               <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1 block">Vacant</span>
                            </div>
                          )}
                       </div>

                       {isActive && (
                         <div className="h-1.5 w-full bg-slate-100">
                            <motion.div 
                              initial={{ width: '10%' }}
                              animate={{ width: '65%' }}
                              transition={{ duration: 10, repeat: Infinity }}
                              className="h-full bg-emerald-500"
                            />
                         </div>
                       )}
                    </div>
                  );
               })}
            </div>
         </div>

         {/* Protocol Alerts */}
         <div className="h-[280px] grid grid-cols-2 gap-8">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 flex flex-col justify-between">
               <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                        <AlertCircle size={20} />
                     </div>
                     <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">Vessel Priority Alert</h4>
                  </div>
                  <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-100">
                     P-1 PROTOCOL
                  </span>
               </div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                  Hazardous waste unit [TRUCK-012] has arrived at Gate 4. Mandatory escort to Isolation Dock B required.
               </p>
               <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all mt-6">
                  Authorize Entry // Unload
               </button>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 flex flex-col justify-between relative overflow-hidden group">
               <div className="absolute inset-0 opacity-[0.02] transform translate-y-8 group-hover:translate-y-0 transition-transform bg-[radial-gradient(circle_at_center,#4f46e5_0,transparent_100%)]" />
               <div className="relative z-10">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight mb-2">Gate Intelligence</h4>
                  <div className="space-y-4 pt-4">
                     <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Entry Flow Rate</span>
                        <span className="text-xs font-black text-slate-900 tabular-nums">4.2 U/hr</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Avg Waiting Time</span>
                        <span className="text-xs font-black text-emerald-500 tabular-nums">3.8 mins</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Security Clearance</span>
                        <span className="text-xs font-black text-blue-600 tabular-nums">100% NOMINAL</span>
                     </div>
                  </div>
               </div>
               <div className="relative z-10 pt-4 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Live Security Feed Sync</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default TruckIntakeView;
