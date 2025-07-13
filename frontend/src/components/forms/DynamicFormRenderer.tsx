// src/components/forms/DynamicFormRenderer.tsx
import React from 'react';
import { FormSchema, FormUiSchema } from '@/stores/formBuilderStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

// Widget Imports
import NumberWidget from './widgets/NumberWidget';
import TextWidget from './widgets/TextWidget';
import ChoiceWidget from './widgets/ChoiceWidget';
import BooleanWidget from './widgets/BooleanWidget';

interface DynamicFormRendererProps {
  schema: FormSchema;
  uiSchema: FormUiSchema;
  formData: any;
  onFormDataChange: (updatedData: any) => void;
}

const widgetRegistry: { [key: string]: React.ComponentType<any> } = {
  // Direct mapping from schema type
  string: TextWidget,
  number: NumberWidget,
  boolean: BooleanWidget,

  // Mappings from ui:widget options
  text: TextWidget,
  textarea: TextWidget,
  radio: ChoiceWidget,
  select: ChoiceWidget,
  checkboxes: ChoiceWidget,
  checkbox: BooleanWidget,
  switch: BooleanWidget,

  // Fallback for default NumberWidget from old schema
  NumberWidget,
};

const UnhandledWidget = ({ widgetName, fieldId }: { widgetName: string, fieldId: string }) => (
  <div className="p-2 border-dashed border-destructive bg-destructive/10 text-destructive text-xs rounded-md">
    Unhandled Widget: <strong>{widgetName || 'N/A'}</strong> for field <strong>{fieldId}</strong>
  </div>
);

const SafeWidget: React.FC<{ 
  WidgetComponent: React.ComponentType<any>;
  props: any;
  fieldId: string;
}> = ({ WidgetComponent, props, fieldId }) => {
  try {
    return <WidgetComponent {...props} />;
  } catch (error) {
    console.error(`Error rendering widget for field ${fieldId}:`, error);
    return (
      <div className="p-2 border-dashed border-destructive bg-destructive/10 text-destructive text-xs rounded-md">
        Error rendering field: <strong>{fieldId}</strong>
        <br />
        {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }
};

const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({
  schema,
  uiSchema,
  formData,
  onFormDataChange,
}) => {
  const handleFieldChange = (fieldId: string, newValue: any) => {
    onFormDataChange({
      ...formData,
      [fieldId]: newValue,
    });
  };

  // The new uiSchema has a 'ui:sections' property
  const sections = uiSchema['ui:sections'] || [];

  return (
    <form className="space-y-8">
      {sections.length === 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800">No sections found in form</p>
          <p className="text-yellow-600 text-sm">
            Schema properties: {Object.keys(schema.properties || {}).length} | UI Sections: {sections.length}
          </p>
        </div>
      )}
      {sections.map((section: any) => {
        return (
          <Card
            key={section.id}
            className="overflow-visible"
            style={section.styling?.color?.startsWith('#') ? {
              borderColor: section.styling.color,
              backgroundColor: `${section.styling.color}0d`, // ~6% opacity
            } : {}}
          >
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {(section['ui:order'] || []).length === 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800">No fields found in section "{section.title}"</p>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                {(section['ui:order'] || []).map((fieldId: string) => {
                  const fieldSchema = schema.properties[fieldId];
                  const fieldUiSchema = uiSchema[fieldId] || {};
                  const widgetName = fieldUiSchema['ui:widget'] || fieldSchema.type;
                  const WidgetComponent = widgetRegistry[widgetName];

                  if (!fieldSchema) {
                    return null;
                  }

                  if (!WidgetComponent) {
                    return <UnhandledWidget key={fieldId} fieldId={fieldId} widgetName={widgetName} />;
                  }

                  const widthClass = (() => {
                    const width = fieldUiSchema['ui:options']?.width || 'normal';
                    switch (width) {
                      case 'compact':
                        return 'flex-[1_1_200px] max-w-xs';
                      case 'wide':
                        return 'flex-[3_1_450px] max-w-lg';
                      default:
                        return 'flex-[2_1_320px] max-w-md';
                    }
                  })();

                  return (
                    <div key={fieldId} className={widthClass}>
                      <SafeWidget
                        WidgetComponent={WidgetComponent}
                        props={{
                          label: fieldSchema.title,
                          value: formData[fieldId],
                          onChange: (newValue: any) => handleFieldChange(fieldId, newValue),
                          options: fieldUiSchema['ui:options'] || {},
                          schema: fieldSchema,
                          fieldSchema: fieldSchema,
                        }}
                        fieldId={fieldId}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </form>
  );
};

export default DynamicFormRenderer;