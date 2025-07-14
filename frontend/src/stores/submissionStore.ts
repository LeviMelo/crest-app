// src/stores/submissionStore.ts
import { create } from 'zustand';
import { PatientInputData } from '@/types';
import { Form } from './formBuilderStore.v2';
import { Encounter, useEncounterStore } from './encounterStore';

// The FormDefinition type alias is kept for any components that might still reference it.
export type { Form as FormDefinition };

interface SubmissionState {
  activeEncounterId: string | null;
  isEncounterActive: boolean;
  patientData: PatientInputData | null;
  formSequence: Form[];
  currentFormIndex: number; // 0: patient info, 1..n: forms, n+1: review
  allFormsData: { [formKey: string]: any };
  lastUpdateTimestamp: number | null;
}

interface SubmissionActions {
  loadEncounter: (encounter: Encounter) => void;
  updateLocalFormState: (formKey: string, data: any) => void;
  updatePatientData: (patientData: Partial<PatientInputData>) => void;
  setCurrentFormIndex: (index: number) => void;
  unloadEncounter: (status?: Encounter['status']) => void;
  clearStore: () => void;
}

const initialPatientState: PatientInputData = {
    initials: '',
    gender: '',
    dob: '',
    projectConsent: false,
}

const initialState: SubmissionState = {
  activeEncounterId: null,
  isEncounterActive: false,
  patientData: initialPatientState,
  formSequence: [],
  currentFormIndex: -1,
  allFormsData: {},
  lastUpdateTimestamp: null,
};

// NO LONGER PERSISTED. This is a temporary session store.
export const useSubmissionStore = create<SubmissionState & SubmissionActions>()((set, get) => ({
    ...initialState,
    
    loadEncounter: (encounter) => {
        set({
            activeEncounterId: encounter.id,
            isEncounterActive: true,
            patientData: encounter.patientData,
            formSequence: encounter.formSequence,
            currentFormIndex: encounter.currentFormIndex,
            allFormsData: encounter.allFormsData,
            lastUpdateTimestamp: encounter.lastUpdateTimestamp,
        });
    },

    updateLocalFormState: (formKey, data) => {
        set(state => ({
          allFormsData: { ...state.allFormsData, [formKey]: data },
          lastUpdateTimestamp: Date.now(),
        }));
    },

    updatePatientData: (patientData) => {
        set(state => ({
            patientData: { ...state.patientData!, ...patientData },
            lastUpdateTimestamp: Date.now(),
        }));
    },

    setCurrentFormIndex: (index) => {
        const sequenceLength = get().formSequence.length;
        // FIX: Allow navigating to the review step, which is at index `sequenceLength + 1`
        if (index >= 0 && index <= sequenceLength + 1) {
            set({ currentFormIndex: index, lastUpdateTimestamp: Date.now() });
        }
    },
    
    unloadEncounter: (status = 'In Progress') => {
        const { activeEncounterId, patientData, formSequence, currentFormIndex, allFormsData } = get();
        if (activeEncounterId) {
            useEncounterStore.getState().updateEncounter(activeEncounterId, {
                patientData,
                formSequence,
                currentFormIndex,
                allFormsData,
                status,
            });
        }
        set(initialState);
    },

    clearStore: () => {
        set(initialState);
    }
}));