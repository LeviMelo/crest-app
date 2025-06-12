import { create } from 'zustand';
import { User } from '@/types';
import useProjectStore from './projectStore';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  activeProjectRoles: string[];
  login: (userData: User) => void;
  logout: () => void;
  setProjectRoles: (roles: string[]) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  activeProjectRoles: [],
  login: (userData) => set({ isAuthenticated: true, user: userData, activeProjectRoles: [] }),
  logout: () => {
    set({ isAuthenticated: false, user: null, activeProjectRoles: [] });
    useProjectStore.getState().clearActiveProject();
  },
  setProjectRoles: (roles) => set({ activeProjectRoles: roles }),
}));

// Mock actions for development
export const mockLogin = (userId: string) => {
  const user: User = {
    id: userId,
    name: userId === 'userLead123' ? 'Dr. User Lead' : 'Mock User',
    email: userId === 'userLead123' ? 'dr.lead@example.com' : 'mock.user@example.com',
  };
  useAuthStore.getState().login(user);
};

export const mockLogout = () => useAuthStore.getState().logout();

export default useAuthStore;