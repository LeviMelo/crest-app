// src/types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ProjectMember {
  userId: string;
  roles: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  goals?: string; // <-- FIX: Added optional goals property
  members: ProjectMember[];
}

// Types for Dynamic Forms
export interface AutocompleteOption {
  value: string;
  label: string;
  [key: string]: any;
}

export interface SelectedItem {
  value: string;
  label: string;
  [key: string]: any;
}

export interface PatientInputData {
  initials: string;
  gender: string;
  dob: string;
  projectConsent: boolean;
}