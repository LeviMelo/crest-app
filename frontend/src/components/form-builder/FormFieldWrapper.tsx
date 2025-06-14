// src/components/form-builder/FormFieldWrapper.tsx
import React from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/Button';
import { PiTrash, PiDotsSixVerticalBold, PiColumnsDuotone } from 'react-icons/pi';
import { useFormBuilderStore } from '@/stores/formBuilderStore';
import { cn } from '@/lib/utils';
import { InputField } from '../ui/InputField';
import { Checkbox } from '../ui/Checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/RadioGroup';
import { Select, SelectTrigger, SelectValue } from '@/components/ui/Select';
import ToggledInputPreview from './previews/ToggledInputPreview';
import AutocompletePreview from './previews/AutocompletePreview';
import { FIELD_COLORS } from '@/config/formBuilder.config';
import { shallow } from 'zustand/shallow';

const FieldPreview: React.FC<{ fieldId: string }> = ({ fieldId }) => {
  const { fieldSchema, uiSchema: fieldUiSchema } = useFormBuilderStore(
    React.useCallback(
      (state) => {
        const { parentSchema } = state.findFieldParent(state, fieldId);
        return {
          fieldSchema: parentSchema?.properties?.[fieldId] ?? null,
          uiSchema: state.uiSchema[fieldId] ?? null,
        };
      },
      [fieldId]
    ),
    shallow
  );

  const options = fieldUiSchema?.['ui:options'] || {};
  const widget = fieldUiSchema?.['ui:widget'];

  if (!fieldSchema) return null;

  // Handle toggled inputs (like drugs) separately
  if (options.toggled) {
      return <ToggledInputPreview fieldId={fieldId} fieldSchema={fieldSchema} />
  }

  const renderPreview = () => {
    switch(widget) {
      case 'SectionWidget':
          return (
            <div className="flex items-center text-muted-foreground p-3">
                <PiColumnsDuotone className="w-5 h-5 mr-2"/>
                <p className="text-sm font-semibold">{fieldSchema.title}</p>
            </div>
          )
      case 'NumberWidget':
        return (
            <div className="space-y-2 pointer-events-none opacity-70">
                <InputField id={fieldId} label={fieldSchema.title} value="123" disabled addon={options.unit} />
                <div className="flex items-center gap-4 pl-1">
                    {options.enabledInputs?.includes('slider') && <div className="text-xs text-muted-foreground flex items-center gap-1">﹝Sldr﹞</div>}
                    {options.enabledInputs?.includes('stepper') && <div className="text-xs text-muted-foreground flex items-center gap-1">﹝Stpr﹞</div>}
                </div>
            </div>
        )
      case 'BooleanWidget':
        return <div className="flex items-center space-x-2 p-2 opacity-70"><Checkbox id={fieldId} disabled readOnly defaultChecked /><label htmlFor={fieldId} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{fieldSchema.title}</label></div>
      case 'ChoiceWidget':
        const choiceSource = fieldSchema.type === 'array' ? fieldSchema.items : fieldSchema;
        const choices = (choiceSource.enum || []).map((val: string, i: number) => ({ value: val, label: choiceSource.enumNames?.[i] || val }));
        
        if (options.displayAs === 'autocompleteTags') {
            return <AutocompletePreview fieldSchema={fieldSchema} uiOptions={options} />
        }
        
        if (options.displayAs === 'radio') {
          return (
            <fieldset disabled className="pointer-events-none space-y-2 opacity-70">
              <legend className="text-sm font-medium">{fieldSchema.title}</legend>
              <RadioGroup>
                {(choices.length > 0 ? choices : [{value: 'opt1', label: 'Option 1'}]).map((c: { value: string; label: string }) => <div key={c.value} className="flex items-center space-x-2"><RadioGroupItem value={c.value} id={`${fieldId}-${c.value}`}/><label htmlFor={`${fieldId}-${c.value}`}>{c.label}</label></div>)}
              </RadioGroup>
            </fieldset>
          );
        }

        if (options.displayAs === 'checkboxGroup') {
            return (
                <fieldset disabled className="pointer-events-none space-y-2 opacity-70">
                  <legend className="text-sm font-medium">{fieldSchema.title}</legend>
                  {(choices.length > 0 ? choices : [{value: 'opt1', label: 'Option 1'}]).map((c: { value: string; label: string }) => <div key={c.value} className="flex items-center space-x-2"><Checkbox id={`${fieldId}-${c.value}`} readOnly defaultChecked={c.value === 'opt1'} /><label htmlFor={`${fieldId}-${c.value}`}>{c.label}</label></div>)}
                </fieldset>
            )
        }
        
        // Fallback for dropdown
        return (
            <div className="space-y-1.5 pointer-events-none opacity-70">
                <label className="text-sm font-medium">{fieldSchema.title}</label>
                <Select disabled>
                    <SelectTrigger>
                        <SelectValue placeholder={choices[0]?.label || 'Select...'} />
                    </SelectTrigger>
                </Select>
            </div>
        );
      default: // TextWidget and others
        return <InputField id={fieldId} label={fieldSchema.title} placeholder={options.placeholder} disabled className="pointer-events-none opacity-70" />;
    }
  };

  return <div className="p-3">{renderPreview()}</div>;
}

interface FormFieldWrapperProps {
  fieldId: string;
  parentId: string | null;
}

const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({ fieldId, parentId }) => {
  const { schema, uiSchema, selectedFieldId, setSelectedFieldId, removeField, findFieldParent } = useFormBuilderStore();
  const { parentSchema } = findFieldParent(useFormBuilderStore.getState(), fieldId);
  const fieldSchema = parentSchema?.properties?.[fieldId];
  const fieldUiSchema = uiSchema[fieldId];
  const colorName = fieldUiSchema?.['ui:options']?.color || 'secondary';
  const color = FIELD_COLORS.find(c => c.name === colorName) || FIELD_COLORS[1];

  const isSelected = selectedFieldId === fieldId;
  const isSection = fieldSchema?.type === 'object';
  const childIds = (isSection && fieldUiSchema?.['ui:order']) || [];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: fieldId, data: { parentId, isSection } });
  
  const { setNodeRef: droppableSetNodeRef, isOver } = useDroppable({ id: fieldId, data: { isSection: true } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const sectionGridClass = isSection ? `grid-cols-${uiSchema[fieldId]?.['ui:options']?.columns || 1}` : '';

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => { e.stopPropagation(); setSelectedFieldId(fieldId); }}
      className={cn(
        "bg-card border-2 rounded-lg shadow-sm relative group transition-all cursor-pointer",
        isSelected ? 'border-primary shadow-lg' : 'border-transparent',
        !isSection && 'hover:border-dashed hover:border-slate-400 dark:hover:border-slate-600',
        color.className,
        isSection && isOver && 'ring-2 ring-primary ring-offset-2'
      )}
    >
      <div className="flex items-start">
        <div {...attributes} {...listeners} className={cn("p-3 cursor-grab touch-none self-stretch flex items-center rounded-l-md transition-colors", isSelected ? 'bg-primary/20' : 'group-hover:bg-accent')}>
            <PiDotsSixVerticalBold />
        </div>
        <div className="flex-grow min-w-0">
            <FieldPreview fieldId={fieldId} />
        </div>
        <div className="p-1 self-start">
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); removeField(fieldId); }}>
                <PiTrash />
            </Button>
        </div>
      </div>

      {isSection && (
        <div ref={droppableSetNodeRef} className={cn("min-h-[80px] p-4 rounded-b-lg bg-background/50", isOver && "bg-primary/10")}>
           <SortableContext items={childIds} strategy={verticalListSortingStrategy}>
              <div className={cn("space-y-4 grid", sectionGridClass)}>
                  {childIds.length > 0 ? childIds.map(childId => (
                      <FormFieldWrapper key={childId} fieldId={childId} parentId={fieldId} />
                  )) : (
                      <div className="text-center py-6 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                          <p>Drop a field here</p>
                      </div>
                  )}
              </div>
           </SortableContext>
        </div>
      )}
    </div>
  );
};

export default FormFieldWrapper;