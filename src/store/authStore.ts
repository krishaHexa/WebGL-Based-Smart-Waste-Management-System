import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'SUPER_ADMIN' | 'FACILITY_MANAGER' | 'FLEET_MANAGER' | 'CCTV_OPERATOR' | 'DRIVER' | 'CITIZEN' | 'DISPATCH_OPERATOR' | 'FLEET_SUPERVISOR';

interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const DEMO_USERS: Record<string, User> = {
  'admin@smartwaste.sa': {
    id: 'u-1',
    name: 'Ahmed Al-Saud',
    role: 'SUPER_ADMIN',
    email: 'admin@smartwaste.sa',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  },
  'facility@smartwaste.sa': {
    id: 'u-2',
    name: 'Faisal Ibrahim',
    role: 'FACILITY_MANAGER',
    email: 'facility@smartwaste.sa',
  },
  'fleet@smartwaste.sa': {
    id: 'u-3',
    name: 'Omar Mansour',
    role: 'FLEET_MANAGER',
    email: 'fleet@smartwaste.sa',
  },
  'dispatch@smartwaste.sa': {
    id: 'u-7',
    name: 'Sarah Rahman',
    role: 'DISPATCH_OPERATOR',
    email: 'dispatch@smartwaste.sa',
  },
  'supervisor@smartwaste.sa': {
    id: 'u-8',
    name: 'Hassan Aziz',
    role: 'FLEET_SUPERVISOR',
    email: 'supervisor@smartwaste.sa',
  },
  'cctv@smartwaste.sa': {
    id: 'u-4',
    name: 'Khalid Abdullah',
    role: 'CCTV_OPERATOR',
    email: 'cctv@smartwaste.sa',
  },
  'driver@smartwaste.sa': {
    id: 'u-5',
    name: 'Saeed Hassan',
    role: 'DRIVER',
    email: 'driver@smartwaste.sa',
    phone: '+966 50 123 4567'
  },
  'citizen@ksa.sa': {
    id: 'u-6',
    name: 'Mohammed Kareem',
    role: 'CITIZEN',
    email: 'citizen@ksa.sa',
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email, password) => {
        // Simple demo authentication - any password works for these emails
        const user = DEMO_USERS[email];
        if (user && password === 'ksa2025') {
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'ksa-waste-auth-v3',
    }
  )
);
