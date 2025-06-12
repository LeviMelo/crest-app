// src/data/intraoperatoriaOptions.ts
export interface OptionInfo { value: string; label: string; }

export const procedimentoOptions: OptionInfo[] = [
    { value: 'broncoscopia_flexivel', label: 'Broncoscopia flexível' },
    { value: 'broncoscopia_rigida', label: 'Broncoscopia rígida' },
];