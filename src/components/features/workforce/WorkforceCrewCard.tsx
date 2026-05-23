import React from 'react';
import { cn } from '@/lib/utils';
import { WorkforceCrew } from '@/types';
import { 
  User, 
  Truck, 
  MapPin, 
  ShieldAlert, 
  Activity,
  Clock,
  Briefcase
} from 'lucide-react';
import { motion } from 'motion/react';

interface WorkforceCrewCardProps {
  crew: WorkforceCrew;
  isSelected?: boolean;
  onSelect?: () => void;
}

const WorkforceCrewCard: React.FC<WorkforceCrewCardProps> = ({ crew, isSelected, onSelect }) => {
  const getStatusStyle = () => {
    switch (crew.operationalStatus) {
      case 'available': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'dispatched': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'responding': return 'text-red-600 bg-red-50 border-red-100';
      case 'maintenance': return 'text-purple-600 bg-purple-50 border-purple-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  const getRoleIcon = () => {
    switch (crew.role) {
      case 'driver': return Truck;
      case 'fieldOperator': return Briefcase;
      case 'supervisor': return ShieldAlert;
      case 'maintenance': return Activity;
      default: return User;
    }
  };

  const RoleIcon = getRoleIcon();

  return (
    <motion.div 
      layout
      onClick={onSelect}
      className={cn(
        "p-4 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden",
        isSelected 
            ? "bg-white border-blue-600 shadow-xl ring-1 ring-blue-600/50" 
            : "bg-white border-slate-200 hover:border-blue-600/30 hover:bg-slate-50 shadow-sm"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
            <div className={cn(
                "p-2.5 rounded-xl bg-slate-50 border border-slate-100 transition-all",
                isSelected ? "border-blue-600/30 text-blue-600 bg-blue-50 scale-110 shadow-inner" : "text-slate-400"
            )}>
                <RoleIcon size={20} />
            </div>
            <div className="flex flex-col">
                <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-tighter truncate max-w-[120px] leading-none mb-1.5">{crew.name}</h3>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none shrink-0">{crew.employeeCode}</span>
            </div>
        </div>
        <div className={cn("px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border shadow-sm shrink-0 leading-none", getStatusStyle())}>
            {crew.operationalStatus}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="flex flex-col gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100/50">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Sector Vector</span>
            <div className="flex items-center gap-1.5 text-[9px] text-slate-900 font-bold uppercase truncate leading-none">
                <MapPin size={10} className="text-blue-500" />
                {crew.assignedZone}
            </div>
        </div>
        <div className="flex flex-col gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100/50">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Node Response</span>
            <div className="flex items-center gap-1.5 text-[9px] text-slate-900 font-bold uppercase truncate leading-none">
                <Activity size={10} className="text-orange-500" />
                {crew.crewType.split('_').pop()}
            </div>
        </div>
      </div>

      <div className="space-y-2.5">
         <div className="flex justify-between items-end px-1">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Tactical Workload</span>
            <span className="text-[10px] font-black text-slate-900 tabular-nums leading-none">{Math.floor(crew.workloadLevel)}%</span>
         </div>
         <div className="h-1.5 bg-slate-50 border border-slate-100 rounded-full overflow-hidden shadow-inner">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${crew.workloadLevel}%` }}
               transition={{ duration: 1, type: 'spring' }}
               className={cn(
                  "h-full rounded-full transition-all",
                  crew.workloadLevel > 80 ? "bg-red-500" : crew.workloadLevel > 50 ? "bg-orange-500" : "bg-blue-600"
               )}
            />
         </div>
      </div>

      {crew.shiftStatus === 'overtime' && (
        <div className="absolute top-0 right-0 p-1">
           <div className="bg-red-500 text-[7px] font-black text-white px-2 py-0.5 rounded-bl-xl uppercase tracking-[0.1em] shadow-lg animate-pulse">
              OTA_SYNC_ACTV
           </div>
        </div>
      )}
    </motion.div>
  );
};

export default WorkforceCrewCard;
