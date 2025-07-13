import React from 'react';
import { useFormBuilderStoreV2, Field, FieldType } from '@/stores/formBuilderStore.v2';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select';
import { Slider } from '@/components/ui/Slider';
import Stepper from '@/components/ui/Stepper';
import { Switch } from '@/components/ui/Switch';
import { MultiAutocompleteInput } from '../ui/MultiAutocompleteInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

// Allow custom CSS properties
interface CSSPropertiesWithVars extends React.CSSProperties {
  [key: `--${string}`]: string | number;
}

type FontSize = 'sm' | 'base' | 'lg';


// This new component contains the original rendering logic from getFieldPreview
const FieldRenderer: React.FC<{ 
  field: Field, 
  fontSize: FontSize, 
  onValueChange: (value: any) => void,
  showLabel: boolean
}> = ({ field, fontSize, onValueChange: handleValueChange, showLabel }) => {
    // FIX: Properly destructure complex defaultValues to avoid passing objects to input elements.
    const isStructuredTogglable = field.defaultValue && typeof field.defaultValue === 'object' && 'toggled' in field.defaultValue && 'value' in field.defaultValue;
    const rawValue = isStructuredTogglable ? field.defaultValue.value : field.defaultValue;

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

    const getButtonColorStyles = (baseColor: string, choiceColor?: string): CSSPropertiesWithVars => {
      const color = choiceColor || baseColor || '#3b82f6';
      return {
        '--field-color': color,
        '--field-color-light': `${color}1a`, // For background
        '--field-color-text': color, // For text color
        '--field-color-border': color, // For border color
      };
    };
    
  switch (field.type) {
    case 'text':
      if (field.options.variant === 'autocomplete') {
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
            <MultiAutocompleteInput
              options={field.options.choices || []}
              value={field.defaultValue || { selected: [], custom: [] }}
              onChange={handleValueChange}
              placeholder={field.options.placeholder}
              color={field.styling.color}
            />
          </fieldset>
        );
      }
      // Default to plain text input
      return (
        <div className="space-y-2">
          {showLabel && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className={cn("font-medium", labelClasses)}>{field.label}</label>
                <RequiredBadge />
              </div>
              {field.description && <p className={cn("text-muted-foreground", descriptionClasses)}>{field.description}</p>}
            </div>
          )}
          <Input 
            type="text" 
            value={rawValue || ''} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleValueChange(e.target.value)} 
            placeholder={field.options.placeholder || ''}
          />
        </div>
      );
    case 'date':
      return (
        <div className="space-y-2">
          {showLabel && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className={cn("font-medium", labelClasses)}>{field.label}</label>
                <RequiredBadge />
              </div>
              {field.description && <p className={cn("text-muted-foreground", descriptionClasses)}>{field.description}</p>}
            </div>
          )}
          <Input type="date" value={rawValue || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleValueChange(e.target.value)} />
        </div>
      );
    case 'number':
      const enabledInputs = field.options.enabledInputs || ['input'];
      const value = rawValue || 0;
      const minRule = field.validation?.find(r => r.type === 'min');
      const maxRule = field.validation?.find(r => r.type === 'max');
      const min = minRule ? Number(minRule.value) : undefined;
      const max = maxRule ? Number(maxRule.value) : undefined;

      return (
        <div className="space-y-2">
          {showLabel && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className={cn("font-medium", labelClasses)}>{field.label}</label>
                <RequiredBadge />
              </div>
              {field.description && <p className={cn("text-muted-foreground", descriptionClasses)}>{field.description}</p>}
            </div>
          )}
          
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {(enabledInputs.includes('input') || enabledInputs.includes('inputBox')) && (
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
              checked={rawValue || false}
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
            checked={rawValue || false}
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
    case 'single-choice': {
      const singleChoices = field.options.choices || [];
      const fallbackLabel = field.options.textFallbackLabel || 'Other';

      const defaultValue = rawValue || { selected: [], custom: [] };
      
      const isPredefinedValue = typeof defaultValue === 'string' && singleChoices.some(c => c.value === defaultValue);
      
      const otherValues = {
        selected: isPredefinedValue ? [defaultValue] : [],
        custom: typeof defaultValue === 'string' && !isPredefinedValue ? [defaultValue] : []
      };

      const renderFallbackInput = () => (
        field.options.textFallback && (
          <div className="mt-2 space-y-2">
            <label className={cn("text-sm font-medium", labelClasses)}>{fallbackLabel}</label>
            <MultiAutocompleteInput
              options={[]} // No predefined "other" options, only custom
              value={otherValues}
              onChange={(newVal) => {
                const customValue = newVal.custom.length > 0 ? newVal.custom[newVal.custom.length - 1] : null;
                handleValueChange(customValue);
              }}
              placeholder="Type to add custom value..."
              color={field.styling.color}
            />
          </div>
        )
      );

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
              value={isPredefinedValue ? defaultValue : ''}
              onValueChange={(value: string) => handleValueChange(value)}
              className={getChoiceGroupLayoutClasses()}
            >
              {singleChoices.map((choice) => (
                <div key={choice.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={choice.value} id={`${field.id}-${choice.value}`} />
                  <label 
                    htmlFor={`${field.id}-${choice.value}`} 
                    className={cn("truncate", labelClasses)}
                    style={choice.color ? { color: choice.color } : {}}
                  >
                    {choice.label}
                  </label>
                </div>
              ))}
            </RadioGroup>
            {renderFallbackInput()}
          </fieldset>
        );
      } else { 
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
                {singleChoices.map(choice => {
                  const isSelected = choice.value === defaultValue;
                  return (
                    <button
                      key={choice.value}
                      type="button"
                      onClick={() => handleValueChange(choice.value)}
                      style={getButtonColorStyles(field.styling.color, choice.color)}
                      className={cn(
                        'h-auto min-h-[40px] py-1 px-3 border rounded-md transition-colors', 
                        isSelected
                          ? 'bg-[var(--field-color)] text-white hover:opacity-90 border-transparent'
                          : 'border-[var(--field-color)] text-[var(--field-color)] hover:bg-[var(--field-color-light)] bg-background/80 backdrop-blur-sm shadow-sm',
                        field.styling.textOverflow === 'wrap' 
                          ? 'whitespace-normal' 
                          : 'truncate'
                      )}
                    >
                      {choice.label}
                    </button>
                  )
                })}
              </div>
              {renderFallbackInput()}
            </fieldset>
          )
        }
        return (
          <div className="space-y-2">
            {showLabel && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor={`preview-${field.id}`} className={cn("font-medium", labelClasses)}>
                    {field.label}
                  </label>
                  <RequiredBadge />
                </div>
                {field.description && <p className={cn("text-muted-foreground", descriptionClasses)}>{field.description}</p>}
              </div>
            )}
            <Select 
              onValueChange={handleValueChange} 
              value={isPredefinedValue ? defaultValue : ''}
            >
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
            {renderFallbackInput()}
          </div>
        )
      }
    }
    case 'multiple-choice': {
      const multiChoices = field.options.choices || [];
      
      const defaultValue = (rawValue || {}) as { selected?: string[], custom?: string[] };
      const selectedValues = new Set(defaultValue.selected || []);
      const customValues = defaultValue.custom || [];
      const fallbackLabelMulti = field.options.textFallbackLabel || 'Other';

      const handleMultiChange = (newSelected: Set<string>, newCustom?: string[]) => {
        handleValueChange({
            selected: Array.from(newSelected),
            custom: newCustom !== undefined ? newCustom : customValues,
        });
      };
      
      const renderFallbackInput = () => (
        field.options.textFallback && (
          <div className="mt-2 space-y-2">
            <label className={cn("text-sm font-medium", labelClasses)}>{fallbackLabelMulti}</label>
            <MultiAutocompleteInput
              options={[]} // No predefined "other" options
              value={{ selected: [], custom: customValues }}
              onChange={(newVal) => handleMultiChange(selectedValues, newVal.custom)}
              placeholder="Type to add custom values..."
              color={field.styling.color}
            />
          </div>
        )
      );

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
                  <button
                    key={choice.value}
                    type="button"
                    style={getButtonColorStyles(field.styling.color, choice.color)}
                    onClick={() => {
                      const newSelected = new Set(selectedValues);
                      if (isSelected) {
                        newSelected.delete(choice.value);
                      } else {
                        newSelected.add(choice.value);
                      }
                      handleMultiChange(newSelected);
                    }}
                    className={cn(
                      'h-auto min-h-[40px] py-1 px-3 border rounded-md transition-colors',
                      isSelected
                        ? 'bg-[var(--field-color)] text-white hover:opacity-90 border-transparent'
                        : 'border-[var(--field-color)] text-[var(--field-color)] hover:bg-[var(--field-color-light)] bg-background/80 backdrop-blur-sm shadow-sm',
                      field.styling.textOverflow === 'wrap' 
                        ? 'whitespace-normal' 
                        : 'truncate'
                    )}
                  >
                    {choice.label}
                  </button>
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
                    onCheckedChange={(checked) => {
                      const newSelected = new Set(selectedValues);
                      if (checked) {
                        newSelected.add(choice.value);
                      } else {
                        newSelected.delete(choice.value);
                      }
                      handleMultiChange(newSelected);
                    }}
                  />
                  <label 
                    htmlFor={`${field.id}-${choice.value}`} 
                    className={cn("truncate", labelClasses)}
                    style={choice.color ? { color: choice.color } : {}}
                  >
                    {choice.label}
                  </label>
                </div>
              ))}
            </div>
          )}
          {renderFallbackInput()}
        </fieldset>
      );
    }
    default:
      return (
        <div className="p-2 border-dashed border-destructive bg-destructive/10 text-destructive text-xs rounded-md">
          Unhandled Field Type: <strong>{field.type}</strong>
        </div>
      );
  }
};

interface FormRendererV2Props {
  form: Form;
  formData: any;
  onFormDataChange: (updatedData: any) => void;
}

const FormRendererV2: React.FC<FormRendererV2Props> = ({ form, formData, onFormDataChange }) => {
  const handleFieldChange = (fieldId: string, newValue: any) => {
    onFormDataChange({
      ...formData,
      [fieldId]: newValue,
    });
  };

  const getField = (fieldId: string): Field | undefined => form.fields.find(f => f.id === fieldId);

  const getWidthClass = (field: Field): string => {
    const width = field.styling.width || 'normal';
    switch (width) {
      case 'compact': return 'flex-[1_1_200px] max-w-xs';
      case 'wide': return 'flex-[3_1_450px] max-w-lg';
      default: return 'flex-[2_1_320px] max-w-md';
    }
  };

  return (
    <div className="space-y-6">
      {form.layout.sections.map(section => (
        <Card
          key={section.id}
          style={section.styling.color?.startsWith('#') ? {
            borderColor: section.styling.color,
            backgroundColor: `${section.styling.color}0d`,
          } : {}}
        >
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {section.fields.map(fieldId => {
                const field = getField(fieldId);
                if (!field) return null;

                const fieldWithValue = {
                  ...field,
                  defaultValue: formData[fieldId] !== undefined ? formData[fieldId] : field.defaultValue,
                };
                
                return (
                  <div key={fieldId} className={getWidthClass(field)}>
                    <FieldRenderer 
                      field={fieldWithValue}
                      fontSize={section.styling.fontSize || 'base'}
                      onValueChange={(newValue) => handleFieldChange(fieldId, newValue)}
                      showLabel={true}
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FormRendererV2; 