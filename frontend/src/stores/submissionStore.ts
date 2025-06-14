// src/stores/submissionStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PatientInputData } from '@/types';
import { FormSchema, FormUiSchema } from './formBuilderStore';

export interface FormDefinition {
  key: string; 
  name: string;
  version: string;
  schema: FormSchema;
  uiSchema: FormUiSchema;
}

interface SubmissionState {
  isEncounterActive: boolean;
  patientData: PatientInputData | null;
  formSequence: FormDefinition[];
  currentFormIndex: number; // -1: patient input, 0 to n-1: forms, n: review
  allFormsData: { [formKey: string]: any };
  lastUpdateTimestamp: number | null;
}

interface SubmissionActions {
  startNewEncounter: (patientData: PatientInputData, sequence: FormDefinition[]) => void;
  saveCurrentForm: (formKey: string, data: any) => void;
  setCurrentFormIndex: (index: number) => void;
  updatePatientData: (patientData: Partial<PatientInputData>) => void;
  completeAndClearEncounter: () => void;
}

const initialPatientState: PatientInputData = {
    initials: '',
    gender: '',
    dob: '',
    projectConsent: false,
}

const initialState: SubmissionState = {
  isEncounterActive: false,
  patientData: initialPatientState,
  formSequence: [],
  currentFormIndex: -1,
  allFormsData: {},
  lastUpdateTimestamp: null,
};

export const useSubmissionStore = create<SubmissionState & SubmissionActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      startNewEncounter: (patientData, sequence) => {
        set({
          isEncounterActive: true,
          patientData,
          formSequence: sequence,
          currentFormIndex: 0,
          allFormsData: {},
          lastUpdateTimestamp: Date.now(),
        });
      },
      saveCurrentForm: (formKey, data) => {
        set(state => ({
          allFormsData: { ...state.allFormsData, [formKey]: data },
          lastUpdateTimestamp: Date.now(),
        }));
      },
      setCurrentFormIndex: (index) => {
        const sequenceLength = get().formSequence.length;
        if (index >= -1 && index <= sequenceLength) {
          set({ currentFormIndex: index, lastUpdateTimestamp: Date.now() });
        }
      },
      updatePatientData: (updatedPatientData) => {
        set(state => ({
            patientData: { ...state.patientData!, ...updatedPatientData },
            lastUpdateTimestamp: Date.now(), // This was the only necessary change.
        }));
      },
      completeAndClearEncounter: () => {
        set({ ...initialState, patientData: initialPatientState });
      },
    }),
    {
      name: 'crest-submission-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);