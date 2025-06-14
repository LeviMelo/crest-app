import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useFormBuilderStoreV2, FieldType } from '@/stores/formBuilderStore.v2';
import { 
  PiTextT, 
  PiNumberCircleOne, 
  PiToggleLeft, 
  PiListNumbers, 
  PiListDashes, 
  PiCalendarDuotone,
  PiColumnsDuotone 
} from 'react-icons/pi';

interface FieldTypeButton {
  type: FieldType;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}

const fieldTypes: FieldTypeButton[] = [
  {
    type: 'text',
    label: 'Text',
    icon: PiTextT,
    description: 'Single line text input'
  },
  {
    type: 'number',
    label: 'Number',
    icon: PiNumberCircleOne,
    description: 'Numeric input with units'
  },
  {
    type: 'boolean',
    label: 'Boolean',
    icon: PiToggleLeft,
    description: 'Yes/No checkbox'
  },
  {
    type: 'single-choice',
    label: 'Single Choice',
    icon: PiListNumbers,
    description: 'Radio buttons or dropdown'
  },
  {
    type: 'multiple-choice',
    label: 'Multiple Choice',
    icon: PiListDashes,
    description: 'Checkboxes for multiple selection'
  },
  {
    type: 'date',
    label: 'Date',
    icon: PiCalendarDuotone,
    description: 'Date picker input'
  },
  {
    type: 'section',
    label: 'Section',
    icon: PiColumnsDuotone,
    description: 'Container for grouping fields'
  }
];

const ToolboxV2: React.FC = () => {
  const { addField, currentForm } = useFormBuilderStoreV2();

  const handleAddField = (type: FieldType) => {
    if (currentForm) {
      addField(type);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-lg">Field Types</CardTitle>
        <p className="text-sm text-muted-foreground">
          Click to add fields to your form
        </p>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto">
        <div className="grid grid-cols-1 gap-3">
          {fieldTypes.map((fieldType) => (
            <Button
              key={fieldType.type}
              variant="outline"
              onClick={() => handleAddField(fieldType.type)}
              disabled={!currentForm}
              className="h-auto p-4 flex flex-col items-start text-left hover:bg-accent hover:border-primary transition-all"
            >
              <div className="flex items-center gap-3 w-full">
                <fieldType.icon className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="flex-grow min-w-0">
                  <div className="font-medium">{fieldType.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {fieldType.description}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
        
        {!currentForm && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              Create or load a form to start adding fields
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ToolboxV2; 