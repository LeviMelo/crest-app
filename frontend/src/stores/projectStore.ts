// src/stores/projectStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Project } from '@/types';
import { mockProjects } from '@/data/mockData';

interface ProjectState {
  availableProjects: Project[];
  activeProjectId: string | null;
  activeProjectDetails: Project | null;
  isLoading: boolean;
  error: string | null;
}

interface ProjectActions {
  fetchAvailableProjects: () => Promise<void>;
  setActiveProject: (projectId: string) => void;
  clearActiveProject: () => void;
  addProject: (newProject: Project) => void;
}

export const useProjectStore = create<ProjectState & ProjectActions>()(
  persist(
    (set, get) => ({
      // Initial state
      availableProjects: [],
      activeProjectId: null,
      activeProjectDetails: null,
      isLoading: false,
      error: null,

      // Actions
      fetchAvailableProjects: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 300)); 
          set({ availableProjects: mockProjects, isLoading: false });
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch projects';
          set({ error: errorMessage, isLoading: false });
          console.error("Error fetching projects:", errorMessage);
        }
      },
      setActiveProject: (projectId) => {
        const project = get().availableProjects.find(p => p.id === projectId);
        if (project) {
          set({ activeProjectId: projectId, activeProjectDetails: project, error: null });
        } else {
          set({ error: `Project with ID ${projectId} not found.`, activeProjectId: null, activeProjectDetails: null });
        }
      },
      clearActiveProject: () => {
        set({ activeProjectId: null, activeProjectDetails: null });
      },
      addProject: (newProject) => {
        set(state => ({
          availableProjects: [...state.availableProjects, newProject]
        }));
      },
    }),
    {
      name: 'crest-project-storage', 
      storage: createJSONStorage(() => localStorage), 
      partialize: (state) => ({ activeProjectId: state.activeProjectId }), // Only persist activeProjectId
    }
  )
);