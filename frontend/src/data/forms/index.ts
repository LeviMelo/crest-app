import { Form } from '@/stores/formBuilderStore.v2';
import { preAnestesiaForm } from './preAnestesiaForm';
import { intraoperatoriaForm } from './intraoperatoriaForm';
import { recuperacaoPosAnestesicaForm } from './recuperacaoPosAnestesicaForm';

// Form templates available for selection
export const FORM_TEMPLATES: Record<string, Omit<Form, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>> = {
  'pre-anestesia': preAnestesiaForm,
  'intraoperatoria': intraoperatoriaForm,
  'recuperacao-pos-anestesica': recuperacaoPosAnestesicaForm,
};

// Helper to get template by key
export const getFormTemplate = (templateKey: string) => {
  return FORM_TEMPLATES[templateKey] || null;
};

// Helper to get all available templates
export const getAllFormTemplates = () => {
  return Object.entries(FORM_TEMPLATES).map(([key, template]) => ({
    key,
    ...template,
  }));
};

// Export individual forms for direct import
export { preAnestesiaForm, intraoperatoriaForm, recuperacaoPosAnestesicaForm }; 