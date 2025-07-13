import { Form } from '@/stores/formBuilderStore.v2';

export const recuperacaoPosAnestesicaForm: Omit<Form, 'id' | 'projectId' | 'createdAt' | 'updatedAt'> = {
  name: 'Recuperação Pós-Anestésica',
  description: 'Avaliação da recuperação pós-anestésica e intercorrências',
  version: '1.0.0',
  fields: [
    {
      id: 'tempo_recuperacao',
      type: 'single-choice',
      label: 'Tempo de Recuperação (Aldrette > 9)',
      description: 'Tempo para atingir escore de Aldrette maior que 9',
      required: true,
      defaultValue: null,
      validation: [
        { type: 'required', message: 'Tempo de recuperação é obrigatório' }
      ],
      options: {
        displayAs: 'radio',
        choices: [
          { value: 'ate_30', label: 'Até 30 minutos' },
          { value: 'ate_45', label: 'Até 45 minutos' },
          { value: 'entre_45_60', label: 'Entre 45-60 minutos' },
          { value: 'mais_60', label: '> 60 minutos' }
        ]
      },
      styling: { 
        color: '#10b981',
        width: 'normal'
      }
    },
    {
      id: 'nivel_dessaturacao_pos',
      type: 'single-choice',
      label: 'Nível de Dessaturação',
      description: 'Nível de dessaturação observado no pós-operatório, se ocorrido',
      required: false,
      defaultValue: null,
      validation: [],
      options: {
        displayAs: 'radio',
        choices: [
          { value: 'dessaturacao_85_92', label: 'Dessaturação (85-92%)' },
          { value: 'dessaturacao_75_85', label: 'Dessaturação (75-85%)' },
          { value: 'dessaturacao_lt_70', label: 'Dessaturação (<70%)' }
        ]
      },
      styling: { 
        color: '#dc2626',
        width: 'normal'
      }
    },
    {
      id: 'outras_queixas_pos',
      type: 'multiple-choice',
      label: 'Outras Queixas',
      description: 'Outras queixas observadas no pós-operatório',
      required: false,
      defaultValue: [],
      validation: [],
      options: {
        displayAs: 'button-group',
        choices: [
          { value: 'broncoespasmo', label: 'Broncoespasmo' },
          { value: 'laringoespasmo', label: 'Laringoespasmo' },
          { value: 'sangramento', label: 'Sangramento' },
          { value: 'tosse', label: 'Tosse' },
          { value: 'dor', label: 'Dor' },
          { value: 'vomitos', label: 'Vômitos' },
          { value: 'prurido', label: 'Prurido' },
          { value: 'sialorreia', label: 'Sialorreia' }
        ],
        textFallback: true,
        textFallbackLabel: 'Outra queixa'
      },
      styling: { 
        color: '#dc2626',
        width: 'normal'
      }
    }
  ],
  layout: {
    sections: [
      {
        id: 'tempo_recuperacao_section',
        title: 'Tempo de Recuperação',
        fields: ['tempo_recuperacao'],
        collapsed: false,
        styling: { 
          color: '#10b981',
          fontSize: 'base'
        }
      },
      {
        id: 'intercorrencias_queixas',
        title: 'Intercorrências / Queixas',
        fields: ['nivel_dessaturacao_pos', 'outras_queixas_pos'],
        collapsed: false,
        styling: { 
          color: '#dc2626',
          fontSize: 'base'
        }
      }
    ]
  }
}; 