import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  activeRegion: string;
  toggleSidebar: () => void;
  setRegion: (region: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  activeRegion: 'Centrum District',
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setRegion: (region) => set({ activeRegion: region }),
}));
