import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useBinStore } from '../../store/binStore';
import { useIncidentStore } from '../../store/incidentStore';
import { Trash2, MapPin, Bell, MessageSquare, Plus, Clock, Search, LogOut } from 'lucide-react';
import KPICard from '../../components/shared/KPICard';
import { cn } from '../../lib/utils';

const CitizenDashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { bins } = useBinStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const myReports = [
    { id: '1', title: 'Overflowing Bin', status: 'In Progress', date: '2026-05-12' },
    { id: '2', title: 'Vandalized Container', status: 'Resolved', date: '2026-05-10' },
  ];

  return (
    <div className="max-w-xl mx-auto min-h-full bg-slate-50 font-sans pb-24">
      {/* Header */}
      <div className="bg-blue-600 p-8 rounded-b-[3rem] text-white space-y-6 shadow-xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Trash2 className="text-white" />
             </div>
             <div>
                <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest leading-none mb-1">Welcome back,</p>
                <h1 className="text-lg font-black uppercase tracking-tight">{user?.name}</h1>
             </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center relative">
               <Bell size={18} />
               <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-blue-600" />
            </button>
            <button 
              onClick={handleLogout}
              className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
               <LogOut size={18} />
            </button>
          </div>
        </div>

        <div className="relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={16} />
           <input 
              className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold placeholder:text-white/40 focus:outline-none focus:bg-white/20 transition-all"
              placeholder="Find nearest smart bins or services..."
           />
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
           <button className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center gap-3 group hover:border-blue-600/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                 <Plus size={24} />
              </div>
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Report Issue</span>
           </button>
           <button className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center gap-3 group hover:border-blue-600/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                 <MapPin size={24} />
              </div>
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Collection Map</span>
           </button>
        </div>

        {/* My Reports */}
        <div className="space-y-4">
           <div className="flex justify-between items-center px-1">
              <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Your Reports</h2>
              <button className="text-[10px] font-black text-blue-600 uppercase">View All</button>
           </div>
           <div className="space-y-3">
              {myReports.map(report => (
                <div key={report.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                      <MessageSquare size={18} />
                   </div>
                   <div className="flex-1">
                      <p className="text-[11px] font-black text-slate-900 uppercase">{report.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                         <Clock size={10} className="text-slate-300" />
                         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{report.date}</span>
                      </div>
                   </div>
                   <div className={cn(
                      "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                      report.status === 'Resolved' ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                   )}>
                      {report.status}
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Local Impact Stats */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
           <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Community Impact</p>
           <h3 className="text-2xl font-black uppercase tracking-tight mb-6">Your District is <br /><span className="text-emerald-400">92% Clean</span></h3>
           <div className="grid grid-cols-2 gap-6">
              <div>
                 <p className="text-2xl font-black tabular-nums">480kg</p>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Waste Diverted</p>
              </div>
              <div>
                 <p className="text-2xl font-black tabular-nums">1.2k</p>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Green Points</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
