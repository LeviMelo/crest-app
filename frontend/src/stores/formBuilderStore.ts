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
    'ui:widget'?: string;
    'ui:order'?: string[];
    'ui:options'?: { [key:string]: any };
    [key: string]: any;
  };
}

export interface FormBuilderState {
  schema: FormSchema;
  uiSchema: FormUiSchema;
  selectedFieldId: string | null;
}

interface FormBuilderActions {
  setForm: (form: { schema: FormSchema; uiSchema: FormUiSchema }) => void;
  setMetadata: (data: { title?: string; description?: string }) => void;
  addField: (primitiveType: FieldPrimitiveType, parentId?: string | null) => void;
  removeField: (fieldId: string) => void;
  updateFieldSchema: (fieldId: string, newSchemaProps: any) => void;
  updateFieldUiOptions: (fieldId: string, newUiOptions: any) => void;
  setSelectedFieldId: (fieldId: string | null) => void;
  setOrder: (newOrder: string[], parentId?: string | null) => void;
  setRawSchema: (schemaString: string) => void;
  setRawUiSchema: (uiSchemaString: string) => void;
  findFieldParent: (state: FormBuilderState, fieldId: string) => { parentSchema: any, parentUiSchema: any, parentId: string | null };
  loadForm: (form: { schema: FormSchema, uiSchema: FormUiSchema }) => void;
  moveField: (fieldId: string, oldParentId: string | null, newParentId: string | null, newIndex: number) => void;
}

const initialSchema: FormSchema = {
  title: 'Untitled Form',
  description: 'This is a new form created with the CREST Form Builder.',
  type: 'object',
  properties: {},
};

const initialUiSchema: FormUiSchema = {
    'ui:root': {
        'ui:order': [],
    }
};

const findFieldParent = (state: FormBuilderState, fieldId: string) => {
    let parentSchema: any = state.schema;
    let parentUiSchema: any = state.uiSchema['ui:root'];
    let parentId: string | null = null;

    const search = (currentSchema: any, currentUiSchema: any, currentId: string | null): boolean => {
      const order = currentUiSchema?.['ui:order'] || [];
      if (order.includes(fieldId)) {
        parentSchema = currentSchema;
        parentUiSchema = currentUiSchema;
        parentId = currentId;
        return true;
      }

      for (const id of order) {
        const childSchema = currentSchema.properties?.[id];
        const childUiSchema = state.uiSchema[id];
        if (childSchema?.type === 'object' && childUiSchema) {
          if (search(childSchema, childUiSchema, id)) {
            return true;
          }
        }
      }
      return false;
    };
    
    search(state.schema, state.uiSchema['ui:root'], null);
    return { parentSchema, parentUiSchema, parentId };
};

export const useFormBuilderStore = create<FormBuilderState & FormBuilderActions>((set) => ({
  schema: initialSchema,
  uiSchema: initialUiSchema,
  selectedFieldId: null,

  findFieldParent: (state, fieldId) => findFieldParent(state, fieldId),

  loadForm: (form) => {
    set({
      schema: structuredClone(form.schema),
      uiSchema: structuredClone(form.uiSchema),
      selectedFieldId: null,
    });
  },

  setForm: (form) => {
    set({
      schema: structuredClone(form.schema),
      uiSchema: structuredClone(form.uiSchema),
    selectedFieldId: null,
    });
  },

  setMetadata: ({ title, description }) => {
    set(produce((state: FormBuilderState) => {
    if (title !== undefined) state.schema.title = title;
    if (description !== undefined) state.schema.description = description;
    }));
  },

  addField: (primitiveType, parentId = null) => {
    const primitive = FORM_BUILDER_PRIMITIVES.find(p => p.type === primitiveType);
    if (!primitive) return;
    
    const newFieldId = `${primitiveType}_${Date.now()}`;
    
    set(produce((state: FormBuilderState) => {
        let targetSchema = state.schema;
        let targetUiOrder = state.uiSchema['ui:root']['ui:order']!;

        if (parentId) {
            targetSchema = state.schema.properties[parentId];
            if (!state.uiSchema[parentId]) state.uiSchema[parentId] = {};
            if (!state.uiSchema[parentId]['ui:order']) state.uiSchema[parentId]['ui:order'] = [];
            targetUiOrder = state.uiSchema[parentId]['ui:order']!;
        }
        
        if (targetSchema?.properties && targetUiOrder) {
            targetSchema.properties[newFieldId] = structuredClone(primitive.defaultSchema);
            state.uiSchema[newFieldId] = structuredClone(primitive.defaultUiSchema);
            targetUiOrder.push(newFieldId);
      state.selectedFieldId = newFieldId;
        }
    }));
  },

  removeField: (fieldId) => {
    set(produce((state: FormBuilderState) => {
      const { parentSchema, parentUiSchema } = findFieldParent(state, fieldId);

      if (!parentSchema?.properties || !parentUiSchema?.['ui:order']) return;

      const toDelete: string[] = [fieldId];
      const queue: string[] = [fieldId];

      while(queue.length > 0) {
          const currentId = queue.shift()!;
          const childUiSchema = state.uiSchema[currentId];
          if(childUiSchema && childUiSchema['ui:order']) {
              for(const childId of childUiSchema['ui:order']) {
                  toDelete.push(childId);
                  queue.push(childId);
              }
          }
      }

      for(const id of toDelete) {
          delete parentSchema.properties[id];
          delete state.uiSchema[id];
      }
      
      parentUiSchema['ui:order'] = parentUiSchema['ui:order'].filter((id: string) => id !== fieldId);
      
    if (state.selectedFieldId === fieldId) {
      state.selectedFieldId = null;
    }
    }));
  },

  updateFieldSchema: (fieldId, newSchemaProps) => {
    set(produce((state: FormBuilderState) => {
      const { parentSchema } = findFieldParent(state, fieldId);
      if (parentSchema?.properties?.[fieldId]) {
        Object.assign(parentSchema.properties[fieldId], newSchemaProps);
    }
    }));
  },

  updateFieldUiOptions: (fieldId, newUiOptions) => {
    set(produce((state: FormBuilderState) => {
      if (state.uiSchema[fieldId]) {
        if (!state.uiSchema[fieldId]['ui:options']) {
          state.uiSchema[fieldId]['ui:options'] = {};
        }
      Object.assign(state.uiSchema[fieldId]['ui:options'], newUiOptions);
    }
    }));
  },
  
  setSelectedFieldId: (fieldId) => set({ selectedFieldId: fieldId }),
  
  setOrder: (newOrder, parentId = null) => {
    set(produce((state: FormBuilderState) => {
        if (parentId) {
          if(state.uiSchema[parentId]) {
              state.uiSchema[parentId]['ui:order'] = newOrder;
          }
        } else {
          state.uiSchema['ui:root']['ui:order'] = newOrder;
        }
    }));
  },

  setRawSchema: (schemaString) => {
    try {
      const parsedSchema = JSON.parse(schemaString);
      set({ schema: structuredClone(parsedSchema) });
    } catch (e) {
      console.error("Invalid Schema JSON:", e);
    }
  },

  setRawUiSchema: (uiSchemaString) => {
    try {
      const parsedUiSchema = JSON.parse(uiSchemaString);
      set({ uiSchema: structuredClone(parsedUiSchema) });
    } catch (e) {
      console.error("Invalid UI Schema JSON:", e);
    }
  },

  moveField: (fieldId, oldParentId, newParentId, newIndex) => {
    set(produce((state: FormBuilderState) => {
      const { parentSchema: oldParentSchema, parentUiSchema: oldParentUiSchema } = findFieldParent(state, fieldId);
      
      let newParentSchema: any;
      let newParentUiSchema: any;

      if (newParentId === null) {
          newParentSchema = state.schema;
          newParentUiSchema = state.uiSchema['ui:root'];
      } else {
          newParentSchema = state.schema.properties[newParentId];
          newParentUiSchema = state.uiSchema[newParentId];
      }
      
      if (!oldParentSchema?.properties || !oldParentUiSchema?.['ui:order'] || !newParentSchema?.properties || !newParentUiSchema) return;

      const fieldSchema = oldParentSchema.properties[fieldId];
      if(!fieldSchema) return;

      // 1. Add to new parent
      newParentSchema.properties[fieldId] = fieldSchema;
      if (!newParentUiSchema['ui:order']) newParentUiSchema['ui:order'] = [];
      newParentUiSchema['ui:order'].splice(newIndex, 0, fieldId);

      // 2. Remove from old parent
      delete oldParentSchema.properties[fieldId];
      oldParentUiSchema['ui:order'] = oldParentUiSchema['ui:order'].filter((id: string) => id !== fieldId);
    }));
  },
}));