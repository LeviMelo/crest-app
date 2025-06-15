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
  PiSparkleDuotone
} from 'react-icons/pi';

interface FieldTypeButton {
  type: FieldType;
  label: string;
  shortLabel?: string; // For mobile
  icon: React.ComponentType<any>;
  description: string;
}

const fieldTypes: FieldTypeButton[] = [
  {
    type: 'text',
    label: 'Text',
    shortLabel: 'Text',
    icon: PiTextT,
    description: 'Single line text input'
  },
  {
    type: 'number',
    label: 'Number',
    shortLabel: 'Num',
    icon: PiNumberCircleOne,
    description: 'Numeric input with units'
  },
  {
    type: 'boolean',
    label: 'Boolean',
    shortLabel: 'Bool',
    icon: PiToggleLeft,
    description: 'Yes/No checkbox'
  },
  {
    type: 'single-choice',
    label: 'Single Choice',
    shortLabel: 'Single',
    icon: PiListNumbers,
    description: 'Radio buttons or dropdown'
  },
  {
    type: 'multiple-choice',
    label: 'Multiple Choice',
    shortLabel: 'Multi',
    icon: PiListDashes,
    description: 'Checkboxes for multiple selection'
  },
  {
    type: 'date',
    label: 'Date',
    shortLabel: 'Date',
    icon: PiCalendarDuotone,
    description: 'Date picker input'
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
      <CardHeader className="flex-shrink-0 p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">
          <span className="hidden sm:inline">Field Types</span>
          <span className="sm:hidden">Fields</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground hidden sm:block">
          Click to add fields to your form
        </p>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto p-4 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
          {fieldTypes.map((fieldType) => (
            <Button
              key={fieldType.type}
              variant="outline"
              onClick={() => handleAddField(fieldType.type)}
              disabled={!currentForm}
              className="h-auto p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left hover:bg-accent hover:border-primary transition-all"
            >
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full">
                <fieldType.icon className="w-5 h-5 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <div className="flex-grow min-w-0">
                  <div className="font-medium text-xs sm:text-sm">
                    <span className="hidden sm:inline">{fieldType.label}</span>
                    <span className="sm:hidden">{fieldType.shortLabel || fieldType.label}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 hidden sm:block">
                    {fieldType.description}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
        
        {!currentForm && (
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              <span className="hidden sm:inline">Create or load a form to start adding fields</span>
              <span className="sm:hidden">Create form first</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ToolboxV2; 