import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  language: 'en' | 'ar';
  isRTL: boolean;
  isSettingsOpen: boolean;
  isLogoutConfirmOpen: boolean;
  
  setLanguage: (lang: 'en' | 'ar') => void;
  toggleSettings: (open?: boolean) => void;
  toggleLogoutConfirm: (open?: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'en',
      isRTL: false,
      isSettingsOpen: false,
      isLogoutConfirmOpen: false,

      setLanguage: (lang) => {
        const isRTL = lang === 'ar';
        set({ language: lang, isRTL });
      },
      
      toggleSettings: (open) => set((state) => ({ 
        isSettingsOpen: open !== undefined ? open : !state.isSettingsOpen 
      })),
      
      toggleLogoutConfirm: (open) => set((state) => ({ 
        isLogoutConfirmOpen: open !== undefined ? open : !state.isLogoutConfirmOpen 
      })),
    }),
    {
      name: 'smart-waste-settings',
      partialize: (state) => ({ language: state.language, isRTL: state.isRTL }),
    }
  )
);
