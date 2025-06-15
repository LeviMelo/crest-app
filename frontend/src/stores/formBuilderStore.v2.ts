// src/stores/formBuilderStore.v2.ts
// New simplified form builder store based on the specification
import { create } from 'zustand';
import { produce } from 'immer';

// Simplified data model from specification
export type FieldType = 
  | 'text'
  | 'number' 
  | 'boolean'
  | 'single-choice'
  | 'multiple-choice'
  | 'date'
  | 'autocomplete-multiple';

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern';
  value?: any;
  message: string;
}

export interface FieldOptions {
  unit?: string;
  choices?: { value: string; label: string; color?: string }[];
  displayAs?: 'radio' | 'dropdown' | 'checkboxGroup' | 'slider' | 'stepper' | 'checkbox' | 'switch' | 'button-group';
  enabledInputs?: string[];
  layout?: {
    style: 'auto' | 'columns';
    columns?: number;
  };
  togglable?: boolean;
  textFallback?: boolean;
  textFallbackLabel?: string;
  [key: string]: any;
}

export interface FieldStyling {
  color: string;
  width?: 'compact' | 'normal' | 'wide';
  size?: 'sm' | 'md' | 'lg';
  [key: string]: any;
}

export interface Field {
  id: string;
  type: FieldType;
  label: string;
  description?: string;
  required: boolean;
  defaultValue?: any;
  validation?: ValidationRule[];
  options: FieldOptions;
  styling: FieldStyling;
}

export interface SectionStyling {
  color: string;
  background?: string;
  fontSize?: 'sm' | 'base' | 'lg';
  [key: string]: any;
}

export interface Section {
  id: string;
  title: string;
  fields: string[]; // Field IDs
  collapsed: boolean;
  styling: SectionStyling;
}

export interface LayoutConfig {
  sections: Section[];
}

export interface Form {
  id: string;
  projectId: string;
  name: string;
  description: string;
  version: string;
  fields: Field[];
  layout: LayoutConfig;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormBuilderError {
  id: string;
  type: 'validation' | 'save' | 'load';
  message: string;
  fieldId?: string;
}

// State interface
export interface FormBuilderState {
  // Current form being edited
  currentForm: Form | null;
  
  // UI state
  selectedFieldId: string | null;
  draggedFieldId: string | null;
  previewMode: boolean;
  
  // Available forms in project
  projectForms: Form[];
  
  // Loading states
  isLoading: boolean;
  isSaving: boolean;
  
  // Error handling
  errors: FormBuilderError[];
}

// Actions interface
export interface FormBuilderActions {
  // Form management
  createNewForm: (projectId: string) => void;
  loadForm: (formId: string) => void;
  saveForm: () => Promise<void>;
  deleteForm: (formId: string) => void;
  updateFormMetadata: (updates: { name?: string; description?: string }) => void;
  
  // Field operations
  addField: (type: FieldType, sectionId?: string) => void;
  removeField: (fieldId: string) => void;
  updateField: (fieldId: string, updates: Partial<Field>) => void;
  updateFieldDefaultValue: (fieldId: string, value: any) => void;
  moveField: (fieldId: string, targetSectionId: string, index: number) => void;
  duplicateField: (fieldId: string) => void;
  
  // Section operations
  addSection: () => void;
  removeSection: (sectionId: string) => void;
  updateSection: (sectionId: string, updates: Partial<Section>) => void;
  moveSections: (oldIndex: number, newIndex: number) => void;
  toggleSectionCollapse: (sectionId: string) => void;
  
  // UI operations
  selectField: (fieldId: string | null) => void;
  togglePreview: () => void;
  setDraggedField: (fieldId: string | null) => void;
  
  // Error handling
  addError: (error: Omit<FormBuilderError, 'id'>) => void;
  removeError: (errorId: string) => void;
  clearErrors: () => void;
  setRawForm: (jsonString: string) => boolean;
  
  // Utility functions
  getField: (fieldId: string) => Field | null;
  getSection: (sectionId: string) => Section | null;
  validateForm: () => FormBuilderError[];
}

// Default field templates
const createDefaultField = (type: FieldType, label: string): Omit<Field, 'id'> => {
  const base = {
    type,
    label,
    description: '',
    required: false,
    validation: [],
    options: {
      togglable: false,
      textFallback: false,
    },
    styling: { color: 'primary', width: 'normal' as const }
  };

  switch (type) {
    case 'text':
      return { ...base, defaultValue: '' };
    case 'number':
      return { ...base, options: { ...base.options, unit: '', enabledInputs: ['input'] }, defaultValue: { toggled: false, value: 0 } };
    case 'boolean':
      return { ...base, options: { ...base.options, displayAs: 'checkbox' }, defaultValue: false };
    case 'single-choice':
      return {
        ...base,
        options: { 
          choices: [
            { value: 'option_1', label: 'Option 1' },
            { value: 'option_2', label: 'Option 2' }
          ],
          displayAs: 'radio',
          layout: { style: 'auto' },
          togglable: false,
          textFallback: false
        },
        defaultValue: { toggled: false, value: 'option_1' }
      };
    case 'multiple-choice':
      return {
        ...base,
        options: { 
          choices: [
            { value: 'option_1', label: 'Option 1' },
            { value: 'option_2', label: 'Option 2' }
          ],
          displayAs: 'checkboxGroup',
          layout: { style: 'auto' },
          togglable: false,
          textFallback: false
        },
        defaultValue: { toggled: false, value: ['option_1'] }
      };
    case 'autocomplete-multiple':
      return {
        ...base,
        options: { 
          choices: [
            { value: 'icd_g40', label: 'G40 - Epilepsy' },
            { value: 'icd_j45', label: 'J45 - Asthma' }
          ],
          placeholder: 'Type or select...'
        },
        defaultValue: { selected: [], custom: [] }
      };
    case 'date':
      return { ...base, defaultValue: '' };
    default:
      return { ...base, defaultValue: null };
  }
};

// Generate unique IDs
const generateId = (prefix: string): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Initial state
const initialState: FormBuilderState = {
  currentForm: null,
  selectedFieldId: null,
  draggedFieldId: null,
  previewMode: false,
  projectForms: [],
  isLoading: false,
  isSaving: false,
  errors: []
};

// Create the store
export const useFormBuilderStoreV2 = create<FormBuilderState & FormBuilderActions>((set, get) => ({
  ...initialState,

  // Form management
  createNewForm: (projectId: string) => {
    const newForm: Form = {
      id: generateId('form'),
      projectId,
      name: 'Untitled Form',
      description: 'A new form created with the CREST Form Builder',
      version: '1.0.0',
      fields: [],
      layout: { sections: [] },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    set(produce((state: FormBuilderState) => {
      state.currentForm = newForm;
      state.selectedFieldId = null;
      state.previewMode = false;
      state.errors = [];
    }));
  },

  loadForm: (formId: string) => {
    set(produce((state: FormBuilderState) => {
      state.isLoading = true;
    }));

    // Simulate async loading
    setTimeout(() => {
      const form = get().projectForms.find(f => f.id === formId);
      if (form) {
        set(produce((state: FormBuilderState) => {
          state.currentForm = structuredClone(form);
          state.selectedFieldId = null;
          state.previewMode = false;
          state.isLoading = false;
          state.errors = [];
        }));
      } else {
        set(produce((state: FormBuilderState) => {
          state.isLoading = false;
          state.errors.push({
            id: generateId('error'),
            type: 'load',
            message: `Form with ID ${formId} not found`
          });
        }));
      }
    }, 100);
  },

  saveForm: async () => {
    const { currentForm } = get();
    if (!currentForm) return;

    set(produce((state: FormBuilderState) => {
      state.isSaving = true;
    }));

    try {
      // Validate form before saving
      const errors = get().validateForm();
      if (errors.length > 0) {
        set(produce((state: FormBuilderState) => {
          state.errors = errors;
          state.isSaving = false;
        }));
        return;
      }

      // Simulate async save
      await new Promise(resolve => setTimeout(resolve, 500));

      set(produce((state: FormBuilderState) => {
        if (state.currentForm) {
          state.currentForm.updatedAt = new Date();
          
          // Update or add to project forms
          const existingIndex = state.projectForms.findIndex(f => f.id === state.currentForm!.id);
          if (existingIndex >= 0) {
            state.projectForms[existingIndex] = structuredClone(state.currentForm);
          } else {
            state.projectForms.push(structuredClone(state.currentForm));
          }
        }
        state.isSaving = false;
        state.errors = [];
      }));
    } catch (error) {
      set(produce((state: FormBuilderState) => {
        state.isSaving = false;
        state.errors.push({
          id: generateId('error'),
          type: 'save',
          message: 'Failed to save form'
        });
      }));
    }
  },

  deleteForm: (formId: string) => {
    set(produce((state: FormBuilderState) => {
      state.projectForms = state.projectForms.filter(f => f.id !== formId);
      if (state.currentForm?.id === formId) {
        state.currentForm = null;
        state.selectedFieldId = null;
      }
    }));
  },

  updateFormMetadata: (updates) => {
    set(produce((state: FormBuilderState) => {
      if (state.currentForm) {
        if (updates.name !== undefined) state.currentForm.name = updates.name;
        if (updates.description !== undefined) state.currentForm.description = updates.description;
        state.currentForm.updatedAt = new Date();
      }
    }));
  },

  // Field operations
  addField: (type: FieldType, sectionId?: string) => {
    const fieldTemplate = createDefaultField(type, `New ${type} field`);
    const newField: Field = {
      ...fieldTemplate,
      id: generateId('field')
    };

    set(produce((state: FormBuilderState) => {
      if (!state.currentForm) return;

      // Add field to form's main list
      state.currentForm.fields.push(newField);

      let targetSectionId = sectionId;

      // If no sectionId is provided, figure it out from the selection
      if (!targetSectionId && state.selectedFieldId) {
        // Is the selection a section?
        let section = state.currentForm.layout.sections.find(s => s.id === state.selectedFieldId);
        if (section) {
          targetSectionId = section.id;
        } else {
          // Is the selection a field inside a section?
          const parentSection = state.currentForm.layout.sections.find(s => s.fields.includes(state.selectedFieldId!));
          if (parentSection) {
            targetSectionId = parentSection.id;
          }
        }
      }
      
      if (targetSectionId) {
        // Add to specific section
        const section = state.currentForm.layout.sections.find(s => s.id === targetSectionId);
        if (section) {
          section.fields.push(newField.id);
        }
      } else {
        // Add to first section or create one if none exist
        if (state.currentForm.layout.sections.length === 0) {
          const defaultSection: Section = {
            id: generateId('section'),
            title: 'Main Section',
            fields: [newField.id],
            collapsed: false,
            styling: { color: 'secondary' }
          };
          state.currentForm.layout.sections.push(defaultSection);
        } else {
          state.currentForm.layout.sections[0].fields.push(newField.id);
        }
      }

      // After adding, select the new field
      state.selectedFieldId = newField.id;
      state.currentForm.updatedAt = new Date();
    }));
  },

  removeField: (fieldId: string) => {
    set(produce((state: FormBuilderState) => {
      if (!state.currentForm) return;

      // Check if this is a section being removed
      const isSection = state.currentForm.layout.sections.some(s => s.id === fieldId);
      
      if (isSection) {
        // Remove the section and all its fields
        const section = state.currentForm.layout.sections.find(s => s.id === fieldId);
        if (section) {
          // Remove all fields in the section
          section.fields.forEach(fId => {
            state.currentForm!.fields = state.currentForm!.fields.filter(f => f.id !== fId);
          });
          
          // Remove the section itself
          state.currentForm.layout.sections = state.currentForm.layout.sections.filter(s => s.id !== fieldId);
        }
      } else {
        // Remove field from fields array
        state.currentForm.fields = state.currentForm.fields.filter(f => f.id !== fieldId);

        // Remove field from all sections
        state.currentForm.layout.sections.forEach(section => {
          section.fields = section.fields.filter(id => id !== fieldId);
        });
      }

      // Clear selection if deleted field was selected
      if (state.selectedFieldId === fieldId) {
        state.selectedFieldId = null;
      }

      state.currentForm.updatedAt = new Date();
    }));
  },

  updateField: (fieldId: string, updates: Partial<Field>) => {
    set(produce((state: FormBuilderState) => {
      if (!state.currentForm) return;

      const field = state.currentForm.fields.find(f => f.id === fieldId);
      if (field) {
        Object.assign(field, updates);
        state.currentForm.updatedAt = new Date();
      }
    }));
  },

  updateFieldDefaultValue: (fieldId: string, value: any) => {
    set(produce((state: FormBuilderState) => {
        if (!state.currentForm) return;

        const field = state.currentForm.fields.find(f => f.id === fieldId);
        if (field) {
            field.defaultValue = value;
            state.currentForm.updatedAt = new Date();
        }
    }));
  },

  moveField: (fieldId: string, targetSectionId: string, index: number) => {
    set(produce((state: FormBuilderState) => {
      if (!state.currentForm) return;

      // Remove field from current section
      state.currentForm.layout.sections.forEach(section => {
        section.fields = section.fields.filter(id => id !== fieldId);
      });

      // Add to target section at specified index
      const targetSection = state.currentForm.layout.sections.find(s => s.id === targetSectionId);
      if (targetSection) {
        targetSection.fields.splice(index, 0, fieldId);
      }

      state.currentForm.updatedAt = new Date();
    }));
  },

  duplicateField: (fieldId: string) => {
    set(produce((state: FormBuilderState) => {
      if (!state.currentForm) return;

      const { fields, layout: { sections } } = state.currentForm;

      const fieldToDuplicate = fields.find((f: Field) => f.id === fieldId);
      const sectionContainingField = sections.find((s: Section) => s.fields.includes(fieldId));

      if (!fieldToDuplicate || !sectionContainingField) return;

      const newField: Field = {
        ...fieldToDuplicate,
        id: generateId(fieldToDuplicate.type),
      };

      // Add new field to the main fields array
      fields.push(newField);

      // Add new field to the section, right after the original
      const originalFieldIndex = sectionContainingField.fields.indexOf(fieldId);
      sectionContainingField.fields.splice(originalFieldIndex + 1, 0, newField.id);
      
      // Select the new field
      state.selectedFieldId = newField.id;
    }));
  },

  // Section operations
  addSection: () => {
    const newSection: Section = {
      id: generateId('section'),
      title: 'New Section',
      fields: [],
      collapsed: false,
      styling: { color: 'secondary', fontSize: 'base' }
    };

    set(produce((state: FormBuilderState) => {
      if (!state.currentForm) return;

      state.currentForm.layout.sections.push(newSection);
      state.selectedFieldId = newSection.id;
      state.currentForm.updatedAt = new Date();
    }));
  },

  removeSection: (sectionId: string) => {
    get().removeField(sectionId);
  },

  updateSection: (sectionId: string, updates: Partial<Section>) => {
    set(produce((state: FormBuilderState) => {
      if (!state.currentForm) return;

      const section = state.currentForm.layout.sections.find(s => s.id === sectionId);
      if (section) {
        Object.assign(section, updates);
        
        // Also update the corresponding field if title changed
        if (updates.title) {
          const field = state.currentForm.fields.find(f => f.id === sectionId);
          if (field) {
            field.label = updates.title;
          }
        }
        
        state.currentForm.updatedAt = new Date();
      }
    }));
  },

  moveSections: (oldIndex: number, newIndex: number) => {
    set(produce((state: FormBuilderState) => {
      if (!state.currentForm) return;

      const sections = state.currentForm.layout.sections;
      const [movedSection] = sections.splice(oldIndex, 1);
      sections.splice(newIndex, 0, movedSection);
      
      state.currentForm.updatedAt = new Date();
    }));
  },

  toggleSectionCollapse: (sectionId: string) => {
    set(produce((state: FormBuilderState) => {
      if (!state.currentForm) return;

      const section = state.currentForm.layout.sections.find(s => s.id === sectionId);
      if (section) {
        section.collapsed = !section.collapsed;
        state.currentForm.updatedAt = new Date();
      }
    }));
  },

  // UI operations
  selectField: (fieldId: string | null) => {
    set({ selectedFieldId: fieldId });
  },

  togglePreview: () => {
    set(produce((state: FormBuilderState) => {
      state.previewMode = !state.previewMode;
    }));
  },

  setRawForm: (jsonString: string): boolean => {
    try {
      const form = JSON.parse(jsonString) as Form;
      // Basic validation
      if (form && form.id && form.name && Array.isArray(form.fields) && form.layout?.sections) {
        set({ currentForm: form, selectedFieldId: null, errors: [] });
        return true;
      }
      throw new Error("Invalid form structure.");
    } catch(e: any) {
      get().addError({ type: 'load', message: `Invalid JSON: ${e.message}` });
      return false;
    }
  },

  setDraggedField: (fieldId: string | null) => {
    set({ draggedFieldId: fieldId });
  },

  // Error handling
  addError: (error) => {
    set(produce((state: FormBuilderState) => {
      state.errors.push({
        ...error,
        id: generateId('error')
      });
    }));
  },

  removeError: (errorId: string) => {
    set(produce((state: FormBuilderState) => {
      state.errors = state.errors.filter(e => e.id !== errorId);
    }));
  },

  clearErrors: () => {
    set({ errors: [] });
  },

  // Utility functions
  getField: (fieldId: string) => {
    const { currentForm } = get();
    return currentForm?.fields.find(f => f.id === fieldId) || null;
  },

  getSection: (sectionId: string) => {
    const { currentForm } = get();
    return currentForm?.layout.sections.find(s => s.id === sectionId) || null;
  },

  validateForm: () => {
    const { currentForm } = get();
    const errors: FormBuilderError[] = [];

    if (!currentForm) {
      errors.push({
        id: generateId('error'),
        type: 'validation',
        message: 'No form to validate'
      });
      return errors;
    }

    // Validate form metadata
    if (!currentForm.name.trim()) {
      errors.push({
        id: generateId('error'),
        type: 'validation',
        message: 'Form name is required'
      });
    }

    // Validate fields
    currentForm.fields.forEach(field => {
      if (!field.label.trim()) {
        errors.push({
          id: generateId('error'),
          type: 'validation',
          message: 'Field label is required',
          fieldId: field.id
        });
      }

      // Validate choice fields have options
      if ((field.type === 'single-choice' || field.type === 'multiple-choice') && 
          (!field.options.choices || field.options.choices.length === 0)) {
        errors.push({
          id: generateId('error'),
          type: 'validation',
          message: 'Choice fields must have at least one option',
          fieldId: field.id
        });
      }
    });

    return errors;
  }
})); 