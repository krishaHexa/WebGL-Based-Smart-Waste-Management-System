import React, { useState } from 'react';
import { 
  Users, 
  Settings, 
  Key, 
  History, 
  Search, 
  Plus, 
  ShieldCheck, 
  Server, 
  Activity,
  UserPlus,
  Trash2,
  Edit2,
  Lock,
  Globe,
  Database,
  Cpu,
  Fingerprint,
  Zap,
  MoreVertical,
  ChevronRight,
  Filter,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import KPICard from '@/components/shared/KPICard';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('User Management');

  const tabs = [
    { label: 'User Management', icon: Users, desc: 'Governance & Roles' },
    { label: 'System Config', icon: Settings, desc: 'Operational Matrix' },
    { label: 'API & Nexus', icon: Key, desc: 'Digital Integrations' },
    { label: 'Audit & Intelligence', icon: History, desc: 'Traceability Logs' },
  ];

  const users = [
    { name: 'Ahmed Hassan', email: 'ahmed.h@ksawaste.gov.sa', role: 'Ops Manager', status: 'Active', lastLogin: '2 mins ago' },
    { name: 'Sarah Ali', email: 'sarah.a@ksawaste.gov.sa', role: 'Data Analyst', status: 'Active', lastLogin: '1 hour ago' },
    { name: 'Khalid Mohammed', email: 'khalid.m@ksawaste.gov.sa', role: 'Field Lead', status: 'Inactive', lastLogin: '2 days ago' },
    { name: 'Root Admin', email: 'admin@ksawaste.gov.sa', role: 'Super Admin', status: 'Active', lastLogin: 'Online Now' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] p-8 overflow-hidden font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Admin Nexus Control</h1>
          <p className="text-sm font-medium text-slate-400 mt-1">Unified governance, core system architecture, and security protocols</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm gap-6">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Network: STABLE</span>
              </div>
              <div className="w-px h-4 bg-slate-100" />
              <div className="flex items-center gap-3">
                 <Cpu size={14} className="text-blue-500" />
                 <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">SLA: 99.99%</span>
              </div>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all font-black text-[10px] uppercase tracking-[0.2em]">
              <Database size={14} />
              Backup Now
           </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl flex flex-col overflow-hidden relative group">
        {/* Navigation Tabs */}
        <div className="px-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div className="flex gap-10">
            {tabs.map(tab => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={cn(
                  "flex flex-col items-start gap-1 py-6 transition-all relative",
                  activeTab === tab.label 
                    ? "text-blue-600" 
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                <div className="flex items-center gap-2">
                   <tab.icon size={14} className={cn("transition-colors", activeTab === tab.label ? "text-blue-600" : "text-slate-300")} />
                   <span className="text-[11px] font-black uppercase tracking-widest leading-none">{tab.label}</span>
                </div>
                <span className="text-[9px] font-bold opacity-60 ml-5">{tab.desc}</span>
                {activeTab === tab.label && (
                  <motion.div 
                    layoutId="admin-tab-bg"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full shadow-lg shadow-blue-600/50"
                  />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                <input 
                  type="text" 
                  placeholder="Query Governance..." 
                  className="bg-white border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-[10px] font-bold w-64 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all shadow-sm"
                />
             </div>
             <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                <Plus size={14} /> Add Protocol
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-10 no-scrollbar bg-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'User Management' && (
                <div className="space-y-10">
                  <div className="grid grid-cols-4 gap-6">
                     {[
                       { label: 'Active Directory', value: '1,248', color: 'blue', icon: Users },
                       { label: 'Security Threats', value: '0', color: 'emerald', icon: ShieldCheck },
                       { label: 'API Latency', value: '24ms', color: 'amber', icon: Activity },
                       { label: 'Nexus Uptime', value: '100%', color: 'blue', icon: Fingerprint },
                     ].map(stat => (
                       <div key={stat.label} className="p-6 bg-[#F8FAFC] rounded-3xl border border-slate-100 shadow-inner group/stat hover:bg-white hover:shadow-xl transition-all">
                          <div className="flex items-start justify-between mb-4">
                             <div className="p-3 rounded-2xl bg-white border border-slate-50 text-blue-600 shadow-sm group-hover/stat:scale-110 transition-transform">
                                <stat.icon size={20} />
                             </div>
                             <div className="p-1 px-2 rounded-lg bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-100">Optimal</div>
                          </div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                          <p className="text-2xl font-black text-slate-900 tracking-tighter mt-1 italic">{stat.value}</p>
                       </div>
                     ))}
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                          <Fingerprint size={16} className="text-blue-600" />
                          Authenticated Entities
                       </h3>
                       <div className="flex items-center gap-3">
                          <button className="flex items-center gap-2 p-2 px-3 rounded-xl border border-slate-100 text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                             <Filter size={12} />
                             Filter Matrix
                          </button>
                          <button className="flex items-center gap-2 p-2 px-3 rounded-xl border border-slate-100 text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                             <Download size={12} />
                             CSV Export
                          </button>
                       </div>
                    </div>

                    <div className="border border-slate-50 rounded-[2rem] overflow-hidden shadow-2xl">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50/50">
                          <tr>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 italic">Nexus Identity</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 italic font-mono">Role_Protocol</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 italic">Temporal_Status</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 italic text-right">Data_Sync_Audit</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 bg-white">
                          {users.map(user => (
                            <tr key={user.email} className="hover:bg-slate-50/30 group transition-all">
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-[10px] italic shadow-lg shadow-slate-900/20 group-hover:scale-110 transition-transform">
                                      {user.name.split(' ').map(n => n[0]).join('')}
                                   </div>
                                   <div>
                                      <p className="text-[13px] font-black text-slate-900 tracking-tight">{user.name}</p>
                                      <p className="text-[10px] font-bold text-slate-400 mt-0.5 lowercase font-mono">{user.email}</p>
                                   </div>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[9px] font-black uppercase tracking-widest inline-block">
                                   {user.role}
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-2.5">
                                  <div className={cn("w-1.5 h-1.5 rounded-full ring-4", 
                                    user.status === 'Active' ? "bg-emerald-500 ring-emerald-500/10 animate-pulse" : "bg-slate-300 ring-slate-100"
                                  )} />
                                  <span className="text-[11px] font-bold text-slate-600">{user.status}</span>
                                </div>
                                <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase italic">Last Sync: {user.lastLogin}</p>
                              </td>
                              <td className="px-8 py-6 text-right">
                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                                   <button className="p-2 bg-white hover:bg-white rounded-xl border border-slate-100 text-slate-400 hover:text-blue-600 shadow-sm transition-all hover:scale-110"><Edit2 size={14} /></button>
                                   <button className="p-2 bg-white hover:bg-white rounded-xl border border-slate-100 text-slate-400 hover:text-emerald-500 shadow-sm transition-all hover:scale-110"><Key size={14} /></button>
                                   <button className="p-2 bg-white hover:bg-white rounded-xl border border-slate-100 text-slate-400 hover:text-red-500 shadow-sm transition-all hover:scale-110"><Trash2 size={14} /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'System Config' && (
                <div className="max-w-4xl grid grid-cols-2 gap-12">
                   <div className="space-y-10">
                     <div className="space-y-6">
                       <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                         <Lock size={16} className="text-blue-600" />
                         Nexus Guard Protocols
                       </h3>
                       <div className="space-y-4">
                          {[
                            { label: 'Multimodal Biometric ID', desc: 'Secure fingerprint & facial recognition for HQ assets', checked: true },
                            { label: 'Zero-Trust Persistent Session', desc: 'Auto-revocation of auth tokens after 30m idle state', checked: true },
                            { label: 'Riyadh VPC White-listing', desc: 'Restricts digital nexus access to government IPs only', checked: false },
                          ].map(item => (
                            <div key={item.label} className="p-6 bg-[#F8FAFC] rounded-[2rem] border border-slate-50 flex items-center justify-between group/toggle hover:bg-white hover:shadow-xl transition-all border shadow-inner hover:border-slate-100">
                               <div className="pr-6">
                                  <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight italic">{item.label}</p>
                                  <p className="text-[10px] font-bold text-slate-400 mt-2 leading-relaxed">{item.desc}</p>
                               </div>
                               <button 
                                 className={cn(
                                   "w-12 h-6 rounded-full relative transition-all shadow-inner shrink-0",
                                   item.checked ? "bg-blue-600" : "bg-slate-200"
                                 )}
                               >
                                  <div className={cn(
                                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-lg",
                                    item.checked ? "right-1" : "left-1"
                                  )} />
                               </button>
                            </div>
                          ))}
                       </div>
                     </div>
                   </div>

                   <div className="space-y-10">
                     <div className="space-y-6">
                       <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                         <Globe size={16} className="text-blue-600" />
                         Global Operational Localization
                       </h3>
                       <div className="grid gap-8 p-10 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group/box">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[60px] rounded-full group-hover/box:bg-blue-600/20 transition-all opacity-20" />
                          
                          <div className="space-y-2 relative z-10">
                             <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Matrix Default Language</label>
                             <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group/opt cursor-pointer">
                                <span className="text-sm font-bold tracking-tight">Unified English (KSA Global)</span>
                                <ChevronRight size={16} className="text-white/20 group-hover/opt:translate-x-1 group-hover/opt:text-white transition-all" />
                             </div>
                          </div>

                          <div className="space-y-2 relative z-10">
                             <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Operational Pulse Range</label>
                             <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group/opt cursor-pointer">
                                <span className="text-sm font-bold tracking-tight">(GMT+03:00) Arabia Standard Time</span>
                                <ChevronRight size={16} className="text-white/20 group-hover/opt:translate-x-1 group-hover/opt:text-white transition-all" />
                             </div>
                          </div>

                          <div className="pt-8 border-t border-white/10 relative z-10 flex items-center justify-between opacity-40 group-hover/box:opacity-100 transition-opacity">
                             <p className="text-[9px] font-black uppercase tracking-widest italic">Nexus Sync: Riyadh Core Node</p>
                             <Zap size={14} className="text-amber-400" />
                          </div>
                       </div>

                       <div className="p-8 rounded-[2rem] bg-blue-50/50 border border-blue-100">
                          <div className="flex items-center gap-4 mb-4">
                             <div className="p-3 bg-white rounded-2xl text-blue-600 shadow-sm border border-blue-50">
                                <Cpu size={20} />
                             </div>
                             <div>
                                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-none">Intelligence Node</h4>
                                <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase italic">Core AI Core: Operational 99.2%</p>
                             </div>
                          </div>
                          <p className="text-[10px] font-medium text-slate-500 leading-relaxed italic">
                             "The system intelligence node is currently prioritizing localized routing algorithms for Jeddah West. High-priority nexus audit logs are being compiled for tomorrow's executive intelligence report."
                          </p>
                       </div>
                     </div>
                   </div>
                </div>
              )}
              {activeTab === 'API & Nexus' && (
                <div className="max-w-5xl space-y-10">
                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-6">
                         <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                            <Key size={16} className="text-blue-600" />
                            Nexus API Gateway
                         </h3>
                         <div className="space-y-4">
                            {[
                               { label: 'Fleet Telemetry Nexus', status: 'Healthy', latency: '12ms', calls: '4.2M' },
                               { label: 'IoT Bin Persistence', status: 'Operational', latency: '45ms', calls: '12.8M' },
                               { label: 'Facility ERP Sync', status: 'Synching', latency: '120ms', calls: '820K' },
                            ].map(api => (
                               <div key={api.label} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all">
                                  <div className="flex items-center gap-4">
                                     <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 shadow-sm">
                                        <Activity size={18} />
                                     </div>
                                     <div>
                                        <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight italic">{api.label}</p>
                                        <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mt-1">{api.status}</p>
                                     </div>
                                  </div>
                                  <div className="text-right">
                                     <p className="text-[11px] font-black text-slate-900 tabular-nums">{api.latency}</p>
                                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">{api.calls} Calls</p>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>

                      <div className="space-y-6">
                         <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                            <Lock size={16} className="text-blue-600" />
                            Security Protocol Keys
                         </h3>
                         <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl space-y-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                               <Lock size={100} />
                            </div>
                            <div className="space-y-4">
                               <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em]">Master Encryption Node</p>
                               <div className="p-4 bg-white/5 border border-white/10 rounded-xl font-mono text-[10px] break-all opacity-60 group-hover:opacity-100 transition-opacity">
                                  SHA256: 4f4e6f64655f69645f7365637572655f6b65795f3031
                               </div>
                            </div>
                            <button className="w-full py-4 bg-blue-600 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all active:scale-95">
                               Regenerate Nexus Token
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'Audit & Intelligence' && (
                <div className="space-y-10">
                   <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl space-y-8">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <History size={18} className="text-blue-600" />
                            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">Operational Integrity Audit</h3>
                         </div>
                         <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest px-4 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all border border-blue-100 shadow-sm">
                            Query Deep Audit Log
                         </button>
                      </div>
                      
                      <div className="space-y-3">
                         {[
                            { event: 'ADMIN_ACCESS_V4', user: 'Ahmed Hassan', target: 'Fleet Nexus Protocol', time: '14:22:15', status: 'VERIFIED' },
                            { event: 'CONFIG_MUTATION', user: 'Root Admin', target: 'SLA Resilience Index', time: '12:05:42', status: 'SIGNED' },
                            { event: 'DATA_EXPORT_BI', user: 'Sarah Ali', target: 'Executive Intelligence Matrix', time: '10:30:11', status: 'ENCRYPTED' },
                            { event: 'SYSTEM_SYNC_FAIL', user: 'INTELLIGENCE_NODE', target: 'Al-Khobar Sector B', time: '09:12:33', status: 'RECOVERED' },
                         ].map((log, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-50 hover:bg-white hover:border-slate-100 hover:shadow-lg transition-all group">
                               <div className="flex items-center gap-6">
                                  <span className="text-[9px] font-black text-slate-400 tabular-nums uppercase tracking-widest">{log.time}</span>
                                  <div className="flex flex-col">
                                     <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight italic">{log.event}</span>
                                     <span className="text-[8px] font-black text-slate-400 mt-1 uppercase tracking-widest">Protocol Integrity Check Pass</span>
                                  </div>
                               </div>
                               <div className="flex items-center gap-8">
                                  <div className="text-right">
                                     <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{log.user}</p>
                                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Target: {log.target}</p>
                                  </div>
                                  <div className="px-3 py-1 bg-white rounded-lg border border-slate-100 text-[8px] font-black text-slate-400 uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all shadow-sm">
                                     {log.status}
                                  </div>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
