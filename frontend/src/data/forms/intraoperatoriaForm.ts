import { Form } from '@/stores/formBuilderStore.v2';

export const intraoperatoriaForm: Omit<Form, 'id' | 'projectId' | 'createdAt' | 'updatedAt'> = {
  name: 'Intraoperatória',
  description: 'Registro de procedimentos, medicamentos e intercorrências durante a cirurgia',
  version: '1.0.0',
  fields: [
    // Procedure and anesthesia
    {
      id: 'procedimento',
      type: 'single-choice',
      label: 'Procedimento',
      description: 'Tipo de procedimento realizado',
      required: true,
      defaultValue: null,
      validation: [
        { type: 'required', message: 'Procedimento é obrigatório' }
      ],
      options: {
        displayAs: 'dropdown',
        choices: [
          { value: 'broncoscopia_flexivel', label: 'Broncoscopia flexível' },
          { value: 'broncoscopia_rigida', label: 'Broncoscopia rígida' },
          { value: 'traqueoscopia', label: 'Traqueoscopia' },
          { value: 'dilatacao_traqueal', label: 'Dilatação Traqueal' },
          { value: 'traqueoplastia', label: 'Traqueoplastia' }
        ]
      },
      styling: { 
        color: '#3b82f6',
        width: 'normal'
      }
    },
    {
      id: 'anestesia',
      type: 'single-choice',
      label: 'Anestesia',
      description: 'Tipo de anestesia utilizada',
      required: true,
      defaultValue: null,
      validation: [
        { type: 'required', message: 'Tipo de anestesia é obrigatório' }
      ],
      options: {
        displayAs: 'dropdown',
        choices: [
          { value: 'geral', label: 'Geral' },
          { value: 'sedacao_profunda', label: 'Sedação Profunda' }
        ]
      },
      styling: { 
        color: '#3b82f6',
        width: 'normal'
      }
    },
    // Induction drugs (togglable)
    {
      id: 'lidocaina',
      type: 'number',
      label: 'Lidocaína',
      description: 'Dose utilizada em mg',
      required: false,
      defaultValue: null,
      validation: [
        { type: 'min', value: 0, message: 'Dose deve ser maior que 0' }
      ],
      options: { 
        unit: 'mg',
        enabledInputs: ['inputBox'],
        togglable: true
      },
      styling: { 
        color: '#10b981',
        width: 'compact'
      }
    },
    {
      id: 'fentanil',
      type: 'number',
      label: 'Fentanil',
      description: 'Dose utilizada em mcg',
      required: false,
      defaultValue: null,
      validation: [
        { type: 'min', value: 0, message: 'Dose deve ser maior que 0' }
      ],
      options: { 
        unit: 'mcg',
        enabledInputs: ['inputBox'],
        togglable: true
      },
      styling: { 
        color: '#10b981',
        width: 'compact'
      }
    },
    {
      id: 'sufentanil',
      type: 'number',
      label: 'Sufentanil',
      description: 'Dose utilizada em mcg',
      required: false,
      defaultValue: null,
      validation: [
        { type: 'min', value: 0, message: 'Dose deve ser maior que 0' }
      ],
      options: { 
        unit: 'mcg',
        enabledInputs: ['inputBox'],
        togglable: true
      },
      styling: { 
        color: '#10b981',
        width: 'compact'
      }
    },
    {
      id: 'alfentanil',
      type: 'number',
      label: 'Alfentanil',
      description: 'Dose utilizada em mcg',
      required: false,
      defaultValue: null,
      validation: [
        { type: 'min', value: 0, message: 'Dose deve ser maior que 0' }
      ],
      options: { 
        unit: 'mcg',
        enabledInputs: ['inputBox'],
        togglable: true
      },
      styling: { 
        color: '#10b981',
        width: 'compact'
      }
    },
    {
      id: 'dexmedetomidina_inducao',
      type: 'number',
      label: 'Dexmedetomidina',
      description: 'Dose utilizada em mcg',
      required: false,
      defaultValue: null,
      validation: [
        { type: 'min', value: 0, message: 'Dose deve ser maior que 0' }
      ],
      options: { 
        unit: 'mcg',
        enabledInputs: ['inputBox'],
        togglable: true
      },
      styling: { 
        color: '#10b981',
        width: 'compact'
      }
    },
    {
      id: 'cetamina',
      type: 'number',
      label: 'Cetamina',
      description: 'Dose utilizada em mg',
      required: false,
      defaultValue: null,
      validation: [
        { type: 'min', value: 0, message: 'Dose deve ser maior que 0' }
      ],
      options: { 
        unit: 'mg',
        enabledInputs: ['inputBox'],
        togglable: true
      },
      styling: { 
        color: '#10b981',
        width: 'compact'
      }
    },
    {
      id: 'midazolam',
      type: 'number',
      label: 'Midazolam',
      description: 'Dose utilizada em mg',
      required: false,
      defaultValue: null,
      validation: [
        { type: 'min', value: 0, message: 'Dose deve ser maior que 0' }
      ],
      options: { 
        unit: 'mg',
        enabledInputs: ['inputBox'],
        togglable: true
      },
      styling: { 
        color: '#10b981',
        width: 'compact'
      }
    },
    {
      id: 'propofol_inducao',
      type: 'number',
      label: 'Propofol',
      description: 'Dose utilizada em mg',
      required: false,
      defaultValue: null,
      validation: [
        { type: 'min', value: 0, message: 'Dose deve ser maior que 0' }
      ],
      options: { 
        unit: 'mg',
        enabledInputs: ['inputBox'],
        togglable: true
      },
      styling: { 
        color: '#10b981',
        width: 'compact'
      }
    },
    {
      id: 'etomidato',
      type: 'number',
      label: 'Etomidato',
      description: 'Dose utilizada em mg',
      required: false,
      defaultValue: null,
      validation: [
        { type: 'min', value: 0, message: 'Dose deve ser maior que 0' }
      ],
      options: { 
        unit: 'mg',
        enabledInputs: ['inputBox'],
        togglable: true
      },
      styling: { 
        color: '#10b981',
        width: 'compact'
      }
    },
    {
      id: 'sevoflurano_inducao',
      type: 'text',
      label: 'Sevoflurano',
      description: 'Concentração utilizada em %',
      required: false,
      defaultValue: null,
      validation: [],
      options: { 
        togglable: true
      },
      styling: { 
        color: '#10b981',
        width: 'compact'
      }
    },
    // Maintenance drugs (togglable)
    {
      id: 'remifentanil',
      type: 'number',
      label: 'Remifentanil',
      description: 'Dose utilizada em mcg/kg/min',
      required: false,
      defaultValue: null,
      validation: [
        { type: 'min', value: 0, message: 'Dose deve ser maior que 0' }
      ],
      options: { 
        unit: 'mcg/kg/min',
        enabledInputs: ['inputBox'],
        togglable: true
      },
      styling: { 
        color: '#f59e0b',
        width: 'compact'
      }
    },
    {
      id: 'propofol_manutencao',
      type: 'number',
      label: 'Propofol',
      description: 'Dose utilizada em mcg/kg/min',
      required: false,
      defaultValue: null,
      validation: [
        { type: 'min', value: 0, message: 'Dose deve ser maior que 0' }
      ],
      options: { 
        unit: 'mcg/kg/min',
        enabledInputs: ['inputBox'],
        togglable: true
      },
      styling: { 
        color: '#f59e0b',
        width: 'compact'
      }
    },
    {
      id: 'dexmedetomidina_manutencao',
      type: 'number',
      label: 'Dexmedetomidina',
      description: 'Dose utilizada em mcg/kg/h',
      required: false,
      defaultValue: null,
      validation: [
        { type: 'min', value: 0, message: 'Dose deve ser maior que 0' }
      ],
      options: { 
        unit: 'mcg/kg/h',
        enabledInputs: ['inputBox'],
        togglable: true
      },
      styling: { 
        color: '#f59e0b',
        width: 'compact'
      }
    },
    {
      id: 'sevoflurano_manutencao',
      type: 'text',
      label: 'Sevoflurano',
      description: 'Concentração utilizada em %',
      required: false,
      defaultValue: null,
      validation: [],
      options: { 
        togglable: true
      },
      styling: { 
        color: '#f59e0b',
        width: 'compact'
      }
    },
    // Adjuvant drugs (togglable)
    {
      id: 'clonidina',
      type: 'number',
      label: 'Clonidina',
      description: 'Dose utilizada em mcg',
      required: false,
      defaultValue: null,
      validation: [
        { type: 'min', value: 0, message: 'Dose deve ser maior que 0' }
      ],
      options: { 
        unit: 'mcg',
        enabledInputs: ['inputBox'],
        togglable: true
      },
      styling: { 
        color: '#8b5cf6',
        width: 'compact'
      }
    },
    {
      id: 'sulfato_magnesio',
      type: 'number',
      label: 'Sulfato de Magnésio',
      description: 'Dose utilizada em mg',
      required: false,
      defaultValue: null,
      validation: [
        { type: 'min', value: 0, message: 'Dose deve ser maior que 0' }
      ],
      options: { 
        unit: 'mg',
        enabledInputs: ['inputBox'],
        togglable: true
      },
      styling: { 
        color: '#8b5cf6',
        width: 'compact'
      }
    },
    // Symptomatic drugs (togglable)
    {
      id: 'dipirona',
      type: 'number',
      label: 'Dipirona',
      description: 'Dose utilizada em mg',
      required: false,
      defaultValue: null,
      validation: [
        { type: 'min', value: 0, message: 'Dose deve ser maior que 0' }
      ],
      options: { 
        unit: 'mg',
        enabledInputs: ['inputBox'],
        togglable: true
      },
      styling: { 
        color: '#ef4444',
        width: 'compact'
      }
    },
    {
      id: 'ondansetrona',
      type: 'number',
      label: 'Ondansetrona',
      description: 'Dose utilizada em mg',
      required: false,
      defaultValue: null,
      validation: [
        { type: 'min', value: 0, message: 'Dose deve ser maior que 0' }
      ],
      options: { 
        unit: 'mg',
        enabledInputs: ['inputBox'],
        togglable: true
      },
      styling: { 
        color: '#ef4444',
        width: 'compact'
      }
    },
    {
      id: 'salbutamol',
      type: 'number',
      label: 'Salbutamol',
      description: 'Número de puffs',
      required: false,
      defaultValue: null,
      validation: [
        { type: 'min', value: 0, message: 'Número de puffs deve ser maior que 0' }
      ],
      options: { 
        unit: 'puffs',
        enabledInputs: ['inputBox'],
        togglable: true
      },
      styling: { 
        color: '#ef4444',
        width: 'compact'
      }
    },
    {
      id: 'dexametasona',
      type: 'number',
      label: 'Dexametasona',
      description: 'Dose utilizada em mg',
      required: false,
      defaultValue: null,
      validation: [
        { type: 'min', value: 0, message: 'Dose deve ser maior que 0' }
      ],
      options: { 
        unit: 'mg',
        enabledInputs: ['inputBox'],
        togglable: true
      },
      styling: { 
        color: '#ef4444',
        width: 'compact'
      }
    },
    // Support and complications
    {
      id: 'suporte_oxigenio',
      type: 'multiple-choice',
      label: 'Suporte de Oxigênio',
      description: 'Métodos de suporte de oxigênio utilizados',
      required: false,
      defaultValue: [],
      validation: [],
      options: {
        displayAs: 'button-group',
        choices: [
          { value: 'cateter_nasal', label: 'Cateter nasal' },
          { value: 'sonda_aspiracao_periglotica', label: 'Sonda de aspiração periglótica' }
        ]
      },
      styling: { 
        color: '#06b6d4',
        width: 'normal'
      }
    },
    {
      id: 'suporte_ventilatorio',
      type: 'multiple-choice',
      label: 'Suporte Ventilatório',
      description: 'Métodos de suporte ventilatório utilizados',
      required: false,
      defaultValue: [],
      validation: [],
      options: {
        displayAs: 'button-group',
        choices: [
          { value: 'mascara_laringea', label: 'Máscara laríngea' },
          { value: 'tubo_orotraqueal', label: 'Tubo orotraqueal' }
        ]
      },
      styling: { 
        color: '#06b6d4',
        width: 'normal'
      }
    },
    {
      id: 'nivel_dessaturacao',
      type: 'single-choice',
      label: 'Nível de Dessaturação',
      description: 'Nível de dessaturação observado, se ocorrido',
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
      id: 'outras_intercorrencias',
      type: 'multiple-choice',
      label: 'Outras Intercorrências',
      description: 'Outras intercorrências observadas',
      required: false,
      defaultValue: [],
      validation: [],
      options: {
        displayAs: 'button-group',
        choices: [
          { value: 'broncoespasmo', label: 'Broncoespasmo' },
          { value: 'laringoespasmo', label: 'Laringoespasmo' },
          { value: 'sangramento', label: 'Sangramento' },
          { value: 'reflexo_tosse_nao_abolido', label: 'Reflexo de tosse não abolido' }
        ]
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
        id: 'procedimento_anestesia',
        title: 'Procedimento e Anestesia',
        fields: ['procedimento', 'anestesia'],
        collapsed: false,
        styling: { 
          color: '#3b82f6',
          fontSize: 'base'
        }
      },
      {
        id: 'farmacos_inducao',
        title: 'Fármacos para Indução',
        fields: ['lidocaina', 'fentanil', 'sufentanil', 'alfentanil', 'dexmedetomidina_inducao', 'cetamina', 'midazolam', 'propofol_inducao', 'etomidato', 'sevoflurano_inducao'],
        collapsed: false,
        styling: { 
          color: '#10b981',
          fontSize: 'base'
        }
      },
      {
        id: 'farmacos_manutencao',
        title: 'Fármacos para Manutenção',
        fields: ['remifentanil', 'propofol_manutencao', 'dexmedetomidina_manutencao', 'sevoflurano_manutencao'],
        collapsed: false,
        styling: { 
          color: '#f59e0b',
          fontSize: 'base'
        }
      },
      {
        id: 'farmacos_adjuvantes',
        title: 'Fármacos Adjuvantes',
        fields: ['clonidina', 'sulfato_magnesio'],
        collapsed: false,
        styling: { 
          color: '#8b5cf6',
          fontSize: 'base'
        }
      },
      {
        id: 'sintomaticos',
        title: 'Sintomáticos',
        fields: ['dipirona', 'ondansetrona', 'salbutamol', 'dexametasona'],
        collapsed: false,
        styling: { 
          color: '#ef4444',
          fontSize: 'base'
        }
      },
      {
        id: 'suporte_intercorrencias',
        title: 'Suporte e Intercorrências',
        fields: ['suporte_oxigenio', 'suporte_ventilatorio', 'nivel_dessaturacao', 'outras_intercorrencias'],
        collapsed: false,
        styling: { 
          color: '#dc2626',
          fontSize: 'base'
        }
      }
    ]
  }
}; 