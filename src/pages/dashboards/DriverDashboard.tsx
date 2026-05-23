import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useRouteStore } from '../../store/routeStore';
import { useFleetStore } from '../../store/fleetStore';
import { useCommunicationStore } from '../../store/communicationStore';
import { Navigation, List, CheckCircle2, AlertTriangle, Truck, Map as MapIcon, RotateCcw, Send, MessageSquare } from 'lucide-react';
import OperationalMap from '../../components/visualization/OperationalMap';
import { cn } from '../../lib/utils';

const DriverDashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { routes } = useRouteStore();
  const { vehicles } = useFleetStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Find assigned vehicle and route
  const { messages, addMessage, markAsRead } = useCommunicationStore();
  const [activeTab, setActiveTab] = React.useState<'map' | 'chat'>('map');
  const [chatMessage, setChatMessage] = React.useState('');

  // Find assigned vehicle and route
  const vehicle = vehicles.find(v => v.id === (user?.role === 'DRIVER' ? 'v1' : 'v1'));
  const assignedRoute = routes.find(r => r.assignedVehicleId === vehicle?.id);

  const sendMessage = () => {
    if (!chatMessage.trim() || !vehicle) return;
    addMessage({
      id: `msg-${Date.now()}`,
      senderId: 'DRIVER',
      receiverId: 'OPERATOR_1',
      text: chatMessage,
      timestamp: new Date().toISOString(),
      isRead: true,
      type: 'general'
    });
    setChatMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 font-sans lg:max-w-md lg:mx-auto lg:border-x lg:border-slate-200">
      {/* Mobile Top Header */}
      <div className="bg-slate-900 text-white p-6 sticky top-0 z-20">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-black text-xs">
                {user?.name.charAt(0)}
             </div>
             <div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Active Shift</p>
                <h1 className="text-sm font-black uppercase tracking-tight">{user?.name}</h1>
             </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
             <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {assignedRoute ? (
          <div className="p-4 space-y-4">
             {activeTab === 'map' ? (
               <>
                 {/* Map Preview */}
                 <div className="h-48 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
                    <OperationalMap />
                    <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                       <p className="text-[8px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Assigned Vector</p>
                       <p className="text-[10px] font-black text-blue-600 uppercase tabular-nums">{assignedRoute.routeCode}</p>
                    </div>
                 </div>

                 {/* Route Progress */}
                 <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                       <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Daily Progress</h2>
                       <span className="text-[10px] font-black text-blue-600 uppercase">4 / {assignedRoute.stops.length} Stops</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full w-[33%] bg-blue-600 rounded-full" />
                    </div>
                 </div>

                 {/* Stop List */}
                 <div className="space-y-3">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Itinerary</h3>
                    {assignedRoute.stops.map((stop, i) => {
                       const isCompleted = i < 4;
                       const isCurrent = i === 4;

                       return (
                         <div 
                            key={i} 
                            className={cn(
                               "p-4 rounded-3xl border transition-all flex items-center gap-4",
                               isCurrent ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20" : "bg-white border-slate-200 text-slate-600 opacity-70",
                               isCompleted && "bg-slate-50 border-slate-100 text-slate-300"
                            )}
                         >
                            <div className={cn(
                               "w-10 h-10 rounded-2xl flex items-center justify-center font-black",
                               isCurrent ? "bg-white text-blue-600" : "bg-slate-100 text-slate-400"
                            )}>
                               {isCompleted ? <CheckCircle2 size={18} /> : i + 1}
                            </div>
                            <div className="flex-1">
                               <p className="text-[10px] font-black uppercase tracking-tight">Stop Segment #{i + 1}</p>
                               <p className={cn("text-[8px] font-bold uppercase tracking-widest", isCurrent ? "text-blue-100" : "text-slate-400")}>
                                 {isCurrent ? 'Current Goal' : isCompleted ? 'Completed' : 'Waiting'}
                               </p>
                            </div>
                            {isCurrent && (
                               <button className="h-10 px-4 bg-white text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                  End
                               </button>
                            )}
                         </div>
                       );
                    })}
                 </div>
               </>
             ) : (
               <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[500px]">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                     <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">HQ Feed</h3>
                     <span className="text-[8px] font-black uppercase bg-emerald-50 text-emerald-600 px-2 py-1 rounded">Channel Secure</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                     {messages.filter(m => m.receiverId === vehicle?.id || m.senderId === 'DRIVER').map(m => (
                       <div key={m.id} className={cn(
                          "max-w-[80%] p-3 rounded-2xl text-[11px] leading-relaxed",
                          m.senderId === 'DRIVER' ? "bg-blue-600 text-white ml-auto rounded-tr-none" : "bg-slate-100 text-slate-900 rounded-tl-none font-medium"
                       )}>
                          {m.text}
                          <div className={cn("text-[7px] mt-1 uppercase font-black tracking-widest opacity-50 text-right")}>
                             {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                          </div>
                       </div>
                     ))}
                  </div>
                  <div className="p-4 border-t border-slate-100 flex gap-2">
                     <input 
                        type="text" 
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Type message..." 
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-blue-600/30"
                     />
                     <button 
                        onClick={sendMessage}
                        className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-90 transition-all">
                        <Send size={18} />
                     </button>
                  </div>
               </div>
             )}
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center h-full">
             <div className="w-16 h-16 rounded-[2rem] bg-slate-100 flex items-center justify-center text-slate-300 mb-4">
                <Truck size={32} />
             </div>
             <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">No Active Assignment</h2>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 leading-relaxed">Wait for dispatch activation from HQ Command.</p>
          </div>
        )}
      </div>

      {/* Mobile Bottom TabBar */}
      <div className="fixed bottom-6 left-6 right-6 lg:left-auto lg:right-auto lg:w-[calc(28rem-3rem)] h-16 bg-slate-900 rounded-2xl shadow-2xl flex items-center justify-around px-2 z-30 ring-1 ring-white/10">
         <button 
            onClick={() => setActiveTab('map')}
            className={cn("flex flex-col items-center justify-center gap-1 transition-colors", activeTab === 'map' ? "text-blue-500" : "text-slate-500 hover:text-white")}
         >
            <Navigation size={18} />
            <span className="text-[8px] font-black uppercase tracking-widest">MAP</span>
         </button>
         <button 
           onClick={() => setActiveTab('chat')}
           className={cn("flex flex-col items-center justify-center gap-1 transition-colors relative", activeTab === 'chat' ? "text-blue-500" : "text-slate-500 hover:text-white")}
         >
            <MessageSquare size={18} />
            <span className="text-[8px] font-black uppercase tracking-widest">CHAT</span>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-slate-900" />
         </button>
         <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20">
            <AlertTriangle size={18} />
         </div>
         <button className="flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-white">
            <Truck size={18} />
            <span className="text-[8px] font-black uppercase tracking-widest">FLEET</span>
         </button>
         <button 
             onClick={() => window.location.reload()}
             className="flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-white"
         >
            <RotateCcw size={18} />
            <span className="text-[8px] font-black uppercase tracking-widest">SYNC</span>
         </button>
      </div>
    </div>
  );
};

export default DriverDashboard;
