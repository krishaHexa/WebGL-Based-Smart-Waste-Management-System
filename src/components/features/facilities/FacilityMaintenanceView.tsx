import React from 'react';
import { 
  Wrench, 
  Settings, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  User, 
  FileText,
  Filter
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { motion } from 'motion/react';

const FacilityMaintenanceView: React.FC = () => {
  const tasks = [
    { id: 'MT-104', asset: 'Compactor Alpha', type: 'Preventive', status: 'In Progress', date: '2026-05-14', priority: 'High', tech: 'Faisal I.' },
    { id: 'MT-105', asset: 'Gate 4 Sensor', type: 'Repair', status: 'Scheduled', date: '2026-05-15', priority: 'Medium', tech: 'Ahmed S.' },
    { id: 'MT-106', asset: 'Biogas Pump B', type: 'Calibration', status: 'Pending', date: '2026-05-16', priority: 'Low', tech: 'Khalid A.' },
    { id: 'MT-107', asset: 'Main Conveyor', type: 'Inspection', status: 'Completed', date: '2026-05-12', priority: 'Normal', tech: 'Omar M.' },
  ];

  return (
    <div className="h-full flex flex-col p-8 space-y-8 overflow-y-auto no-scrollbar bg-slate-50">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Facility Maintenance Ledger</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Lifecycle Management // Equipment Health Ops</p>
        </div>
        <div className="flex items-center gap-4">
           <button className="h-10 px-6 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:border-slate-300 transition-all flex items-center gap-2">
              <Calendar size={14} /> Schedule Service
           </button>
           <button className="h-10 px-6 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all">
              Assign Technician
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Active Tasks List */}
        <div className="lg:col-span-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
             <div className="flex items-center gap-6">
                <div className="flex flex-col">
                   <span className="text-[14px] font-black text-slate-900 tabular-nums">12</span>
                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">PENDING TASKS</span>
                </div>
                <div className="w-px h-8 bg-slate-100" />
                <div className="flex flex-col">
                   <span className="text-[14px] font-black text-emerald-500 tabular-nums">94%</span>
                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">FLEET UPTIME</span>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="relative">
                   <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                   <select className="pl-8 pr-12 h-9 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest appearance-none focus:outline-none">
                      <option>All Assets</option>
                      <option>Critical Only</option>
                      <option>Upcoming</option>
                   </select>
                </div>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
             <table className="w-full text-left">
                <thead>
                   <tr className="bg-slate-50/50">
                      <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Job ID</th>
                      <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Asset / Machine</th>
                      <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                      <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Assigned Tech</th>
                      <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {tasks.map((task, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                         <td className="px-8 py-5">
                            <span className="text-[10px] font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase">{task.id}</span>
                         </td>
                         <td className="px-8 py-5">
                            <div className="flex flex-col">
                               <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{task.asset}</span>
                               <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">S/N: 2026-XQ-0{i+1}</span>
                            </div>
                         </td>
                         <td className="px-8 py-5">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">{task.type}</span>
                         </td>
                         <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                               <div className="h-6 w-6 rounded-full bg-slate-200 overflow-hidden">
                                  <img src={`https://i.pravatar.cc/150?u=${i+20}`} alt={task.tech} className="h-full w-full object-cover" />
                               </div>
                               <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">{task.tech}</span>
                            </div>
                         </td>
                         <td className="px-8 py-5 text-right">
                            <span className={cn(
                               "px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border",
                               task.status === 'Completed' ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                               task.status === 'In Progress' ? "bg-blue-50 border-blue-100 text-blue-600" :
                               task.status === 'Scheduled' ? "bg-amber-50 border-amber-100 text-amber-600" :
                               "bg-slate-50 border-slate-200 text-slate-400"
                            )}>
                               {task.status}
                            </span>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>

        {/* Maintenance Analytics / Right Col */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 flex flex-col gap-6">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Resource Utilization</h3>
              <div className="space-y-6">
                 {['Labor Allocation', 'Spare Parts Inventory', 'Service Efficiency'].map((metric, i) => (
                    <div key={metric} className="space-y-2">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tight">
                          <span className="text-slate-400">{metric}</span>
                          <span className="text-slate-900 tabular-nums">{[84, 92, 78][i]}%</span>
                       </div>
                       <div className="h-2 w-full bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${[84, 92, 78][i]}%` }}
                            className="h-full bg-slate-900 rounded-full"
                          />
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-blue-900 rounded-[2rem] border border-white/10 shadow-2xl p-8 flex flex-col gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 translate-x-4">
                 <Wrench size={160} />
              </div>
              <div className="relative z-10 flex items-center gap-4 mb-2">
                 <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/10">
                    <ShieldCheck size={20} />
                 </div>
                 <h4 className="text-xs font-black text-white uppercase tracking-tight">Compliance Status</h4>
              </div>
              <div className="relative z-10 space-y-4 pt-2">
                 <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-[10px] font-black text-white uppercase tracking-tight leading-none mb-1">ISO_14001:2026</p>
                    <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest leading-none">Operational health audits complete.</p>
                 </div>
                 <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest leading-relaxed">
                    Facility environment and safety audits scheduled for 24th May. Please verify documentation prep.
                 </p>
                 <button className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest group-hover:gap-3 transition-all">
                    View Verification Ledger <FileText size={14} />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityMaintenanceView;
