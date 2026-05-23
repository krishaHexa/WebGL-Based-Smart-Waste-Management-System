import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Globe2, 
  ShieldCheck, 
  User, 
  Search, 
  Wifi, 
  WifiOff, 
  RefreshCcw, 
  Loader2, 
  AlertCircle, 
  PlayCircle, 
  Zap, 
  LogOut, 
  Settings, 
  ChevronDown, 
  Check,
  Menu,
  Maximize2,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useUIStore } from '../../store/uiStore';
import { useLoadingStore } from '../../store/loadingStore';
import { useIncidentStore } from '../../store/incidentStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const Topbar: React.FC = () => {
  const navigate = useNavigate();
  const { incidents, clearAllIncidents, removeIncident, setSelectedIncidentId } = useIncidentStore();
  const { language, setLanguage, toggleSettings, toggleLogoutConfirm, isRTL } = useSettingsStore();
  const { toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const { t, i18n } = useTranslation();
  
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const userRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const activeIncidentCount = incidents.filter(i => i.status !== 'resolved').length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (lng: 'en' | 'ar') => {
    setLanguage(lng);
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white flex items-center justify-between px-4 sm:px-8 z-40 sticky top-0 border-b border-slate-200" dir="ltr">
      {/* Left section */}
      <div className="flex items-center gap-2 sm:gap-6">
         <button 
           onClick={toggleSidebar}
           className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors"
         >
           <Menu size={20} />
         </button>

         <div className="hidden xs:flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.2)]" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('common.liveOperations', 'Live Operations')}</span>
         </div>
      </div>
  
      {/* Center section - Search */}
      <div className="flex-1 max-w-xl mx-4 sm:mx-12 overflow-hidden">
        <div className="relative group">
          <Search className={cn(
            "absolute top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors",
            isRTL ? "right-4" : "left-4"
          )} size={16} />
          <input 
            type="text" 
            placeholder={t('common.search', 'Search...')}
            dir={isRTL ? "rtl" : "ltr"}
            className={cn(
              "w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 text-xs focus:outline-none focus:border-blue-500/50 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-400 font-bold text-slate-700",
              isRTL ? "pr-10 pl-4 sm:pr-12 text-right" : "pl-10 pr-4 sm:pl-12 text-left"
            )}
          />
          <div className="absolute inset-y-0 right-4 hidden sm:flex items-center gap-2 pointer-events-none">
            <span className="text-[9px] font-black text-slate-300 border border-slate-200 px-1.5 rounded uppercase">Alt K</span>
          </div>
        </div>
      </div>
  
      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <div className="relative" ref={langRef}>
          <button 
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-2 h-9 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all text-slate-600 font-black text-[10px] uppercase tracking-widest bg-white shadow-sm"
          >
            <Globe2 size={14} className="text-slate-400" />
            <span>{language}</span>
            <ChevronDown size={12} className={cn("text-slate-400 transition-transform duration-200", isLangOpen && "rotate-180")} />
          </button>
  
          <AnimatePresence>
            {isLangOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute mt-2 w-40 bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden z-50 right-0 p-1.5"
              >
                <button 
                  onClick={() => handleLanguageChange('en')}
                  className="w-full px-4 py-2 text-[11px] font-black text-slate-600 hover:bg-slate-50 rounded-xl flex items-center justify-between"
                >
                  English {language === 'en' && <div className="h-1 w-1 rounded-full bg-blue-600" />}
                </button>
                <button 
                  onClick={() => handleLanguageChange('ar')}
                  className="w-full px-4 py-2 text-[11px] font-black text-slate-600 hover:bg-slate-50 rounded-xl flex items-center justify-between flex-row-reverse"
                >
                  العربية {language === 'ar' && <div className="h-1 w-1 rounded-full bg-blue-600" />}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-slate-500 shadow-sm"
          >
            <Bell size={18} />
            {activeIncidentCount > 0 && (
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
            )}
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute mt-2 w-96 bg-white border border-slate-200 shadow-2xl rounded-3xl overflow-hidden z-50 right-0"
              >
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Incident Feed</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Live Operational Stream</p>
                  </div>
                  <button 
                    onClick={clearAllIncidents}
                    className="text-[9px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
                  >
                    Clear All
                  </button>
                </div>
                
                <div className="flex border-b border-slate-100 bg-white">
                  {['All', 'Incidents', 'System'].map((cat, i) => (
                    <button 
                      key={cat}
                      className={cn(
                        "flex-1 py-2.5 text-[9px] font-black uppercase tracking-widest border-b-2 transition-all",
                        i === 0 ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="max-h-[380px] overflow-y-auto no-scrollbar bg-white">
                  {incidents.slice(0, 8).map((incident) => (
                    <div 
                      key={incident.id} 
                      className="p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-all group flex gap-4 relative"
                    >
                      <div 
                        className="flex-1 flex gap-4 pr-8"
                        onClick={() => {
                          setSelectedIncidentId(incident.id);
                          setIsNotifOpen(false);
                          navigate('/incidents');
                        }}
                      >
                        <div className={cn(
                          "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm border",
                          incident.severity === 'critical' ? "bg-red-50 text-white border-red-100" : "bg-amber-50 text-amber-600 border-amber-100"
                        )}>
                          <AlertCircle size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-0.5">
                            <p className="text-[11px] font-black text-slate-900 truncate uppercase tracking-tight">{incident.incidentType}</p>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">2m</span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-bold line-clamp-2 leading-relaxed">{incident.description}</p>
                          <div className="mt-2 flex items-center gap-2">
                             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{incident.incidentCode}</span>
                             <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">View Details →</span>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeIncident(incident.id);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 rounded-lg"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {incidents.length === 0 && (
                    <div className="py-16 flex flex-col items-center text-center px-10">
                       <Bell size={32} className="text-slate-100 mb-3" />
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] italic">Operational Calm</p>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => navigate('/incidents')}
                  className="w-full py-4 text-[9px] font-black text-slate-500 bg-slate-50 hover:bg-slate-100 transition-colors uppercase tracking-[0.3em] flex items-center justify-center gap-3 border-t border-slate-100"
                >
                  Enter Operational Log <Maximize2 size={12} className="text-blue-600" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
  
        {/* User Profile */}
        <div className="relative" ref={userRef}>
          <button 
            onClick={() => setIsUserOpen(!isUserOpen)}
            className="flex items-center p-1 rounded-2xl hover:bg-slate-50 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-blue-600/10 border-2 border-white overflow-hidden italic">
               {user?.avatar ? (
                 <img src={user.avatar} className="w-full h-full object-cover" alt="" />
               ) : (
                 user?.name?.split(' ').map(n => n[0]).join('') || 'AH'
               )}
            </div>
          </button>
  
          <AnimatePresence>
            {isUserOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute mt-2 w-64 bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden z-50 right-0"
              >
                <div className={cn("p-6 border-b border-slate-100 bg-slate-50/50", isRTL && "text-right")}>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.2)]" />
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em]">Live Shift</span>
                  </div>
                  <p className="text-sm font-black text-slate-900">{user?.name || 'Ahmed Hassan'}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Operator ID: OPS-8829</p>
                </div>
                <div className="p-2">
                  <button 
                    onClick={() => { setIsUserOpen(false); navigate('/admin'); }}
                    className="w-full px-4 py-2.5 text-[11px] font-black text-slate-600 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors uppercase tracking-tight"
                  >
                    <User size={14} className="text-slate-400" /> {t('common.profile', 'Operator Profile')}
                  </button>
                  <button 
                    onClick={() => { setIsUserOpen(false); toggleSettings(true); }}
                    className="w-full px-4 py-2.5 text-[11px] font-black text-slate-600 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors uppercase tracking-tight"
                  >
                    <Settings size={14} className="text-slate-400" /> {t('common.settings', 'System Config')}
                  </button>
                  
                  <div className="my-1.5 h-px bg-slate-100 mx-2" />
                  
                  <button 
                    onClick={() => { setIsUserOpen(false); handleLogout(); }}
                    className="w-full px-4 py-2.5 text-[11px] font-black text-red-500 hover:bg-red-50 rounded-xl flex items-center gap-3 transition-colors uppercase tracking-tight"
                  >
                    <LogOut size={14} /> {t('common.logout', 'Sign Out')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
