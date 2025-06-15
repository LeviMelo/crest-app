import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useFormBuilderStoreV2, Field } from '@/stores/formBuilderStore.v2';
import { PiTrash, PiCopy, PiPlus, PiDotsSixVerticalBold, PiCaretDown, PiCaretRight } from 'react-icons/pi';
import { cn } from '@/lib/utils';
import { InputField } from '@/components/ui/InputField';
import { Checkbox } from '@/components/ui/Checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select';
import { Slider } from '@/components/ui/Slider';
import Stepper from '@/components/ui/Stepper';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, KeyboardSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Switch } from '@/components/ui/Switch';
import { Combobox } from '@/components/ui/Combobox';
import { Input } from '@/components/ui/Input';
import { AnimatePresence, motion } from 'framer-motion';

// Allow custom CSS properties
interface CSSPropertiesWithVars extends React.CSSProperties {
  [key: `--${string}`]: string | number;
}

const BUTTON_COLOR_MAP: { [key: string]: { selected: string; unselected: string } } = {
  primary: { selected: 'bg-primary text-primary-foreground hover:bg-primary/90', unselected: 'border-primary text-primary hover:bg-primary/10' },
  secondary: { selected: 'bg-slate-500 text-white hover:bg-slate-600', unselected: 'border-slate-500 text-slate-600 hover:bg-slate-500/10' },
  accent: { selected: 'bg-amber-500 text-white hover:bg-amber-600', unselected: 'border-amber-500 text-amber-600 hover:bg-amber-500/10' },
  success: { selected: 'bg-emerald-500 text-white hover:bg-emerald-600', unselected: 'border-emerald-500 text-emerald-600 hover:bg-emerald-500/10' },
  warning: { selected: 'bg-orange-500 text-white hover:bg-orange-600', unselected: 'border-orange-500 text-orange-600 hover:bg-orange-500/10' },
  danger: { selected: 'bg-red-500 text-white hover:bg-red-600', unselected: 'border-red-500 text-red-600 hover:bg-red-500/10' },
  blue: { selected: 'bg-blue-500 text-white hover:bg-blue-600', unselected: 'border-blue-500 text-blue-600 hover:bg-blue-500/10' },
  indigo: { selected: 'bg-indigo-500 text-white hover:bg-indigo-600', unselected: 'border-indigo-500 text-indigo-600 hover:bg-indigo-500/10' },
  purple: { selected: 'bg-purple-500 text-white hover:bg-purple-600', unselected: 'border-purple-500 text-purple-600 hover:bg-purple-500/10' },
  pink: { selected: 'bg-pink-500 text-white hover:bg-pink-600', unselected: 'border-pink-500 text-pink-600 hover:bg-pink-500/10' },
  teal: { selected: 'bg-teal-500 text-white hover:bg-teal-600', unselected: 'border-teal-500 text-teal-600 hover:bg-teal-500/10' },
  cyan: { selected: 'bg-cyan-500 text-white hover:bg-cyan-600', unselected: 'border-cyan-500 text-cyan-600 hover:bg-cyan-500/10' },
};

type FontSize = 'sm' | 'base' | 'lg';

// Field preview component that shows how the field will look
const FieldPreview: React.FC<{ field: Field; fontSize?: FontSize }> = ({ field, fontSize = 'base' }) => {
  const { updateFieldDefaultValue } = useFormBuilderStoreV2();

  const handleValueChange = (value: any) => {
    updateFieldDefaultValue(field.id, value);
  };

  const labelClasses = {
    sm: 'text-xs',
    base: 'text-sm',
    lg: 'text-base'
  }[fontSize];

  const descriptionClasses = {
    sm: 'text-[11px]',
    base: 'text-xs',
    lg: 'text-sm'
  }[fontSize];

  const RequiredBadge = () => field.required ? (
    <div className={cn("font-semibold uppercase bg-destructive/10 text-destructive rounded-full px-2 py-0.5", 
      { 'text-[9px]': fontSize === 'sm', 'text-[10px]': fontSize === 'base', 'text-xs': fontSize === 'lg'}
    )}>
      Required
    </div>
  ) : null;

  const getChoiceGroupLayoutClasses = () => {
    const layout = field.options.layout || { style: 'auto' };
    if (layout.style === 'columns' && layout.columns) {
      return `grid grid-cols-${layout.columns} gap-x-6 gap-y-2 pt-1`;
    }
    // Default to 'auto'
    return "flex flex-wrap gap-x-6 gap-y-2 pt-1";
  };

  const getFieldPreview = () => {
    const isStructuredDefault = field.defaultValue && typeof field.defaultValue === 'object' && 'value' in field.defaultValue;

    const value = isStructuredDefault ? field.defaultValue.value : field.defaultValue;
    const isToggled = isStructuredDefault ? (field.defaultValue.toggled || false) : false;

    const onRendererValueChange = (newValue: any) => {
      if (isStructuredDefault) {
        handleValueChange({ ...field.defaultValue, value: newValue });
      } else {
        handleValueChange(newValue);
      }
    };

    const tempField = { ...field, defaultValue: value };

    if (field.options.togglable) {
      const handleToggle = (toggled: boolean) => {
        handleValueChange({ ...(isStructuredDefault ? field.defaultValue : { value }), toggled });
      };
      
      const hasValue = value !== null && value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0);

      const renderCollapsedValue = () => {
        if (!hasValue) return null;
        let displayValue = '';
        switch(field.type) {
            case 'number':
                displayValue = `${value}${field.options.unit || ''}`;
                break;
            case 'single-choice':
                displayValue = field.options.choices?.find(c => c.value === value)?.label || String(value);
                break;
            case 'multiple-choice':
                const labels = (value as string[]).map(v => field.options.choices?.find(c => c.value === v)?.label || v);
                displayValue = labels.join(', ');
                break;
            default:
                displayValue = String(value);
        }
        return <span className="text-muted-foreground ml-2 truncate">: {displayValue}</span>
      }

      return (
        <div className="space-y-1.5">
          <div className="flex items-center space-x-3">
             <Switch
              id={`toggle-${field.id}`}
              checked={isToggled}
              onCheckedChange={handleToggle}
            />
            <div className="flex-1 flex items-baseline min-w-0">
              <label htmlFor={`toggle-${field.id}`} className={cn("font-medium", labelClasses, "cursor-pointer truncate")}>
                {field.label}
              </label>
              {!isToggled && renderCollapsedValue()}
            </div>
            <RequiredBadge />
          </div>
          <AnimatePresence>
            {isToggled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pl-7"
              >
                <div className="pt-2">
                  {field.description && <p className={cn("text-muted-foreground mb-2", descriptionClasses)}>{field.description}</p>}
                  <FieldRenderer field={tempField} fontSize={fontSize} onValueChange={onRendererValueChange} showLabel={false} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }
    
    return <FieldRenderer field={tempField} fontSize={fontSize} onValueChange={onRendererValueChange} showLabel={true} />
  };

  return <div className="p-3">{getFieldPreview()}</div>;
};

// This new component contains the original rendering logic from getFieldPreview
const FieldRenderer: React.FC<{ 
  field: Field, 
  fontSize: FontSize, 
  onValueChange: (value: any) => void,
  showLabel: boolean
}> = ({ field, fontSize, onValueChange: handleValueChange, showLabel }) => {
    const labelClasses = { sm: 'text-xs', base: 'text-sm', lg: 'text-base' }[fontSize];
    const descriptionClasses = { sm: 'text-[11px]', base: 'text-xs', lg: 'text-sm' }[fontSize];
    const RequiredBadge = () => field.required ? (
      <div className={cn("font-semibold uppercase bg-destructive/10 text-destructive rounded-full px-2 py-0.5", { 'text-[9px]': fontSize === 'sm', 'text-[10px]': fontSize === 'base', 'text-xs': fontSize === 'lg'})}>Required</div>
    ) : null;
    const getChoiceGroupLayoutClasses = () => {
      const layout = field.options.layout || { style: 'auto' };
      if (layout.style === 'columns' && layout.columns) {
        return `grid grid-cols-${layout.columns} gap-x-6 gap-y-2 pt-1`;
      }
      return "flex flex-wrap gap-x-6 gap-y-2 pt-1";
    };

    const getButtonColorClasses = (fieldColor: string, isSelected: boolean): string => {
      const color = fieldColor || 'primary';
      if (color.startsWith('#')) {
        return isSelected
          ? 'bg-[var(--field-color)] text-white hover:opacity-90 border-transparent'
          : 'border-[var(--field-color)] text-[var(--field-color)] hover:bg-[var(--field-color-light)]';
      }
      const styles = BUTTON_COLOR_MAP[color] || BUTTON_COLOR_MAP.primary;
      return isSelected ? styles.selected : styles.unselected;
    };

  switch (field.type) {
    case 'text':
    case 'date':
      return (
        <div className="space-y-1.5">
          {showLabel && (
            <>
              <div className="flex items-center justify-between">
                <label className={cn("font-medium", labelClasses)}>{field.label}</label>
                <RequiredBadge />
              </div>
              {field.description && <p className={cn("text-muted-foreground -mt-1", descriptionClasses)}>{field.description}</p>}
            </>
          )}
          
          {field.type === 'text' && <Input type="text" value={field.defaultValue || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleValueChange(e.target.value)} />}
          {field.type === 'date' && <Input type="date" value={field.defaultValue || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleValueChange(e.target.value)} />}
        </div>
      );
    case 'number':
      const enabledInputs = field.options.enabledInputs || ['input'];
      const value = field.defaultValue || 0;
      const minRule = field.validation?.find(r => r.type === 'min');
      const maxRule = field.validation?.find(r => r.type === 'max');
      const min = minRule ? Number(minRule.value) : undefined;
      const max = maxRule ? Number(maxRule.value) : undefined;

      return (
        <div className="space-y-1.5">
          {showLabel && (
            <>
              <div className="flex items-center justify-between">
                <label className={cn("font-medium", labelClasses)}>{field.label}</label>
                <RequiredBadge />
              </div>
              {field.description && <p className={cn("text-muted-foreground -mt-1", descriptionClasses)}>{field.description}</p>}
            </>
          )}
          
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {enabledInputs.includes('input') && (
                <div className="relative w-full sm:w-40">
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => handleValueChange(e.target.valueAsNumber)}
                    min={min}
                    max={max}
                    className={cn(field.options.unit ? "pr-12" : "")}
                  />
                  {field.options.unit && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-muted-foreground sm:text-sm">{field.options.unit}</span>
                    </div>
                  )}
                </div>
              )}
              {enabledInputs.includes('stepper') && (
                <Stepper
                  value={value}
                  onValueChange={handleValueChange}
                  min={min}
                  max={max}
                />
              )}
            </div>
            {enabledInputs.includes('slider') && (
              <Slider
                value={[value]}
                onValueChange={(vals) => handleValueChange(vals[0])}
                min={min}
                max={max}
                step={1}
              />
            )}
          </div>
        </div>
      );
    case 'boolean':
      if (field.options.displayAs === 'switch') {
        return (
          <div className="flex items-start space-x-3 p-2">
            <Switch
              id={`preview-${field.id}`}
              checked={field.defaultValue || false}
              onCheckedChange={(checked: boolean) => handleValueChange(checked)}
              className="mt-1"
            />
            <div className="grid gap-1.5">
              {showLabel && (
                <>
                  <div className="flex items-center justify-between">
                    <label htmlFor={`preview-${field.id}`} className={cn("font-medium leading-none", labelClasses)}>
                      {field.label}
                    </label>
                    <RequiredBadge />
                  </div>
                  {field.description && <p className={cn("text-muted-foreground", descriptionClasses)}>{field.description}</p>}
                </>
              )}
            </div>
          </div>
        );
      }
      return (
        <div className="flex items-start space-x-3 p-2">
          <Checkbox
            id={`preview-${field.id}`}
            checked={field.defaultValue || false}
            onChange={(e) => handleValueChange(e.target.checked)}
            className="mt-1"
          />
          <div className="grid gap-1.5">
            {showLabel && (
              <>
                <div className="flex items-center justify-between">
                  <label htmlFor={`preview-${field.id}`} className={cn("font-medium leading-none", labelClasses)}>
                    {field.label}
                  </label>
                  <RequiredBadge />
                </div>
                {field.description && <p className={cn("text-muted-foreground", descriptionClasses)}>{field.description}</p>}
              </>
            )}
          </div>
        </div>
      );
    case 'single-choice':
      const singleChoices = field.options.choices || [];
      if (field.options.displayAs === 'radio') {
        return (
          <fieldset>
            {showLabel && (
              <>
                <div className="flex items-center justify-between mb-1">
                  <legend className={cn("font-medium truncate", labelClasses)}>
                    {field.label}
                  </legend>
                  <RequiredBadge />
                </div>
                {field.description && <p className={cn("text-muted-foreground mb-2", descriptionClasses)}>{field.description}</p>}
              </>
            )}
            <RadioGroup
              value={field.defaultValue}
              onValueChange={handleValueChange}
              className={getChoiceGroupLayoutClasses()}
            >
              {singleChoices.map((choice) => (
                <div key={choice.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={choice.value} id={`${field.id}-${choice.value}`} />
                  <label htmlFor={`${field.id}-${choice.value}`} className={cn("truncate", labelClasses)}>{choice.label}</label>
                </div>
              ))}
            </RadioGroup>
          </fieldset>
        );
      } else { // Dropdown or Button Group
        if (field.options.displayAs === 'button-group') {
          return (
             <fieldset>
              {showLabel && (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <legend className={cn("font-medium truncate", labelClasses)}>
                      {field.label}
                    </legend>
                    <RequiredBadge />
                  </div>
                  {field.description && <p className={cn("text-muted-foreground mb-2", descriptionClasses)}>{field.description}</p>}
                </>
              )}
              <div className={getChoiceGroupLayoutClasses()}>
                {singleChoices.map(choice => (
                  <Button
                    key={choice.value}
                    variant={field.defaultValue === choice.value ? 'default' : 'outline'}
                    onClick={() => handleValueChange(choice.value)}
                    className={getButtonColorClasses(field.styling.color, field.defaultValue === choice.value)}
                  >
                    {choice.label}
                  </Button>
                ))}
              </div>
            </fieldset>
          )
        }
        // Default to Dropdown
        return (
          <div>
            {showLabel && (
              <>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor={`preview-${field.id}`} className={cn("font-medium", labelClasses)}>
                    {field.label}
                  </label>
                  <RequiredBadge />
                </div>
                {field.description && <p className={cn("text-muted-foreground -mt-1", descriptionClasses)}>{field.description}</p>}
              </>
            )}
            <Select onValueChange={handleValueChange} value={field.defaultValue}>
                <SelectTrigger id={`preview-${field.id}`}>
                    <SelectValue placeholder="Select an option..." />
                </SelectTrigger>
                <SelectContent>
                    {singleChoices.map(choice => (
                        <SelectItem key={choice.value} value={choice.value}>
                            {choice.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
        )
      }
    case 'multiple-choice':
      const multiChoices = field.options.choices || [];
      const selectedValues = new Set(Array.isArray(field.defaultValue) ? field.defaultValue : []);

      return (
        <fieldset>
          {showLabel && (
            <>
              <div className="flex items-center justify-between mb-1">
                <legend className={cn("font-medium truncate", labelClasses)}>
                  {field.label}
                </legend>
                <RequiredBadge />
              </div>
              {field.description && <p className={cn("text-muted-foreground mb-2", descriptionClasses)}>{field.description}</p>}
            </>
          )}
          
          {field.options.displayAs === 'button-group' && (
            <div className={getChoiceGroupLayoutClasses()}>
              {multiChoices.map(choice => {
                const isSelected = selectedValues.has(choice.value);
                return (
                  <Button
                    key={choice.value}
                    variant={isSelected ? 'default' : 'outline'}
                    onClick={() => {
                      const newSelected = new Set(selectedValues);
                      if (isSelected) {
                        newSelected.delete(choice.value);
                      } else {
                        newSelected.add(choice.value);
                      }
                      handleValueChange(Array.from(newSelected));
                    }}
                    className={getButtonColorClasses(field.styling.color, isSelected)}
                  >
                    {choice.label}
                  </Button>
                )
              })}
            </div>
          )}

          {field.options.displayAs !== 'button-group' && (
            <div className={getChoiceGroupLayoutClasses()}>
              {multiChoices.map((choice) => (
                <div key={choice.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.id}-${choice.value}`}
                    checked={selectedValues.has(choice.value)}
                    onChange={(e) => {
                      const newSelected = new Set(selectedValues);
                      if (e.target.checked) {
                        newSelected.add(choice.value);
                      } else {
                        newSelected.delete(choice.value);
                      }
                      handleValueChange(Array.from(newSelected));
                    }}
                  />
                  <label htmlFor={`${field.id}-${choice.value}`} className={cn("truncate", labelClasses)}>{choice.label}</label>
                </div>
              ))}
            </div>
          )}
        </fieldset>
      );
    default:
      return (
        <div className="p-2 border-dashed border-destructive bg-destructive/10 text-destructive text-xs rounded-md">
          Unhandled Field Type: <strong>{field.type}</strong>
        </div>
      );
  }
};

// Individual field component with selection and editing
const FieldComponent: React.FC<{ fieldId: string; sectionId: string; fontSize?: FontSize }> = ({ fieldId, sectionId, fontSize }) => {
  const { getField, selectField, selectedFieldId, removeField, duplicateField } = useFormBuilderStoreV2();
  const field = getField(fieldId);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: fieldId, 
    data: { 
      type: 'field',
      fieldId,
      sectionId 
    } 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (!field) return null;

  const isSelected = selectedFieldId === fieldId;

  const customColor = field.styling.color?.startsWith('#') ? field.styling.color : null;
  
  const fieldStyle: CSSPropertiesWithVars = {
    ...style
  };

  if (customColor) {
    fieldStyle['--field-color'] = customColor;
    fieldStyle['--field-color-light'] = `${customColor}1a`; // For background
  }

  // Define width classes based on field styling
  const widthClass = {
    compact: 'flex-[1_1_200px] max-w-xs',
    normal: 'flex-[2_1_320px] max-w-md',
    wide: 'flex-[3_1_450px] max-w-lg',
  }[field.styling.width || 'normal'];

  return (
    <div
      ref={setNodeRef}
      style={fieldStyle}
      onClick={(e) => {
        e.stopPropagation();
        selectField(fieldId);
      }}
      className={cn(
        "bg-card border-2 rounded-lg shadow-sm relative group transition-all flex flex-col",
        widthClass, // Apply responsive width class
        isSelected ? 'border-primary shadow-lg' : 'border-transparent hover:border-slate-400 dark:hover:border-slate-600',
        customColor 
          ? 'border-[var(--field-color)] bg-[var(--field-color-light)]'
          : {
            'border-primary/50 bg-primary/5': field.styling.color === 'primary',
            'border-slate-500/50 bg-slate-500/5': field.styling.color === 'secondary',
            'border-amber-500/50 bg-amber-500/5': field.styling.color === 'accent',
            'border-emerald-500/50 bg-emerald-500/5': field.styling.color === 'success',
            'border-orange-500/50 bg-orange-500/5': field.styling.color === 'warning',
            'border-red-500/50 bg-red-500/5': field.styling.color === 'danger'
          },
        isDragging && 'shadow-2xl scale-105'
      )}
    >
      <div className="flex items-start flex-grow">
        {/* Drag handle */}
        <div 
          {...attributes} 
          {...listeners}
          className={cn(
            "p-2 sm:p-3 cursor-grab touch-none self-stretch flex items-center rounded-l-md transition-colors",
            isSelected ? 'bg-primary/20' : 'group-hover:bg-accent'
          )}
        >
          <PiDotsSixVerticalBold className="w-4 h-4" />
        </div>
        
        {/* Field content */}
        <div className="flex-grow min-w-0">
          <FieldPreview field={field} fontSize={fontSize} />
        </div>
        
        {/* Action buttons - always rendered, visibility controlled by opacity */}
        <div className={cn(
            "p-1 self-start flex flex-col gap-0.5 transition-opacity duration-200",
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus-within:opacity-100"
        )}>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              duplicateField(fieldId);
            }}
            className="h-7 w-7"
          >
            <PiCopy className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              removeField(fieldId);
            }}
            className="h-7 w-7 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
          >
            <PiTrash className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Section component that can contain fields and be dragged
const SectionComponent: React.FC<{ sectionId: string }> = ({ sectionId }) => {
  const { getSection, addField, selectField, selectedFieldId, removeField, toggleSectionCollapse } = useFormBuilderStoreV2();
  const section = getSection(sectionId);

  const {
    attributes,
    listeners,
    setNodeRef: sortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: sectionId, 
    data: { 
      type: 'section',
      sectionId 
    } 
  });

  const { setNodeRef: droppableRef, isOver } = useDroppable({ 
    id: sectionId,
    data: {
      type: 'section',
      sectionId
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (!section) return null;

  const isSelected = selectedFieldId === sectionId;
  const isCollapsed = section.collapsed; // Do not automatically collapse when dragging

  const customColor = section.styling.color?.startsWith('#') ? section.styling.color : null;
  
  const sectionStyle: CSSPropertiesWithVars = {
    ...style
  };
  
  if (customColor) {
    sectionStyle['--section-color'] = customColor;
    sectionStyle['--section-color-light'] = `${customColor}1a`; // For background
  }

  // Apply section colors properly
  const getSectionColorClasses = (color: string) => {
    if (color.startsWith('#')) {
      return 'border-[var(--section-color)] bg-[var(--section-color-light)]';
    }
    switch (color) {
      case 'primary':
        return 'border-primary/50 bg-primary/5';
      case 'secondary':
        return 'border-slate-500/50 bg-slate-500/5';
      case 'accent':
        return 'border-amber-500/50 bg-amber-500/5';
      case 'success':
        return 'border-emerald-500/50 bg-emerald-500/5';
      case 'warning':
        return 'border-orange-500/50 bg-orange-500/5';
      case 'danger':
        return 'border-red-500/50 bg-red-500/5';
      default:
        return 'border-slate-500/50 bg-slate-500/5';
    }
  };

  const setCombinedRef = (node: HTMLElement | null) => {
    sortableRef(node);
    droppableRef(node);
  };

  return (
    <div
      ref={setCombinedRef}
      style={sectionStyle}
      onClick={(e) => {
        e.stopPropagation();
        selectField(sectionId);
      }}
      className={cn(
        "bg-card border-2 rounded-lg shadow-sm relative transition-all cursor-pointer",
        isSelected ? 'border-primary shadow-lg ring-2 ring-primary/20' : 'border-border hover:border-primary/50',
        getSectionColorClasses(section.styling.color),
        isDragging && 'shadow-2xl scale-105'
      )}
    >
      {/* Section header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div 
            {...attributes} 
            {...listeners}
            className={cn(
              "p-1 sm:p-2 cursor-grab active:cursor-grabbing touch-none flex items-center rounded transition-colors flex-shrink-0",
              isSelected ? 'bg-primary/20' : 'hover:bg-accent'
            )}
          >
            <PiDotsSixVerticalBold className="w-4 h-4" />
          </div>
          
          {/* Collapse/Expand button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              toggleSectionCollapse(sectionId);
            }}
            className="p-1 h-auto"
          >
            {isCollapsed ? (
              <PiCaretRight className="w-4 h-4" />
            ) : (
              <PiCaretDown className="w-4 h-4" />
            )}
          </Button>
          
          <h3 className="font-semibold text-base sm:text-lg truncate">{section.title}</h3>
          <span className="text-xs text-muted-foreground">
            ({section.fields.length} field{section.fields.length !== 1 ? 's' : ''})
          </span>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              addField('text', sectionId);
            }}
            className="text-xs sm:text-sm"
          >
            <PiPlus className="w-3 h-3 sm:mr-1" />
            <span className="hidden sm:inline">Add Field</span>
          </Button>
          {isSelected && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                removeField(sectionId);
              }}
            >
              <PiTrash className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Section content - only show when not collapsed */}
      {!isCollapsed && (
        <div 
          className={cn(
            "p-3 sm:p-4 transition-colors",
            isOver && "bg-primary/10"
          )}
        >
          <SortableContext items={section.fields} strategy={verticalListSortingStrategy}>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {section.fields.length > 0 ? (
                section.fields.map(fieldId => (
                  <FieldComponent key={fieldId} fieldId={fieldId} sectionId={sectionId} fontSize={section.styling.fontSize} />
                ))
              ) : (
                <div className="col-span-full text-center py-6 sm:py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  <p className="text-sm">Drop fields here or click "Add Field"</p>
                </div>
              )}
            </div>
          </SortableContext>
        </div>
      )}
      
      {/* Collapsed state indicator */}
      {isCollapsed && !isDragging && (
        <div className="p-3 sm:p-4 text-center text-muted-foreground">
          <p className="text-sm">Section collapsed - click to expand</p>
        </div>
      )}
    </div>
  );
};

const CanvasV2: React.FC = () => {
  const { currentForm, addSection, selectField, moveField, moveSections } = useFormBuilderStoreV2();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before activating
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !currentForm || active.id === over.id) {
        return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;
    
    const activeData = active.data.current;
    const overData = over.data.current;

    // Reordering sections
    if (activeData?.type === 'section') {
        const oldIndex = currentForm.layout.sections.findIndex(s => s.id === activeId);
        
        // Find the target section, even if we are hovering over a field within it
        const overSection = currentForm.layout.sections.find(s => s.id === overId || s.fields.includes(overId));
        if (!overSection) return;
        const newIndex = currentForm.layout.sections.findIndex(s => s.id === overSection.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            moveSections(oldIndex, newIndex);
        }
        return;
    }
    
    // Reordering fields
    if (activeData?.type === 'field') {
        const activeSectionId = activeData.sectionId;
        let overSectionId = overData?.sectionId;
        let overIndex = -1;

        if (overData?.type === 'section') {
            // Dropping a field onto a section container
            overSectionId = overData.sectionId;
            const overSection = currentForm.layout.sections.find(s => s.id === overSectionId);
            overIndex = overSection?.fields.length ?? 0;
        } else if (overData?.type === 'field') {
            // Dropping a field onto another field
            overSectionId = overData.sectionId;
            const overSection = currentForm.layout.sections.find(s => s.id === overSectionId);
            overIndex = overSection?.fields.indexOf(overId) ?? 0;
        }

        if (activeSectionId && overSectionId && overIndex > -1 && (activeSectionId !== overSectionId || overIndex !== active.data.current?.index)) {
             moveField(activeId, overSectionId, overIndex);
        }
    }
  };

  if (!currentForm) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Form Canvas</CardTitle>
          <CardDescription className="hidden sm:block">No form loaded</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              <span className="hidden sm:inline">Create a new form or load an existing one to start building</span>
              <span className="sm:hidden">Create or load a form</span>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCenter} 
      onDragEnd={handleDragEnd}
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0 p-4 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg sm:text-xl truncate">{currentForm.name}</CardTitle>
              <CardDescription className="hidden sm:block truncate">{currentForm.description}</CardDescription>
            </div>
            <Button onClick={addSection} variant="outline" size="sm" className="flex-shrink-0">
              <PiPlus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Add Section</span>
            </Button>
          </div>
        </CardHeader>
        
        <CardContent 
          className="flex-grow overflow-auto p-4 sm:p-6"
          onClick={() => selectField(null)} // Deselect when clicking empty space
        >
          <SortableContext items={currentForm.layout.sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4 sm:space-y-6">
              {currentForm.layout.sections.length > 0 ? (
                currentForm.layout.sections.map(section => (
                  <SectionComponent key={section.id} sectionId={section.id} />
                ))
              ) : (
                <div className="text-center py-8 sm:py-12 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                    <span className="hidden sm:inline">Your form is empty</span>
                    <span className="sm:hidden">Form is empty</span>
                  </p>
                  <Button onClick={addSection} size="sm">
                    <PiPlus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Add Your First Section</span>
                    <span className="sm:hidden">Add Section</span>
                  </Button>
                </div>
              )}
            </div>
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
};

export default CanvasV2; 