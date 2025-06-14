// src/stores/uiStore.ts
import { create } from 'zustand';

interface UiState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: true, // Default to open on desktop
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
}));