// src/components/forms/DynamicFormRenderer.tsx
import React from 'react';

// For a truly scalable solution, widgets would be lazy-loaded.
// For now, we'll import them directly. This is a key area for future optimization.
import { InputField } from '@/components/ui/InputField';
// Assume other form widgets will be created in future steps.

interface DynamicFormRendererProps {
  schema: any;
  uiSchema: any;
  formData: any;
  onFormDataChange: (updatedData: any) => void;
}

// A simple widget registry.
const widgetRegistry: { [key: string]: React.ComponentType<any> } = {
  InputFieldWidget: InputField,
  // Other widgets like SelectFieldWidget, RadioButtonGroupField, etc., would be registered here.
};

const UnhandledWidget = ({ propertyName, widgetName }: { propertyName: string, widgetName: string }) => (
  <div className="mb-4 p-2 border border-dashed border-destructive text-sm text-destructive rounded-md bg-destructive/10">
    <p><strong>Unhandled Widget:</strong> <code>{widgetName || 'Default'}</code> for field <code>{propertyName}</code>.</p>
  </div>
);

const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({
  schema,
  uiSchema,
  formData,
  onFormDataChange,
}) => {
  if (!schema || !schema.properties) {
    return <p className="text-destructive">Schema not provided or is invalid.</p>;
  }

  const renderField = (propertyName: string, propertySchema: any) => {
    const uiOptions = uiSchema[propertyName] || {};
    const widgetName = uiOptions['ui:widget'];
    const WidgetComponent = widgetName ? widgetRegistry[widgetName] : null;

    if (!WidgetComponent) {
      return (
        <UnhandledWidget
          key={propertyName}
          propertyName={propertyName}
          widgetName={widgetName}
        />
      );
    }

    const fieldUiOptions = uiOptions['ui:options'] || {};

    const commonProps = {
      id: propertyName,
      label: propertySchema.title || propertyName,
      required: schema.required?.includes(propertyName) || fieldUiOptions.required,
      value: formData[propertyName],
      onChange: (valueOrEvent: any) => {
        const newValue = valueOrEvent?.target ? valueOrEvent.target.value : valueOrEvent;
        onFormDataChange({ ...formData, [propertyName]: newValue });
      },
      ...fieldUiOptions, // Pass all other ui:options as props
    };

    return <WidgetComponent key={propertyName} {...commonProps} />;
  };

  return (
    <form className="space-y-8">
      {Object.keys(schema.properties).map((propertyName) =>
        renderField(propertyName, schema.properties[propertyName])
      )}
    </form>
  );
};

export default DynamicFormRenderer;