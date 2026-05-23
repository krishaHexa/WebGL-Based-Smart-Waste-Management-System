import React, { ReactNode, useEffect } from 'react';
import Sidebar from '../components/navigation/Sidebar';
import Topbar from '../components/navigation/Topbar';
import SettingsModal from '../components/shared/SettingsModal';
import LogoutConfirmation from '../components/shared/LogoutConfirmation';
import { useUIStore } from '../store/uiStore';
import { useSettingsStore } from '../store/settingsStore';
import { useAuthStore } from '../store/authStore';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const { isSidebarOpen } = useUIStore();
  const { isRTL, language } = useSettingsStore();
  const { user } = useAuthStore();
  const { i18n } = useTranslation();

  const isFleetManager = user?.role === 'FLEET_MANAGER';
  const isFacilityManager = user?.role === 'FACILITY_MANAGER';
  const hideSidebar = isFleetManager || isFacilityManager;

  // Ensure i18n and store are synced on mount
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, []);

  return (
    <div 
      className="flex h-screen w-screen overflow-hidden bg-white text-slate-900 font-sans"
      dir="ltr"
    >
      {!hideSidebar && <Sidebar />}
      <div className="relative flex flex-1 flex-col min-w-0 overflow-hidden bg-slate-50">
        <Topbar />
        <main className="relative flex-1 overflow-y-auto overflow-x-hidden">
          {/* Content Wrapper */}
          <div className={cn(
            "relative z-10 w-full h-full text-slate-900",
            isRTL ? "text-right" : "text-left"
          )} dir={isRTL ? "rtl" : "ltr"}>
            {children}
          </div>
        </main>
      </div>
 
      {/* Global Modals */}
      <SettingsModal />
      <LogoutConfirmation />
    </div>
  );
};

export default RootLayout;
