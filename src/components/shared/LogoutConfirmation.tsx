import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, AlertCircle, X } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { useTranslation } from 'react-i18next';

const LogoutConfirmation: React.FC = () => {
  const { isLogoutConfirmOpen, toggleLogoutConfirm } = useSettingsStore();
  const { t } = useTranslation();

  if (!isLogoutConfirmOpen) return null;

  const handleLogout = () => {
    // Prototype: just reload to clear state and close modal
    window.location.reload();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => toggleLogoutConfirm(false)}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden p-8"
        >
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
               <LogOut size={32} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">{t('logoutModal.title')}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {t('logoutModal.message')}
              </p>
            </div>

            <div className="flex flex-col w-full gap-3 pt-2">
              <button 
                onClick={handleLogout}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-red-200 flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                {t('logoutModal.confirm')}
              </button>
              <button 
                onClick={() => toggleLogoutConfirm(false)}
                className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold text-sm transition-all active:scale-95"
              >
                {t('logoutModal.cancel')}
              </button>
            </div>
          </div>
          
          <button 
            onClick={() => toggleLogoutConfirm(false)}
            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400"
          >
            <X size={18} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LogoutConfirmation;
