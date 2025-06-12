// src/stores/formBuilderStore.ts
import { create } from 'zustand';
import { produce } from 'immer';
import { FieldPrimitiveType, FORM_BUILDER_PRIMITIVES } from '@/config/formBuilder.config';

export interface FormSchema {
  title: string;
  description: string;
  type: 'object';
  properties: { [key: string]: any };
  required?: string[];
}

export interface FormUiSchema {
  [key: string]: {
    'ui:widget': string;
    'ui:options'?: { [key:string]: any };
    [key: string]: any;
  };
}

interface FormBuilderState {
  schema: FormSchema;
  uiSchema: FormUiSchema;
  selectedFieldId: string | null;
  fieldOrder: string[];
}

interface FormBuilderActions {
  setForm: (form: { schema: FormSchema; uiSchema: FormUiSchema }) => void;
  setMetadata: (data: { title?: string; description?: string }) => void;
  addField: (primitiveType: FieldPrimitiveType) => void;
  removeField: (fieldId: string) => void;
  updateFieldSchema: (fieldId: string, newSchemaProps: any) => void;
  updateFieldUiOptions: (fieldId: string, newUiOptions: any) => void;
  setSelectedFieldId: (fieldId: string | null) => void;
  setFieldOrder: (newOrder: string[]) => void;
  // New actions for raw editing
  setRawSchema: (schemaString: string) => void;
  setRawUiSchema: (uiSchemaString: string) => void;
}

const initialSchema: FormSchema = {
  title: 'Untitled Form',
  description: 'This is a new form created with the CREST Form Builder.',
  type: 'object',
  properties: {},
};

const initialUiSchema: FormUiSchema = {};

export const useFormBuilderStore = create<FormBuilderState & FormBuilderActions>((set) => ({
  schema: initialSchema,
  uiSchema: initialUiSchema,
  selectedFieldId: null,
  fieldOrder: [],

  setForm: (form) => set({
    schema: form.schema,
    uiSchema: form.uiSchema,
    fieldOrder: Object.keys(form.schema.properties),
    selectedFieldId: null,
  }),

  setMetadata: ({ title, description }) => set(produce((state: FormBuilderState) => {
    if (title !== undefined) state.schema.title = title;
    if (description !== undefined) state.schema.description = description;
  })),

  addField: (primitiveType) => {
    const primitive = FORM_BUILDER_PRIMITIVES.find(p => p.type === primitiveType);
    if (!primitive) return;
    const newFieldId = `${primitiveType}_${Date.now()}`;
    set(produce((state: FormBuilderState) => {
      state.schema.properties[newFieldId] = primitive.defaultSchema;
      state.uiSchema[newFieldId] = primitive.defaultUiSchema;
      state.fieldOrder.push(newFieldId);
      state.selectedFieldId = newFieldId;
    }));
  },

  removeField: (fieldId) => set(produce((state: FormBuilderState) => {
    delete state.schema.properties[fieldId];
    delete state.uiSchema[fieldId];
    state.fieldOrder = state.fieldOrder.filter(id => id !== fieldId);
    if (state.selectedFieldId === fieldId) {
      state.selectedFieldId = null;
    }
  })),

  updateFieldSchema: (fieldId, newSchemaProps) => set(produce((state: FormBuilderState) => {
    if (state.schema.properties[fieldId]) {
      Object.assign(state.schema.properties[fieldId], newSchemaProps);
    }
  })),

  updateFieldUiOptions: (fieldId, newUiOptions) => set(produce((state: FormBuilderState) => {
    if (state.uiSchema[fieldId]?.['ui:options']) {
      Object.assign(state.uiSchema[fieldId]['ui:options'], newUiOptions);
    }
  })),
  
  setSelectedFieldId: (fieldId) => set({ selectedFieldId: fieldId }),
  
  setFieldOrder: (newOrder) => set({ fieldOrder: newOrder }),

  setRawSchema: (schemaString) => {
    try {
      const parsedSchema = JSON.parse(schemaString);
      set(produce((state: FormBuilderState) => {
        state.schema = parsedSchema;
        // Resync field order
        state.fieldOrder = Object.keys(parsedSchema.properties || {});
      }));
    } catch (e) {
      console.error("Invalid Schema JSON:", e);
    }
  },

  setRawUiSchema: (uiSchemaString) => {
    try {
      const parsedUiSchema = JSON.parse(uiSchemaString);
      set({ uiSchema: parsedUiSchema });
    } catch (e) {
      console.error("Invalid UI Schema JSON:", e);
    }
  },
}));