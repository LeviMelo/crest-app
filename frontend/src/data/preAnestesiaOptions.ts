// src/data/preAnestesiaOptions.ts
import { AutocompleteOption } from '@/types';

export const commonDiagnoses: AutocompleteOption[] = [
  { value: 'laringomalacia', label: 'Laringomalácia', icd10: 'J38.5' },
  { value: 'estenose_subglotica_congenita', label: 'Estenose subglótica congênita', icd10: 'Q31.1' },
];
export const allDiagnosesSample: AutocompleteOption[] = [
  ...commonDiagnoses,
  { value: 'estenose_traqueal_pos_intubacao', label: 'Estenose traqueal pós intubação', icd10: 'J95.5' }, 
];