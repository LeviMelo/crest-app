// src/components/form-builder/FormFieldWrapper.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/Button';
import { PiTrash, PiDotsSixVerticalBold } from 'react-icons/pi';
import { useFormBuilderStore } from '@/stores/formBuilderStore';
import { cn } from '@/lib/utils';

// This is a placeholder for the visual preview of widgets
const FieldPreview: React.FC<{ fieldId: string }> = ({ fieldId }) => {
  const { schema, uiSchema } = useFormBuilderStore();
  const fieldSchema = schema.properties[fieldId];
  const fieldUiSchema = uiSchema[fieldId];

  return (
    <div className="p-2">
      <p className="font-semibold text-sm">{fieldSchema?.title || 'Untitled Field'}</p>
      <p className="text-xs text-muted-foreground">Type: {fieldSchema?.type}</p>
      {fieldUiSchema?.['ui:options']?.enabledInputs && (
         <p className="text-xs text-muted-foreground">Inputs: {fieldUiSchema['ui:options'].enabledInputs.join(', ')}</p>
      )}
    </div>
  );
}

interface FormFieldWrapperProps {
  fieldId: string;
}

const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({ fieldId }) => {
  const { selectedFieldId, setSelectedFieldId, removeField } = useFormBuilderStore();
  const isSelected = selectedFieldId === fieldId;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: fieldId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => setSelectedFieldId(fieldId)}
      className={cn(
        "bg-card border-2 rounded-lg shadow-sm relative group",
        isSelected ? 'border-primary' : 'border-transparent hover:border-dashed hover:border-muted-foreground'
      )}
    >
      <div className="flex items-start">
        <div {...attributes} {...listeners} className="p-3 cursor-grab touch-none text-muted-foreground group-hover:bg-accent rounded-l-md">
            <PiDotsSixVerticalBold />
        </div>
        <div className="flex-grow">
            <FieldPreview fieldId={fieldId} />
        </div>
        <div className="p-1">
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); removeField(fieldId); }}>
                <PiTrash />
            </Button>
        </div>
      </div>
    </div>
  );
};

export default FormFieldWrapper;