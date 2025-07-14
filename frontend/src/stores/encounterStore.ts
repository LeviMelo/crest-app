// src/stores/encounterStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PatientInputData } from '@/types';
import { Form } from './formBuilderStore.v2';

export interface Encounter {
    id: string;
    projectId: string;
    submittedById: string;
    patientData: PatientInputData | null;
    status: 'In Progress' | 'Completed' | 'Flagged for Review';
    formSequence: Form[];
    currentFormIndex: number;
    allFormsData: { [formKey: string]: any };
    lastUpdateTimestamp: number;
    createdAt: number;
}

interface EncounterState {
    encounters: Encounter[];
}

interface EncounterActions {
    addEncounter: (encounter: Encounter) => void;
    updateEncounter: (encounterId: string, updates: Partial<Omit<Encounter, 'id'>>) => void;
    getEncountersByProject: (projectId: string) => Encounter[];
    getEncounterById: (encounterId: string) => Encounter | undefined;
    removeEncounter: (encounterId: string) => void;
}

export const useEncounterStore = create<EncounterState & EncounterActions>()(
    persist(
        (set, get) => ({
            encounters: [],
            addEncounter: (encounter) => set(state => ({ 
                encounters: [...state.encounters, encounter] 
            })),
            updateEncounter: (encounterId, updates) => set(state => ({
                encounters: state.encounters.map(enc => 
                    enc.id === encounterId 
                        ? { ...enc, ...updates, lastUpdateTimestamp: Date.now() } 
                        : enc
                )
            })),
            getEncountersByProject: (projectId) => {
                return get().encounters.filter(enc => enc.projectId === projectId);
            },
            getEncounterById: (encounterId) => {
                return get().encounters.find(enc => enc.id === encounterId);
            },
            removeEncounter: (encounterId) => set(state => ({
                encounters: state.encounters.filter(enc => enc.id !== encounterId)
            })),
        }),
        {
            name: 'crest-encounter-history-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
); 