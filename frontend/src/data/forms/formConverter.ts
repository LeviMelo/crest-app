import { Form, Field, FieldType } from '@/stores/formBuilderStore.v2';
import { FormDefinition as SubmissionFormDefinition } from '@/stores/submissionStore';



// We rename the import to avoid a name clash, then create a more specific type for our converted format
export interface FormDefinition extends SubmissionFormDefinition {
  // Add any specific properties for the converted format if needed in the future
}

// Convert Form Builder V2 field types to JSON Schema types
const getJsonSchemaType = (fieldType: FieldType): string => {
  switch (fieldType) {
    case 'text':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'date':
      return 'string';
    case 'single-choice':
      return 'string';
    case 'multiple-choice':
      return 'array';
    default:
      return 'string';
  }
};

// Convert Form Builder V2 field to JSON Schema property
const convertFieldToJsonSchema = (field: Field) => {
  const baseSchema: any = {
    type: getJsonSchemaType(field.type),
    title: field.label,
    description: field.description,
  };

  // Handle field-specific properties
  switch (field.type) {
    case 'date':
      baseSchema.format = 'date';
      break;
    case 'single-choice':
      if (field.options.choices) {
        baseSchema.enum = field.options.choices.map(choice => choice.value);
        baseSchema.enumNames = field.options.choices.map(choice => choice.label);
      }
      break;
    case 'multiple-choice':
      baseSchema.items = {
        type: 'string',
        enum: field.options.choices?.map(choice => choice.value) || [],
        enumNames: field.options.choices?.map(choice => choice.label) || [],
      };
      baseSchema.uniqueItems = true;
      break;
    case 'number':
      // Add validation rules
      field.validation?.forEach(rule => {
        if (rule.type === 'min') baseSchema.minimum = rule.value;
        if (rule.type === 'max') baseSchema.maximum = rule.value;
      });
      break;
  }

  // Handle default values
  if (field.defaultValue !== null && field.defaultValue !== undefined) {
    baseSchema.default = field.defaultValue;
  }

  return baseSchema;
};

// Convert Form Builder V2 field to UI Schema
const convertFieldToUiSchema = (field: Field) => {
  const uiSchema: any = {};

  // Always start with the field's options as the base ui:options
  uiSchema['ui:options'] = { ...field.options };

  // Handle display options and widget selection
  switch (field.type) {
    case 'number':
      // Number fields use the default NumberWidget and need their options passed through
      break;
    case 'single-choice': {
      // Normalize displayAs values to match renderer expectations
      const display = field.options.displayAs || 'radio';
      const normalizedDisplay = display === 'dropdown' ? 'select' : display;

      uiSchema['ui:options'].displayAs = normalizedDisplay; // update option for widgets that rely on it

      if (normalizedDisplay === 'radio' || normalizedDisplay === 'button-group') {
        uiSchema['ui:widget'] = 'radio';
      } else if (normalizedDisplay === 'select') {
        uiSchema['ui:widget'] = 'select';
      }
      break;
    }
    case 'multiple-choice': {
      const display = field.options.displayAs || 'checkboxGroup';
      const normalizedDisplay = display === 'checkboxGroup' ? 'checkboxes' : display;

      uiSchema['ui:options'].displayAs = normalizedDisplay;

      if (normalizedDisplay === 'checkboxes' || normalizedDisplay === 'button-group') {
        uiSchema['ui:widget'] = 'checkboxes';
      }
      break;
    }
    case 'boolean':
      if (field.options.displayAs === 'switch') {
        uiSchema['ui:widget'] = 'switch';
      } else {
        uiSchema['ui:widget'] = 'checkbox';
      }
      break;
    case 'text':
      if (field.options.variant === 'autocomplete') {
        uiSchema['ui:widget'] = 'autocomplete';
      }
      break;
    case 'date':
      uiSchema['ui:widget'] = 'date';
      break;
  }

  // Handle styling (merge with existing options)
  if (field.styling) {
    uiSchema['ui:options'] = {
      ...uiSchema['ui:options'],
      ...(field.styling.color ? { color: field.styling.color } : {}),
      ...(field.styling.width ? { width: field.styling.width } : {}),
      ...(field.styling.textOverflow ? { textOverflow: field.styling.textOverflow } : {}),
    };
  }

  // Handle help text
  if (field.description) {
    uiSchema['ui:help'] = field.description;
  }

  return uiSchema;
};

// Convert Form Builder V2 form to old submission format
export const convertFormToSubmissionFormat = (form: Form): FormDefinition => {
  console.log('DEBUG convertFormToSubmissionFormat: Starting conversion for form:', form.name);
  console.log('DEBUG convertFormToSubmissionFormat: Form has fields:', form.fields?.length || 0);
  console.log('DEBUG convertFormToSubmissionFormat: Form has sections:', form.layout?.sections?.length || 0);
  
  const schema: any = {
    type: 'object',
    properties: {},
    required: [],
  };

  const uiSchema: any = {
    // This will now be an array of section objects
    'ui:sections': [],
    // We will still define field-specific UI details here
  };

  // Process all fields first to populate the schemas
  form.fields.forEach((field, index) => {
    console.log(`DEBUG convertFormToSubmissionFormat: Processing field ${index}:`, {
      id: field.id,
      type: field.type,
      label: field.label,
      required: field.required
    });
    
    try {
      const fieldSchema = convertFieldToJsonSchema(field);
      const fieldUiSchema = convertFieldToUiSchema(field);
      
      schema.properties[field.id] = fieldSchema;
      uiSchema[field.id] = fieldUiSchema;
      
      if (field.required) {
        schema.required.push(field.id);
      }
    } catch (error) {
      console.error(`DEBUG convertFormToSubmissionFormat: Error processing field ${field.id}:`, error);
    }
  });

  console.log('DEBUG convertFormToSubmissionFormat: Schema properties after processing fields:', Object.keys(schema.properties));
  console.log('DEBUG convertFormToSubmissionFormat: Processing sections...');

  // Now, structure the sections in the UI schema
  form.layout.sections.forEach((section, index) => {
    console.log(`DEBUG convertFormToSubmissionFormat: Processing section ${index}:`, {
      id: section.id,
      title: section.title,
      fieldsCount: section.fields?.length || 0,
      fields: section.fields
    });
    
    uiSchema['ui:sections'].push({
      id: section.id,
      title: section.title,
      // The 'ui:order' is now per-section - use all fields from the section
      'ui:order': section.fields,
      styling: section.styling,
    });
  });
  
  console.log('DEBUG convertFormToSubmissionFormat: Final uiSchema sections:', uiSchema['ui:sections']);
  
  // The global 'ui:order' is no longer needed as ordering is handled per section.
  delete uiSchema['ui:order'];

  const result = {
    key: form.id,
    name: form.name,
    version: form.version,
    schema,
    uiSchema,
  };
  
  console.log('DEBUG convertFormToSubmissionFormat: Final result:', {
    name: result.name,
    schemaPropsCount: Object.keys(result.schema.properties).length,
    uiSectionsCount: result.uiSchema['ui:sections'].length
  });
  
  return result;
};

// Convert multiple forms to submission format
export const convertFormsToSubmissionFormat = (forms: Form[]): FormDefinition[] => {
  return forms.map(convertFormToSubmissionFormat);
};

 