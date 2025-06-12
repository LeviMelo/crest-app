// src/components/forms/DynamicFormRenderer.tsx
import React from 'react';
import { FormSchema, FormUiSchema } from '@/stores/formBuilderStore';
import NumberWidget from './widgets/NumberWidget';
// Other widgets will be imported here

interface DynamicFormRendererProps {
  schema: FormSchema;
  uiSchema: FormUiSchema;
  formData: any;
  onFormDataChange: (updatedData: any) => void;
  fieldOrder?: string[];
}

const widgetRegistry: { [key: string]: React.ComponentType<any> } = {
  NumberWidget,
  // TextWidget, ChoiceWidget, etc.
};

const UnhandledWidget = ({ widgetName, fieldId }: { widgetName: string, fieldId: string }) => (
  <div className="p-2 border-dashed border-destructive bg-destructive/10 text-destructive text-xs rounded-md">
    Unhandled Widget: <strong>{widgetName || 'N/A'}</strong> for field <strong>{fieldId}</strong>
  </div>
);

const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({
  schema,
  uiSchema,
  formData,
  onFormDataChange,
  fieldOrder,
}) => {
  const fieldsToRender = fieldOrder || Object.keys(schema.properties);

  const handleFieldChange = (fieldId: string, newValue: any) => {
    onFormDataChange({
      ...formData,
      [fieldId]: newValue,
    });
  };

  return (
    <form className="space-y-6">
      {fieldsToRender.map(fieldId => {
        const fieldSchema = schema.properties[fieldId];
        const fieldUiSchema = uiSchema[fieldId];
        const WidgetComponent = widgetRegistry[fieldUiSchema?.['ui:widget']];

        if (!WidgetComponent) {
          return <UnhandledWidget key={fieldId} fieldId={fieldId} widgetName={fieldUiSchema?.['ui:widget']} />;
        }

        return (
          <div key={fieldId}>
            <WidgetComponent
              label={fieldSchema.title}
              value={formData[fieldId]}
              onChange={(newValue: any) => handleFieldChange(fieldId, newValue)}
              options={fieldUiSchema['ui:options'] || {}}
              schema={fieldSchema} // Pass schema properties like min/max
            />
          </div>
        );
      })}
    </form>
  );
};

export default DynamicFormRenderer;