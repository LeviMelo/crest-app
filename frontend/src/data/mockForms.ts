import { FormSchema, FormUiSchema } from "@/stores/formBuilderStore";

export interface SavedForm {
    id: string;
    projectId: string;
    name: string;
    schema: FormSchema;
    uiSchema: FormUiSchema;
}

const preAnestesiaForm: SavedForm = {
    id: 'form_pre_anestesia_001',
    projectId: 'proj_crest_001',
    name: 'Avaliação Pré-Anestésica',
    schema: {
        title: 'Avaliação Pré-Anestésica',
        description: 'Formulário para coleta de dados do paciente antes do procedimento.',
        type: 'object',
        properties: {
            "section_basic_info": {
                type: "object",
                title: "Informações Básicas",
                properties: {
                    idade: { type: 'number', title: 'Idade (anos)' },
                    peso: { type: 'number', title: 'Peso (kg)' },
                    sexo: { type: 'string', title: 'Sexo', enum: ['F', 'M'], enumNames: ['Feminino', 'Masculino'] }
                }
            },
            "section_history": {
                type: "object",
                title: "Histórico Clínico",
                properties: {
                    diagnosticos: {
                        type: 'array', title: 'Diagnóstico(s)',
                        items: { type: 'string', enum: ['laringomalacia', 'estenose_subglotica_congenita', 'fistula_traqueoesofagica', 'cleft_laringeo', 'paralisia_bilateral_cordas_vocais', 'estenose_traqueal_pos_intubacao', 'colapso_traqueal_congenito', 'fibroma_epifaringeo', 'estreitamento_arvore_bronquica', 'anel_vascular', 'cisto_broncogenico', 'cisto_paravalecular', 'fistula_traqueopleural', 'papilomatose_respiratoria_recorrente', 'hemangioma_subglotico', 'corpo_estranho'] },
                        uniqueItems: true
                    },
                    comorbidades: {
                        type: 'array', title: 'Comorbidade(s)',
                        items: { type: 'string', enum: ['prematuridade', 'cardiopatia_congenita', 'asma', 'sindrome_pierre_robin', 'doenca_neurologica', 'fibrose_cistica', 'tuberculose', 'malformacao_pulmonar', 'imunodeficiencia', 'disturbio_metabolico'] },
                        uniqueItems: true
                    },
                    queixas: {
                        type: 'array', title: 'Queixa(s)',
                        items: { type: 'string', enum: ['tosse_cronica', 'estridor', 'infeccoes_respiratorias_recorrentes', 'sibilancia', 'sangramento', 'atelectasia'] },
                        uniqueItems: true
                    }
                }
            }
        }
    },
    uiSchema: {
        'ui:root': { 'ui:order': ['section_basic_info', 'section_history'] },
        'section_basic_info': { 'ui:widget': 'SectionWidget', 'ui:order': ['idade', 'peso', 'sexo'], 'ui:options': { columns: 3 } },
        'idade': { 'ui:widget': 'NumberWidget' },
        'peso': { 'ui:widget': 'NumberWidget' },
        'sexo': { 'ui:widget': 'ChoiceWidget', 'ui:options': { displayAs: 'dropdown' } },
        'section_history': { 'ui:widget': 'SectionWidget', 'ui:order': ['diagnosticos', 'comorbidades', 'queixas'], 'ui:options': { columns: 3 } },
        'diagnosticos': { 'ui:widget': 'ChoiceWidget', 'ui:options': { displayAs: 'autocompleteTags', quickOptions: ['laringomalacia', 'estenose_subglotica_congenita', 'fistula_traqueoesofagica'] } },
        'comorbidades': { 'ui:widget': 'ChoiceWidget', 'ui:options': { displayAs: 'autocompleteTags', quickOptions: ['prematuridade', 'cardiopatia_congenita', 'asma'] } },
        'queixas': { 'ui:widget': 'ChoiceWidget', 'ui:options': { displayAs: 'autocompleteTags', quickOptions: ['tosse_cronica', 'estridor', 'sibilancia'] } },
    }
};

const intraoperatoriaForm: SavedForm = {
    id: 'form_intraoperatoria_001',
    projectId: 'proj_crest_001',
    name: 'Formulário Intraoperatório',
    schema: {
        title: 'Formulário Intraoperatório',
        description: "Coleta de dados durante o procedimento cirúrgico.",
        type: 'object',
        properties: {
            "section_proc": { type: "object", title: "Procedimento", properties: {
                procedimento: { type: 'string', title: 'Procedimento', enum: ['broncoscopia_flexivel', 'broncoscopia_rigida', 'traqueoscopia', 'dilatacao_traqueal', 'traqueoplastia'], enumNames: ['Broncoscopia flexível', 'Broncoscopia rígida', 'Traqueoscopia', 'Dilatação Traqueal', 'Traqueoplastia'] },
                anestesia: { type: 'string', title: 'Anestesia', enum: ['geral', 'sedacao_profunda'], enumNames: ['Geral', 'Sedação Profunda'] }
            }},
            "section_inducao": { type: "object", title: "Fármacos para Indução", properties: {
                lido: { type: 'number', title: 'Lidocaína (mg)' }, fenta: { type: 'number', title: 'Fentanil (mcg)' }, sufenta: { type: 'number', title: 'Sufentanil (mcg)' }, dexme_ind: { type: 'number', title: 'Dexmedetomidina (mcg)' }, keta: { type: 'number', title: 'Cetamina (mg)' }, mida: { type: 'number', title: 'Midazolam (mg)' }, propo_ind: { type: 'number', title: 'Propofol (mg)' }, etomi: { type: 'number', title: 'Etomidato (mg)' }, sevo_ind: { type: 'string', title: 'Sevoflurano (%)' },
            }},
            "section_manutencao": { type: "object", title: "Fármacos para Manutenção", properties: {
                remi: { type: 'number', title: 'Remifentanil (mcg/kg/min)' }, propo_maint: { type: 'number', title: 'Propofol (mcg/kg/min)' }, dexme_maint: { type: 'number', title: 'Dexmedetomidina (mcg/kg/h)' }, sevo_maint: { type: 'string', title: 'Sevoflurano (%)' },
            }},
            "section_adjuvantes": { type: "object", title: "Fármacos Adjuvantes", properties: {
                clon: { type: 'number', title: 'Clonidina (mcg)' }, mgso4: { type: 'number', title: 'Sulfato de Magnésio (mg)' }
            }},
            "section_sintomaticos": { type: "object", title: "Sintomáticos", properties: {
                dipi: { type: 'number', title: 'Dipirona (mg)' }, onda: { type: 'number', title: 'Ondansentrona (mg)' }, salbu: { type: 'number', title: 'Salbutamol (puffs)' }, dexa: { type: 'number', title: 'Dexametasona (mg)' },
            }},
            "section_suporte": { type: "object", title: "Suporte e Intercorrências", properties: {
                suporte_oxigenio: { type: 'array', title: 'Suporte de Oxigênio', items: { type: 'string', enum: ['cateter_nasal', 'sonda_aspiracao_periglotica'], enumNames: ['Cateter nasal', 'Sonda de aspiração periglótica'] }, uniqueItems: true },
                suporte_ventilatorio: { type: 'array', title: 'Suporte Ventilatório', items: { type: 'string', enum: ['mascara_laringea', 'tubo_orotraqueal'], enumNames: ['Máscara laríngea', 'Tubo orotraqueal'] }, uniqueItems: true },
                "section_intercorrencias": { type: "object", title: "Intercorrências", properties: {
                    dessaturacao: { type: 'string', title: 'Nível de Dessaturação', enum: ['none', 'dessaturacao_85_92', 'dessaturacao_75_85', 'dessaturacao_lt_70'], enumNames: ['Não ocorreu', 'Dessaturação (85-92%)', 'Dessaturação (75-85%)', 'Dessaturação (<70%)'] },
                    outras_intercorrencias: { type: 'array', title: 'Outras Intercorrências', items: { type: 'string', enum: ['broncoespasmo', 'laringoespasmo', 'sangramento', 'reflexo_tosse_nao_abolido'], enumNames: ['Broncoespasmo', 'Laringoespasmo', 'Sangramento', 'Reflexo de tosse não abolido'] }, uniqueItems: true }
                }}
            }},
        }
    },
    uiSchema: {
        'ui:root': { 'ui:order': ['section_proc', 'section_inducao', 'section_manutencao', 'section_adjuvantes', 'section_sintomaticos', 'section_suporte'] },
        'section_proc': { 'ui:widget': 'SectionWidget', 'ui:order': ['procedimento', 'anestesia'], 'ui:options': { columns: 2 } },
        'procedimento': { 'ui:widget': 'ChoiceWidget', 'ui:options': { displayAs: 'dropdown' } },
        'anestesia': { 'ui:widget': 'ChoiceWidget', 'ui:options': { displayAs: 'dropdown' } },
        'section_inducao': { 'ui:widget': 'SectionWidget', 'ui:order': ['lido', 'fenta', 'sufenta', 'dexme_ind', 'keta', 'mida', 'propo_ind', 'etomi', 'sevo_ind'], 'ui:options': { columns: 3 } },
        'lido': { 'ui:widget': 'NumberWidget', 'ui:options': { toggled: true } }, 'fenta': { 'ui:widget': 'NumberWidget', 'ui:options': { toggled: true } }, 'sufenta': { 'ui:widget': 'NumberWidget', 'ui:options': { toggled: true } }, 'dexme_ind': { 'ui:widget': 'NumberWidget', 'ui:options': { toggled: true } }, 'keta': { 'ui:widget': 'NumberWidget', 'ui:options': { toggled: true } }, 'mida': { 'ui:widget': 'NumberWidget', 'ui:options': { toggled: true } }, 'propo_ind': { 'ui:widget': 'NumberWidget', 'ui:options': { toggled: true } }, 'etomi': { 'ui:widget': 'NumberWidget', 'ui:options': { toggled: true } }, 'sevo_ind': { 'ui:widget': 'TextWidget', 'ui:options': { toggled: true } },
        'section_manutencao': { 'ui:widget': 'SectionWidget', 'ui:order': ['remi', 'propo_maint', 'dexme_maint', 'sevo_maint'], 'ui:options': { columns: 3 } },
        'remi': { 'ui:widget': 'NumberWidget', 'ui:options': { toggled: true } }, 'propo_maint': { 'ui:widget': 'NumberWidget', 'ui:options': { toggled: true } }, 'dexme_maint': { 'ui:widget': 'NumberWidget', 'ui:options': { toggled: true } }, 'sevo_maint': { 'ui:widget': 'TextWidget', 'ui:options': { toggled: true } },
        'section_adjuvantes': { 'ui:widget': 'SectionWidget', 'ui:order': ['clon', 'mgso4'], 'ui:options': { columns: 3 } },
        'clon': { 'ui:widget': 'NumberWidget', 'ui:options': { toggled: true } }, 'mgso4': { 'ui:widget': 'NumberWidget', 'ui:options': { toggled: true } },
        'section_sintomaticos': { 'ui:widget': 'SectionWidget', 'ui:order': ['dipi', 'onda', 'salbu', 'dexa'], 'ui:options': { columns: 3 } },
        'dipi': { 'ui:widget': 'NumberWidget', 'ui:options': { toggled: true } }, 'onda': { 'ui:widget': 'NumberWidget', 'ui:options': { toggled: true } }, 'salbu': { 'ui:widget': 'NumberWidget', 'ui:options': { toggled: true } }, 'dexa': { 'ui:widget': 'NumberWidget', 'ui:options': { toggled: true } },
        'section_suporte': { 'ui:widget': 'SectionWidget', 'ui:order': ['suporte_oxigenio', 'suporte_ventilatorio', 'section_intercorrencias'], 'ui:options': { columns: 2 } },
        'suporte_oxigenio': { 'ui:widget': 'ChoiceWidget', 'ui:options': { displayAs: 'checkboxGroup' } },
        'suporte_ventilatorio': { 'ui:widget': 'ChoiceWidget', 'ui:options': { displayAs: 'checkboxGroup' } },
        'section_intercorrencias': { 'ui:widget': 'SectionWidget', 'ui:order': ['dessaturacao', 'outras_intercorrencias'], 'ui:options': { columns: 1 } },
        'dessaturacao': { 'ui:widget': 'ChoiceWidget', 'ui:options': { displayAs: 'radio' } },
        'outras_intercorrencias': { 'ui:widget': 'ChoiceWidget', 'ui:options': { displayAs: 'checkboxGroup' } }
    }
};

const recuperacaoForm: SavedForm = {
    id: 'form_recuperacao_001',
    projectId: 'proj_crest_001',
    name: 'Recuperação Pós-Anestésica',
    schema: {
        title: 'Recuperação Pós-Anestésica',
        description: 'Dados da recuperação do paciente.',
        type: 'object',
        properties: {
            "section_main": { type: "object", title: "Recuperação", properties: {
                tempo_recuperacao: { type: 'string', title: 'Tempo de Recuperação (Aldrette > 9)', enum: ['ate_30', 'ate_45', 'entre_45_60', 'mais_60'], enumNames: ['Até 30 minutos', 'Até 45 minutos', 'Entre 45-60 minutos', '> 60 minutos'] },
                "section_intercorrencias": { type: "object", title: "Intercorrências / Queixas", properties: {
                    dessaturacao_pos: { type: 'string', title: 'Nível de Dessaturação (se ocorrido)', enum: ['none', 'dessaturacao_85_92', 'dessaturacao_75_85', 'dessaturacao_lt_70'], enumNames: ['Não ocorreu', 'Dessaturação (85-92%)', 'Dessaturação (75-85%)', 'Dessaturação (<70%)'] },
                    outras_queixas_pos: { type: 'array', title: 'Outras', items: { type: 'string', enum: ['broncoespasmo', 'laringoespasmo', 'sangramento', 'tosse', 'dor', 'vomitos', 'prurido', 'sialorreia'], enumNames: ['Broncoespasmo', 'Laringoespasmo', 'Sangramento', 'Tosse', 'Dor', 'Vômitos', 'Prurido', 'Sialorreia'] }, uniqueItems: true }
                }}
            }}
        }
    },
    uiSchema: {
        'ui:root': { 'ui:order': ['section_main'] },
        'section_main': { 'ui:widget': 'SectionWidget', 'ui:order': ['tempo_recuperacao', 'section_intercorrencias'], 'ui:options': { columns: 2 } },
        'tempo_recuperacao': { 'ui:widget': 'ChoiceWidget', 'ui:options': { displayAs: 'radio' } },
        'section_intercorrencias': { 'ui:widget': 'SectionWidget', 'ui:order': ['dessaturacao_pos', 'outras_queixas_pos'] },
        'dessaturacao_pos': { 'ui:widget': 'ChoiceWidget', 'ui:options': { displayAs: 'radio' } },
        'outras_queixas_pos': { 'ui:widget': 'ChoiceWidget', 'ui:options': { displayAs: 'checkboxGroup' } }
    }
};

export const mockProjectForms: SavedForm[] = [
    preAnestesiaForm,
    intraoperatoriaForm,
    recuperacaoForm,
]; 