import React from 'react';
import { Button } from '@/components/ui/Button';
import { useFormBuilderStoreV2, FieldType } from '@/stores/formBuilderStore.v2';
import { 
  PiTextT, 
  PiNumberCircleOne, 
  PiToggleLeft, 
  PiListNumbers, 
  PiListDashes, 
  PiCalendarDuotone,
  PiLayoutDuotone
} from 'react-icons/pi';

interface FieldTypeButton {
  type: FieldType | 'section';
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
  },
  /*
  {
    type: 'autocomplete-multiple',
    label: 'Autocomplete (Multi)',
    shortLabel: 'Auto (M)',
    icon: PiSparkleDuotone,
    description: 'Select from a list or add custom tags'
  }
  */
];

const ToolboxV2: React.FC = () => {
  const { addField, addSection, currentForm } = useFormBuilderStoreV2();

  const handleAdd = (type: FieldType | 'section') => {
    if (currentForm) {
      if (type === 'section') {
        addSection();
      } else {
        addField(type);
      }
    }
  };

  return (
    <div className="p-3 bg-card/60 backdrop-blur-xl border-b rounded-b-lg shadow-md">
        <div className="flex items-center justify-center gap-2">
          {fieldTypes.map((fieldType) => (
            <Button
              key={fieldType.type}
              variant="ghost"
              onClick={() => handleAdd(fieldType.type)}
              disabled={!currentForm}
              className="h-auto p-3 flex flex-col items-center justify-center text-center hover:bg-primary/10 transition-all active:scale-95 aspect-square w-20"
            >
              <fieldType.icon className="w-6 h-6 mb-1 text-primary" />
              <div className="font-medium text-[11px] leading-tight">
                {fieldType.label}
              </div>
            </Button>
          ))}
          <Button
            key="section"
            variant="ghost"
            onClick={() => handleAdd('section')}
            disabled={!currentForm}
            className="h-auto p-3 flex flex-col items-center justify-center text-center hover:bg-primary/10 transition-all active:scale-95 aspect-square w-20"
          >
            <PiLayoutDuotone className="w-6 h-6 mb-1 text-primary" />
            <div className="font-medium text-[11px] leading-tight">
              Section
            </div>
          </Button>
        </div>
    </div>
  );
};

export default ToolboxV2; 