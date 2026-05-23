import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Globe, Bell, Shield, User, Settings as SettingsIcon } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const SettingsModal: React.FC = () => {
  const { isSettingsOpen, toggleSettings, language, setLanguage } = useSettingsStore();
  const { t, i18n } = useTranslation();

  if (!isSettingsOpen) return null;

  const handleLanguageChange = (lng: 'en' | 'ar') => {
    setLanguage(lng);
    i18n.changeLanguage(lng);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => toggleSettings(false)}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <SettingsIcon size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{t('settings.header')}</h2>
                <p className="text-xs text-slate-500">v2.4.0 Operational Build</p>
              </div>
            </div>
            <button 
              onClick={() => toggleSettings(false)}
              className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Language Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Globe size={14} /> {t('settings.language')}
              </h3>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'en', label: 'English', sub: 'English (US/UK)' },
                  { id: 'ar', label: 'العربية', sub: 'اللغة العربية (KSA)' }
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => handleLanguageChange(lang.id as 'en' | 'ar')}
                    className={cn(
                      "w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between group",
                      language === lang.id 
                        ? "bg-blue-50 border-blue-200" 
                        : "bg-white border-slate-200 hover:border-blue-200 hover:bg-slate-50"
                    )}
                  >
                    <div>
                      <p className={cn("text-sm font-bold", language === lang.id ? "text-blue-700" : "text-slate-700")}>
                        {lang.label}
                      </p>
                      <p className="text-[10px] text-slate-400">{lang.sub}</p>
                    </div>
                    {language === lang.id && (
                      <div className="w-2 h-2 rounded-full bg-blue-600 shadow-sm shadow-blue-300" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Other Settings Placeholder */}
            <div className="space-y-6">
               <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Bell size={14} /> {t('settings.notifications')}
                  </h3>
                  <div className="space-y-3">
                     {[
                       { label: 'Critical Incident Alerts', checked: true },
                       { label: 'System Health Reports', checked: true },
                       { label: 'AI Optimization Tips', checked: false }
                     ].map(item => (
                       <label key={item.label} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
                          <span className="text-xs font-medium text-slate-700">{item.label}</span>
                          <input type="checkbox" defaultChecked={item.checked} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                       </label>
                     ))}
                  </div>
               </div>

               <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Shield size={14} /> Security
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center gap-3">
                     <User size={18} className="text-blue-400" />
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Current Session</p>
                        <p className="text-xs font-bold">Authorized Access Level 4</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
            <button 
              onClick={() => toggleSettings(false)}
              className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button 
              onClick={() => toggleSettings(false)}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              {t('common.save')}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SettingsModal;
