import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { TextareaField } from '@/components/ui/TextareaField';
import { Checkbox } from '@/components/ui/Checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { useFormBuilderStoreV2, Field } from '@/stores/formBuilderStore.v2';
import { PiTrash, PiPlus } from 'react-icons/pi';
import { cn } from '@/lib/utils';

// Color palette configuration
const COLOR_PALETTE = [
  { name: 'primary', label: 'Primary', className: 'bg-primary hover:bg-primary/80', borderClass: 'border-primary' },
  { name: 'secondary', label: 'Secondary', className: 'bg-slate-500 hover:bg-slate-600', borderClass: 'border-slate-500' },
  { name: 'accent', label: 'Accent', className: 'bg-amber-500 hover:bg-amber-600', borderClass: 'border-amber-500' },
  { name: 'success', label: 'Success', className: 'bg-emerald-500 hover:bg-emerald-600', borderClass: 'border-emerald-500' },
  { name: 'warning', label: 'Warning', className: 'bg-orange-500 hover:bg-orange-600', borderClass: 'border-orange-500' },
  { name: 'danger', label: 'Danger', className: 'bg-red-500 hover:bg-red-600', borderClass: 'border-red-500' },
];

const ColorPalette: React.FC<{
  selectedColor: string;
  onColorChange: (color: string) => void;
}> = ({ selectedColor, onColorChange }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {COLOR_PALETTE.map((color) => (
        <button
          key={color.name}
          type="button"
          onClick={() => onColorChange(color.name)}
          className={cn(
            "w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 transition-all",
            color.className,
            selectedColor === color.name 
              ? `ring-2 ring-offset-2 ring-primary ${color.borderClass}` 
              : 'border-transparent hover:border-gray-300'
          )}
          title={color.label}
          aria-label={`Select ${color.label} color`}
        />
      ))}
    </div>
  );
};

const ChoiceEditor: React.FC<{ 
  choices: { value: string; label: string }[], 
  onChange: (choices: { value: string; label: string }[]) => void 
}> = ({ choices, onChange }) => {

  const generateValue = (label: string) => {
    return label
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w-]/g, '') || `option_${Math.random().toString(36).substr(2, 5)}`;
  };

  const addChoice = () => {
    const newLabel = `Option ${choices.length + 1}`;
    const newValue = generateValue(newLabel);
    onChange([...choices, { value: newValue, label: newLabel }]);
  };

  const updateChoiceLabel = (index: number, newLabel: string) => {
    const newChoices = choices.map((choice, i) => {
      if (i === index) {
        // Also update the value when the label changes, to keep them in sync
        return { ...choice, label: newLabel, value: generateValue(newLabel) };
      }
      return choice;
    });
    onChange(newChoices);
  };

  const removeChoice = (index: number) => {
    onChange(choices.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          <span className="hidden sm:inline">Choices</span>
          <span className="sm:hidden">Options</span>
        </label>
        <Button size="sm" variant="outline" onClick={addChoice}>
          <PiPlus className="w-3 h-3 sm:mr-1" />
          <span className="hidden sm:inline">Add Choice</span>
        </Button>
      </div>
      
      <div className="space-y-2">
        {choices.map((choice, index) => (
          <div key={index} className="flex items-center gap-2 p-1 border rounded">
            <InputField
              id={`choice-label-${index}`}
              label=""
              placeholder="Choice Label"
              value={choice.label}
              onChange={(e) => updateChoiceLabel(index, e.target.value)}
              className="flex-1 text-xs min-w-0 h-8"
              containerClassName="w-full gap-0"
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={() => removeChoice(index)}
              className="flex-shrink-0 h-8 w-8"
            >
              <PiTrash className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
      
      {choices.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">
          <span className="hidden sm:inline">No choices added yet</span>
          <span className="sm:hidden">No options</span>
        </p>
      )}
    </div>
  );
};

const InspectorV2: React.FC = () => {
  const { selectedFieldId, getField, updateField, removeField, getSection, updateSection } = useFormBuilderStoreV2();
  const [localField, setLocalField] = useState<Field | null>(null);

  const selectedField = selectedFieldId ? getField(selectedFieldId) : null;
  const selectedSection = selectedFieldId ? getSection(selectedFieldId) : null;

  // Update local state when selection changes
  useEffect(() => {
    if (selectedField) {
      setLocalField({ ...selectedField });
    } else {
      setLocalField(null);
    }
  }, [selectedField]);

  // Auto-save on changes (debounced) - reduced delay for better UX
  useEffect(() => {
    if (localField && selectedField && selectedFieldId) {
      const timeoutId = setTimeout(() => {
        updateField(selectedFieldId, localField);
      }, 300); // Slightly increased for stability
      return () => clearTimeout(timeoutId);
    }
  }, [localField, selectedField, selectedFieldId, updateField]);

  const updateLocalField = (updates: Partial<Field>) => {
    if (localField) {
      setLocalField(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const updateLocalOptions = (optionUpdates: any) => {
    if (localField) {
      setLocalField(prev => prev ? {
        ...prev,
        options: { ...prev.options, ...optionUpdates }
      } : null);
    }
  };

  const updateLocalStyling = (stylingUpdates: any) => {
    if (localField) {
      setLocalField(prev => prev ? {
        ...prev,
        styling: { ...prev.styling, ...stylingUpdates }
      } : null);
    }
  };

  // Immediate color update for better UX
  const handleColorChange = (color: string) => {
    if (selectedField && selectedFieldId) {
      // Update immediately in store
      updateField(selectedFieldId, {
        ...selectedField,
        styling: { ...selectedField.styling, color }
      });
      // Also update local state
      updateLocalStyling({ color });
    } else if (selectedSection && selectedFieldId) {
      // Update section color immediately
      updateSection(selectedFieldId, {
        styling: { ...selectedSection.styling, color }
      });
    }
  };

  // Handle choice updates
  const handleChoicesChange = (choices: { value: string; label: string }[]) => {
    updateLocalOptions({ choices });
  };

  if (!selectedFieldId) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">
            <span className="hidden sm:inline">Inspector</span>
            <span className="sm:hidden">Edit</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              <span className="hidden sm:inline">Select a field or section to edit its properties</span>
              <span className="sm:hidden">Select item to edit</span>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Section inspector
  if (selectedSection && !selectedField) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">
            <span className="hidden sm:inline">Section Properties</span>
            <span className="sm:hidden">Section</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <InputField
            id="section-title"
            label="Section Title"
            value={selectedSection.title}
            onChange={(e) => updateSection(selectedFieldId, { title: e.target.value })}
          />
          
          <div>
            <label className="text-sm font-medium">Columns</label>
            <Select
              value={selectedSection.columns.toString()}
              onValueChange={(value: string) => updateSection(selectedFieldId, { columns: parseInt(value) })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Column</SelectItem>
                <SelectItem value="2">2 Columns</SelectItem>
                <SelectItem value="3">3 Columns</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Section styling */}
          <div className="pt-4 border-t space-y-4">
            <h4 className="font-medium">
              <span className="hidden sm:inline">Styling</span>
              <span className="sm:hidden">Style</span>
            </h4>
            
            <div>
              <label className="text-sm font-medium mb-3 block">Color</label>
              <ColorPalette
                selectedColor={selectedSection.styling.color}
                onColorChange={handleColorChange}
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="destructive"
              onClick={() => removeField(selectedFieldId)}
              className="w-full"
              size="sm"
            >
              <PiTrash className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Delete Section</span>
              <span className="sm:hidden">Delete</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Field inspector
  if (!localField) return null;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">
          <span className="hidden sm:inline">Field Properties</span>
          <span className="sm:hidden">Field</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground capitalize">
          <span className="hidden sm:inline">{localField.type.replace('-', ' ')} Field</span>
          <span className="sm:hidden">{localField.type.replace('-', ' ')}</span>
        </p>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-auto space-y-4 p-4 sm:p-6">
        {/* Basic Properties */}
        <div className="space-y-4">
          <InputField
            id="field-label"
            label="Label"
            value={localField.label}
            onChange={(e) => updateLocalField({ label: e.target.value })}
          />
          
          <div>
            <label htmlFor="field-description" className="text-sm font-medium block mb-1.5">
              <span className="hidden sm:inline">Description</span>
              <span className="sm:hidden">Desc</span>
            </label>
            <TextareaField
              id="field-description"
              label=""
              value={localField.description || ''}
              onChange={(e) => updateLocalField({ description: e.target.value })}
              rows={2}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="field-required"
              checked={localField.required}
              onChange={(e) => updateLocalField({ required: e.target.checked })}
            />
            <label htmlFor="field-required" className="text-sm font-medium">
              Required field
            </label>
          </div>
        </div>

        {/* Type-specific options */}
        <div className="pt-4 border-t space-y-4">
          <h4 className="font-medium">
            <span className="hidden sm:inline">Field Options</span>
            <span className="sm:hidden">Options</span>
          </h4>
          
          {localField.type === 'text' && (
            <InputField
              id="text-placeholder"
              label="Placeholder"
              value={localField.options.placeholder || ''}
              onChange={(e) => updateLocalOptions({ placeholder: e.target.value })}
            />
          )}

          {localField.type === 'number' && (
            <div className="space-y-3">
              <InputField
                id="number-unit"
                label="Unit"
                value={localField.options.unit || ''}
                onChange={(e) => updateLocalOptions({ unit: e.target.value })}
                placeholder="e.g., kg, mmHg, %"
              />
              
              <div>
                <label className="text-sm font-medium">
                  <span className="hidden sm:inline">Input Types</span>
                  <span className="sm:hidden">Types</span>
                </label>
                <div className="mt-2 space-y-2">
                  {['input', 'slider', 'stepper'].map((inputType) => (
                    <div key={inputType} className="flex items-center space-x-2">
                      <Checkbox
                        id={`input-${inputType}`}
                        checked={localField.options.enabledInputs?.includes(inputType) || false}
                        onChange={(e) => {
                          const current = localField.options.enabledInputs || ['input'];
                          const updated = e.target.checked
                            ? [...current, inputType]
                            : current.filter(t => t !== inputType);
                          updateLocalOptions({ enabledInputs: updated });
                        }}
                      />
                      <label htmlFor={`input-${inputType}`} className="text-sm capitalize">
                        {inputType}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {localField.type === 'boolean' && (
            <div>
              <label className="text-sm font-medium">
                <span className="hidden sm:inline">Display As</span>
                <span className="sm:hidden">Display</span>
              </label>
              <Select
                value={localField.options.displayAs || 'checkbox'}
                onValueChange={(value: string) => updateLocalOptions({ displayAs: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="toggle">Toggle Switch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {(localField.type === 'single-choice' || localField.type === 'multiple-choice') && (
            <div className="space-y-4">
              <ChoiceEditor
                choices={localField.options.choices || []}
                onChange={handleChoicesChange}
              />
              
              <div>
                <label className="text-sm font-medium">
                  <span className="hidden sm:inline">Display As</span>
                  <span className="sm:hidden">Display</span>
                </label>
                <Select
                  value={localField.options.displayAs || (localField.type === 'single-choice' ? 'radio' : 'checkboxGroup')}
                  onValueChange={(value: string) => updateLocalOptions({ displayAs: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {localField.type === 'single-choice' ? (
                      <>
                        <SelectItem value="radio">Radio Buttons</SelectItem>
                        <SelectItem value="dropdown">Dropdown</SelectItem>
                      </>
                    ) : (
                      <SelectItem value="checkboxGroup">Checkboxes</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Styling */}
        <div className="pt-4 border-t space-y-4">
          <h4 className="font-medium">
            <span className="hidden sm:inline">Styling</span>
            <span className="sm:hidden">Style</span>
          </h4>
          
          <div>
            <label className="text-sm font-medium mb-3 block">Color</label>
            <ColorPalette
              selectedColor={localField.styling.color}
              onColorChange={handleColorChange}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t">
          <Button
            variant="destructive"
            onClick={() => removeField(selectedFieldId)}
            className="w-full"
            size="sm"
          >
            <PiTrash className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Delete Field</span>
            <span className="sm:hidden">Delete</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InspectorV2; 