// src/components/form-builder/FormFieldWrapper.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/Button';
import { PiTrash, PiDotsSixVerticalBold } from 'react-icons/pi';
import { useFormBuilderStore } from '@/stores/formBuilderStore';
import { cn } from '@/lib/utils';
import DynamicFormRenderer from '../forms/DynamicFormRenderer';

interface FormFieldWrapperProps {
  fieldId: string;
}

const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({ fieldId }) => {
  const { selectedFieldId, setSelectedFieldId, removeField, schema, uiSchema } = useFormBuilderStore();
  const isSelected = selectedFieldId === fieldId;

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: fieldId });
  const style = { transform: CSS.Transform.toString(transform), transition };

  // Create a "mini" schema/uiSchema for rendering just this one field
  const singleFieldSchema = { title: '', description: '', type: 'object' as const, properties: { [fieldId]: schema.properties[fieldId] }};
  const singleFieldUiSchema = { [fieldId]: uiSchema[fieldId] };
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => setSelectedFieldId(fieldId)}
      className={cn("bg-card border-2 rounded-lg shadow-sm relative group p-4", isSelected ? 'border-primary' : 'border-transparent')}
    >
      <div {...attributes} {...listeners} className="absolute top-4 left-[-12px] p-2 cursor-grab touch-none text-muted-foreground">
        <PiDotsSixVerticalBold />
      </div>
      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); removeField(fieldId); }} className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100">
        <PiTrash />
      </Button>

      {/* Ignore form data and change handlers for preview purposes */}
      <div className="pointer-events-none">
        <DynamicFormRenderer
          schema={singleFieldSchema}
          uiSchema={singleFieldUiSchema}
          formData={{}}
          onFormDataChange={() => {}}
          fieldOrder={[fieldId]}
        />
      </div>
    </div>
  );
};

export default FormFieldWrapper;