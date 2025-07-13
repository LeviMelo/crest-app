import { Form } from '@/stores/formBuilderStore.v2';

export const preAnestesiaForm: Omit<Form, 'id' | 'projectId' | 'createdAt' | 'updatedAt'> = {
  name: 'Avaliação Pré-Anestésica',
  description: 'Coleta de dados demográficos, diagnósticos, comorbidades e queixas do paciente',
  version: '1.0.0',
  fields: [
    // Basic patient info
    {
      id: 'idade',
      type: 'number',
      label: 'Idade',
      description: 'Idade do paciente em anos',
      required: true,
      defaultValue: null,
      validation: [
        { type: 'required', message: 'Idade é obrigatória' },
        { type: 'min', value: 0, message: 'Idade deve ser maior que 0' },
        { type: 'max', value: 120, message: 'Idade deve ser menor que 120' }
      ],
      options: { 
        unit: 'anos',
        enabledInputs: ['inputBox']
      },
      styling: { 
        color: '#3b82f6',
        width: 'compact'
      }
    },
    {
      id: 'peso',
      type: 'number',
      label: 'Peso',
      description: 'Peso do paciente em quilogramas',
      required: true,
      defaultValue: null,
      validation: [
        { type: 'required', message: 'Peso é obrigatório' },
        { type: 'min', value: 0.1, message: 'Peso deve ser maior que 0.1kg' },
        { type: 'max', value: 300, message: 'Peso deve ser menor que 300kg' }
      ],
      options: { 
        unit: 'kg',
        enabledInputs: ['inputBox']
      },
      styling: { 
        color: '#3b82f6',
        width: 'compact'
      }
    },
    {
      id: 'sexo',
      type: 'single-choice',
      label: 'Sexo',
      description: 'Sexo biológico do paciente',
      required: true,
      defaultValue: null,
      validation: [
        { type: 'required', message: 'Sexo é obrigatório' }
      ],
      options: {
        displayAs: 'dropdown',
        choices: [
          { value: 'F', label: 'Feminino' },
          { value: 'M', label: 'Masculino' }
        ]
      },
      styling: { 
        color: '#3b82f6',
        width: 'compact'
      }
    },
    // Diagnoses with autocomplete
    {
      id: 'diagnosticos',
      type: 'multiple-choice',
      label: 'Diagnóstico(s)',
      description: 'Diagnósticos médicos relevantes',
      required: false,
      defaultValue: [],
      validation: [],
      options: {
        displayAs: 'button-group',
        choices: [
          { value: 'laringomalacia', label: 'Laringomalácia' },
          { value: 'estenose_subglotica_congenita', label: 'Estenose subglótica congênita' },
          { value: 'fistula_traqueoesofagica', label: 'Fístula traqueoesofágica' },
          { value: 'cleft_laringeo', label: 'Cleft laríngeo' },
          { value: 'paralisia_bilateral_cordas_vocais', label: 'Paralisia bilateral de cordas vocais' },
          { value: 'estenose_traqueal_pos_intubacao', label: 'Estenose traqueal pós intubação' },
          { value: 'colapso_traqueal_congenito', label: 'Colapso traqueal congênito' },
          { value: 'fibroma_epifaringeo', label: 'Fibroma epifaringeo' },
          { value: 'estreitamento_arvore_bronquica', label: 'Estreitamento da árvore brônquica' },
          { value: 'anel_vascular', label: 'Anel vascular' },
          { value: 'cisto_broncogenico', label: 'Cisto broncogênico' },
          { value: 'cisto_paravalecular', label: 'Cisto paravalecular' },
          { value: 'fistula_traqueopleural', label: 'Fístula traqueopleural' },
          { value: 'papilomatose_respiratoria_recorrente', label: 'Papilomatose respiratória recorrente' },
          { value: 'hemangioma_subglotico', label: 'Hemangioma subglótico' },
          { value: 'corpo_estranho', label: 'Corpo estranho' }
        ],
        textFallback: true,
        textFallbackLabel: 'Outro diagnóstico'
      },
      styling: { 
        color: '#10b981',
        width: 'normal'
      }
    },
    // Comorbidities with autocomplete
    {
      id: 'comorbidades',
      type: 'multiple-choice',
      label: 'Comorbidade(s)',
      description: 'Condições médicas concomitantes',
      required: false,
      defaultValue: [],
      validation: [],
      options: {
        displayAs: 'button-group',
        choices: [
          { value: 'prematuridade', label: 'Prematuridade' },
          { value: 'cardiopatia_congenita', label: 'Cardiopatia congênita' },
          { value: 'asma', label: 'Asma' },
          { value: 'sindrome_pierre_robin', label: 'Síndrome de Pierre Robin' },
          { value: 'doenca_neurologica', label: 'Doença Neurológica' },
          { value: 'fibrose_cistica', label: 'Fibrose cística' },
          { value: 'tuberculose', label: 'Tuberculose' },
          { value: 'malformacao_pulmonar', label: 'Malformação pulmonar' },
          { value: 'imunodeficiencia', label: 'Imunodeficiência' },
          { value: 'disturbio_metabolico', label: 'Distúrbio metabólico' }
        ],
        textFallback: true,
        textFallbackLabel: 'Outra comorbidade'
      },
      styling: { 
        color: '#f59e0b',
        width: 'normal'
      }
    },
    // Complaints with autocomplete
    {
      id: 'queixas',
      type: 'multiple-choice',
      label: 'Queixa(s)',
      description: 'Principais queixas clínicas',
      required: false,
      defaultValue: [],
      validation: [],
      options: {
        displayAs: 'button-group',
        choices: [
          { value: 'tosse_cronica', label: 'Tosse crônica' },
          { value: 'estridor', label: 'Estridor' },
          { value: 'infeccoes_respiratorias_recorrentes', label: 'Infecções respiratórias recorrentes' },
          { value: 'sibilancia', label: 'Sibilância' },
          { value: 'sangramento', label: 'Sangramento' },
          { value: 'atelectasia', label: 'Atelectasia' }
        ],
        textFallback: true,
        textFallbackLabel: 'Outra queixa'
      },
      styling: { 
        color: '#ef4444',
        width: 'normal'
      }
    }
  ],
  layout: {
    sections: [
      {
        id: 'dados_basicos',
        title: 'Dados Básicos',
        fields: ['idade', 'peso', 'sexo'],
        collapsed: false,
        styling: { 
          color: '#6366f1',
          fontSize: 'base'
        }
      },
      {
        id: 'condicoes_medicas',
        title: 'Condições Médicas',
        fields: ['diagnosticos', 'comorbidades', 'queixas'],
        collapsed: false,
        styling: { 
          color: '#8b5cf6',
          fontSize: 'base'
        }
      }
    ]
  }
}; 