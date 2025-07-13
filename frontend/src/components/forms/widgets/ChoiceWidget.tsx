// src/components/forms/widgets/ChoiceWidget.tsx
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import { Checkbox } from '@/components/ui/Checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Label } from '@/components/ui/Label';

interface Choice {
  value: string;
  label: string;
  color?: string; // Added for button-group
}

interface ChoiceWidgetProps {
  label: string;
  value: string | string[] | undefined;
  onChange: (newValue: string | string[] | undefined) => void;
  options: {
    displayAs?: 'radio' | 'select' | 'checkboxes' | 'button-group';
    color?: string; // Added for button-group
    choices?: Choice[]; // Added for button-group
  };
  fieldSchema?: {
    type?: string;
    enum?: string[];
    enumNames?: string[];
    items?: {
      enum?: string[];
      enumNames?: string[];
    };
  };
  required?: boolean;
}

const ChoiceWidget: React.FC<ChoiceWidgetProps> = ({ 
  label, 
  value, 
  onChange, 
  options = {}, 
  fieldSchema = {}, 
  required = false 
}) => {
  const isMultiChoice = fieldSchema.type === 'array';
  const { displayAs = isMultiChoice ? 'checkboxes' : 'radio', color: baseColor = '#3b82f6', choices: customChoices } = options;

  // Use choices from ui:options if provided (preserves color), else from schema
  const effectiveChoices: Choice[] = customChoices && customChoices.length > 0 ? customChoices : getSchemaChoices();

  function getSchemaChoices(): Choice[] {
    if (isMultiChoice) {
      const items = fieldSchema.items || {};
      return (items.enum || []).map((val: string, i: number) => ({
        value: val,
        label: items.enumNames?.[i] || val,
      }));
    }
    return (fieldSchema.enum || []).map((val: string, i: number) => ({
      value: val,
      label: fieldSchema.enumNames?.[i] || val,
    }));
  }

  const getButtonColorStyles = (choiceColor?: string): React.CSSProperties => {
    const color = choiceColor || baseColor;
    if (!color.startsWith('#')) return {};
    return {
      borderColor: color,
      color: color,
      '--btn-bg-hover': `${color}1a` as any,
      '--btn-bg-active': color as any,
    } as React.CSSProperties;
  };

  const choices = effectiveChoices;
  const idPrefix = `input-${label}`;

  // If no choices are available, show a message
  if (choices.length === 0) {
    return (
      <div className="space-y-2">
        <Label>
          {label}
          {required && <span className="text-destructive"> *</span>}
        </Label>
        <div className="p-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600">
          No options available
        </div>
      </div>
    );
  }

  if (displayAs === 'radio') {
    return (
      <fieldset className="space-y-2">
        <Label>
          {label}
          {required && <span className="text-destructive"> *</span>}
        </Label>
        <RadioGroup
          value={value as string || ''}
          onValueChange={(val: string) => onChange(val)}
          className="flex flex-wrap gap-x-6 gap-y-2 pt-1"
        >
          {choices.map((choice) => (
            <div key={choice.value} className="flex items-center space-x-2">
              <RadioGroupItem value={choice.value} id={`${idPrefix}-${choice.value}`} />
              <Label htmlFor={`${idPrefix}-${choice.value}`} className="font-normal">{choice.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </fieldset>
    );
  }

  if (displayAs === 'select') {
    return (
      <div className="space-y-2">
        <Label>
          {label}
          {required && <span className="text-destructive"> *</span>}
        </Label>
        <Select onValueChange={(val: string) => onChange(val)} value={value as string || ''}>
          <SelectTrigger>
            <SelectValue placeholder="Select an option..." />
          </SelectTrigger>
          <SelectContent>
            {choices.map(choice => (
              <SelectItem key={choice.value} value={choice.value}>
                {choice.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (displayAs === 'checkboxes') {
    const selectedValues = new Set(value as string[] || []);
    return (
      <fieldset className="space-y-2">
        <Label>
          {label}
          {required && <span className="text-destructive"> *</span>}
        </Label>
        <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
          {choices.map((choice) => {
            const isSelected = selectedValues.has(choice.value);
            return (
              <div key={choice.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${idPrefix}-${choice.value}`}
                  checked={isSelected}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const newSelected = new Set(selectedValues);
                    if (e.target.checked) {
                      newSelected.add(choice.value);
                    } else {
                      newSelected.delete(choice.value);
                    }
                    onChange(Array.from(newSelected));
                  }}
                />
                <Label htmlFor={`${idPrefix}-${choice.value}`} className="font-normal">{choice.label}</Label>
              </div>
            );
          })}
        </div>
      </fieldset>
    );
  }

  if (displayAs === 'button-group') {
    if (isMultiChoice) {
      // Multi-choice button group
      const selectedValues = new Set(value as string[] || []);
      return (
        <fieldset className="space-y-2">
          <Label>
            {label}
            {required && <span className="text-destructive"> *</span>}
          </Label>
          <div className="flex flex-wrap gap-2 pt-1">
            {choices.map(choice => {
              const isSelected = selectedValues.has(choice.value);
              return (
                <button
                  key={choice.value}
                  type="button"
                  onClick={() => {
                    const newSelected = new Set(selectedValues);
                    if (isSelected) newSelected.delete(choice.value);
                    else newSelected.add(choice.value);
                    onChange(Array.from(newSelected));
                  }}
                  style={getButtonColorStyles(choice.color)}
                  className={
                    `px-3 py-1.5 rounded-md border text-sm transition-colors ${isSelected ? 'bg-[var(--btn-bg-active)] text-white' : 'bg-background'} hover:bg-[var(--btn-bg-hover)]`
                  }
                >
                  {choice.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      );
    } else {
      // Single-choice button group
      return (
        <fieldset className="space-y-2">
          <Label>
            {label}
            {required && <span className="text-destructive"> *</span>}
          </Label>
          <div className="flex flex-wrap gap-2 pt-1">
            {choices.map(choice => {
              const isSelected = choice.value === (value as string);
              return (
                <button
                  key={choice.value}
                  type="button"
                  onClick={() => onChange(choice.value)}
                  style={getButtonColorStyles(choice.color)}
                  className={
                    `px-3 py-1.5 rounded-md border text-sm transition-colors ${isSelected ? 'bg-[var(--btn-bg-active)] text-white' : 'bg-background'} hover:bg-[var(--btn-bg-hover)]`
                  }
                >
                  {choice.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      );
    }
  }

  return null; // Should not happen
};

export default ChoiceWidget; 