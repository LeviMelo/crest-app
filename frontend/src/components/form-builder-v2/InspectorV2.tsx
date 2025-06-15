import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { TextareaField } from '@/components/ui/TextareaField';
import { Checkbox } from '@/components/ui/Checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { useFormBuilderStoreV2, Field } from '@/stores/formBuilderStore.v2';
import { PiTrash, PiPlus, PiPaintBrushBroadDuotone } from 'react-icons/pi';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/Switch';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { HexColorPicker } from 'react-colorful';

// Expanded color palette configuration
const COLOR_PALETTE = [
  { name: 'primary', label: 'Primary', className: 'bg-primary hover:bg-primary/80', borderClass: 'border-primary' },
  { name: 'secondary', label: 'Secondary', className: 'bg-slate-500 hover:bg-slate-600', borderClass: 'border-slate-500' },
  { name: 'accent', label: 'Accent', className: 'bg-amber-500 hover:bg-amber-600', borderClass: 'border-amber-500' },
  { name: 'success', label: 'Success', className: 'bg-emerald-500 hover:bg-emerald-600', borderClass: 'border-emerald-500' },
  { name: 'warning', label: 'Warning', className: 'bg-orange-500 hover:bg-orange-600', borderClass: 'border-orange-500' },
  { name: 'danger', label: 'Danger', className: 'bg-red-500 hover:bg-red-600', borderClass: 'border-red-500' },
  // Adding more colors
  { name: 'blue', label: 'Blue', className: 'bg-blue-500 hover:bg-blue-600', borderClass: 'border-blue-500' },
  { name: 'indigo', label: 'Indigo', className: 'bg-indigo-500 hover:bg-indigo-600', borderClass: 'border-indigo-500' },
  { name: 'purple', label: 'Purple', className: 'bg-purple-500 hover:bg-purple-600', borderClass: 'border-purple-500' },
  { name: 'pink', label: 'Pink', className: 'bg-pink-500 hover:bg-pink-600', borderClass: 'border-pink-500' },
  { name: 'teal', label: 'Teal', className: 'bg-teal-500 hover:bg-teal-600', borderClass: 'border-teal-500' },
  { name: 'cyan', label: 'Cyan', className: 'bg-cyan-500 hover:bg-cyan-600', borderClass: 'border-cyan-500' },
];

const ColorPalette: React.FC<{
  selectedColor: string;
  onColorChange: (color: string) => void;
}> = ({ selectedColor, onColorChange }) => {
  const isCustomColor = selectedColor && !COLOR_PALETTE.some(p => p.name === selectedColor);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-6 gap-px bg-border rounded-md overflow-hidden border">
        {COLOR_PALETTE.map((color) => (
          <button
            key={color.name}
            type="button"
            onClick={() => onColorChange(color.name)}
            className={cn(
              "w-full aspect-square transition-all",
              color.className,
              selectedColor === color.name
                ? `ring-2 ring-offset-1 ring-offset-background ring-primary`
                : 'hover:scale-110'
            )}
            title={color.label}
          />
        ))}
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-sm">
             <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded border"
                  style={{ backgroundColor: isCustomColor ? selectedColor : 'hsl(var(--muted))' }}
                />
                <span className={cn(!isCustomColor && "text-muted-foreground")}>
                  {isCustomColor ? selectedColor.toUpperCase() : 'Custom...'}
                </span>
             </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border-none">
            <HexColorPicker
              color={isCustomColor ? selectedColor : '#aabbcc'}
              onChange={onColorChange}
            />
        </PopoverContent>
      </Popover>
    </div>
  );
};

const ChoiceEditor: React.FC<{ 
  choices: { value: string; label: string; color?: string }[], 
  onChange: (choices: { value: string; label: string; color?: string }[]) => void 
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

  const updateChoiceColor = (index: number, color: string) => {
    const newChoices = choices.map((choice, i) => {
      if (i === index) {
        return { ...choice, color };
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn("h-8 w-8 flex-shrink-0", choice.color && `bg-${choice.color}-500/80 hover:bg-${choice.color}-500`)}
                >
                  <PiPaintBrushBroadDuotone />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div className="p-2">
                  <ColorPalette selectedColor={choice.color || ''} onColorChange={(color) => updateChoiceColor(index, color)} />
                </div>
              </PopoverContent>
            </Popover>
            <Input
              id={`choice-label-${index}`}
              placeholder="Choice Label"
              value={choice.label}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateChoiceLabel(index, e.target.value)}
              className="flex-1 text-xs min-w-0 h-8"
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

  const updateLocalField = (updates: Partial<Field>) => {
    if (localField && selectedFieldId) {
      const newField = { ...localField, ...updates };
      setLocalField(newField);
      updateField(selectedFieldId, newField);
    }
  };

  const updateLocalOptions = (optionUpdates: any) => {
    if (localField && selectedFieldId) {
      const newField = {
        ...localField,
        options: { ...localField.options, ...optionUpdates }
      };
      setLocalField(newField);
      updateField(selectedFieldId, newField);
    }
  };

  const updateLocalStyling = (stylingUpdates: any) => {
    if (localField && selectedFieldId) {
       const newField = {
        ...localField,
        styling: { ...localField.styling, ...stylingUpdates }
      };
      setLocalField(newField);
      updateField(selectedFieldId, newField);
    }
  };

  const handleSectionColorChange = (color: string) => {
    if (selectedSection && selectedFieldId) {
      updateSection(selectedFieldId, {
        styling: { ...selectedSection.styling, color }
      });
    }
  };

  // Handle choice updates
  const handleChoicesChange = (choices: { value: string; label: string; color?: string }[]) => {
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSection(selectedFieldId, { title: e.target.value })}
          />
          
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
                onColorChange={handleSectionColorChange}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-3 block">Font Size</label>
              <div className="flex justify-stretch gap-2">
                <Button
                  size="sm"
                  variant={selectedSection.styling.fontSize === 'sm' ? 'default' : 'outline'}
                  onClick={() => updateSection(selectedFieldId, { styling: { ...selectedSection.styling, fontSize: 'sm' } })}
                  className="flex-1"
                >
                  Small
                </Button>
                <Button
                  size="sm"
                  variant={(selectedSection.styling.fontSize === 'base' || !selectedSection.styling.fontSize) ? 'default' : 'outline'}
                  onClick={() => updateSection(selectedFieldId, { styling: { ...selectedSection.styling, fontSize: 'base' } })}
                  className="flex-1"
                >
                  Normal
                </Button>
                <Button
                  size="sm"
                  variant={selectedSection.styling.fontSize === 'lg' ? 'default' : 'outline'}
                  onClick={() => updateSection(selectedFieldId, { styling: { ...selectedSection.styling, fontSize: 'lg' } })}
                  className="flex-1"
                >
                  Large
                </Button>
              </div>
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

  const updateValidationRule = (ruleType: 'min' | 'max', value: number | undefined) => {
    if (!localField) return;
    const otherRules = localField.validation?.filter(r => r.type !== ruleType) || [];
    let newRules = [...otherRules];
    if (value !== undefined && !isNaN(value)) {
      const message = ruleType === 'min' 
        ? `Value must be at least ${value}` 
        : `Value must be no more than ${value}`;
      newRules.push({ type: ruleType, value, message });
    }
    updateLocalField({ validation: newRules });
  };
  
  const handleLayoutChange = (style: 'auto' | 'columns', columns?: number) => {
    updateLocalOptions({ layout: { style, columns } });
  };

  const layout = localField.options.layout || { style: 'auto' };

  // Determine which column options are enabled based on field width
  const isCompact = localField.styling.width === 'compact';
  const isNormal = localField.styling.width === 'normal' || !localField.styling.width;

  const showChoiceLayout = (localField.type === 'single-choice' && localField.options.displayAs !== 'dropdown') || localField.type === 'multiple-choice';

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
          <div>
            <Label htmlFor="field-label">Label</Label>
            <Input
              id="field-label"
              value={localField.label}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateLocalField({ label: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="field-description">Description</Label>
            <Textarea
              id="field-description"
              value={localField.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateLocalField({ description: e.target.value })}
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
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <label htmlFor="field-togglable" className="text-sm font-medium">Togglable Input</label>
              <p className="text-xs text-muted-foreground">Make this field collapsible.</p>
            </div>
            <Switch
              id="field-togglable"
              checked={localField.options.togglable}
              onCheckedChange={(checked) => updateLocalOptions({ togglable: checked })}
            />
          </div>
        </div>

        {/* Type-specific options */}
        <div className="pt-4 border-t space-y-4">
          <h4 className="font-medium">
            <span className="hidden sm:inline">Field Options</span>
            <span className="sm:hidden">Options</span>
          </h4>
          
          {localField.type === 'number' && (
            <div className="space-y-3">
              <InputField
                id="number-unit"
                label="Unit"
                value={localField.options.unit || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateLocalOptions({ unit: e.target.value })}
                placeholder="e.g., kg, mmHg, %"
              />
              <div className="grid grid-cols-2 gap-2">
                 <InputField
                    id="number-min"
                    label="Min Value"
                    type="number"
                    placeholder="None"
                    value={localField.validation?.find(r => r.type === 'min')?.value ?? ''}
                    onChange={(e) => updateValidationRule('min', e.target.valueAsNumber)}
                  />
                  <InputField
                    id="number-max"
                    label="Max Value"
                    type="number"
                    placeholder="None"
                    value={localField.validation?.find(r => r.type === 'max')?.value ?? ''}
                    onChange={(e) => updateValidationRule('max', e.target.valueAsNumber)}
                  />
              </div>
              
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
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <label htmlFor="display-as-switch" className="text-sm font-medium">Toggle Switch</label>
                <p className="text-xs text-muted-foreground">Display as a switch instead of a checkbox.</p>
              </div>
              <Switch
                id="display-as-switch"
                checked={localField.options.displayAs === 'switch'}
                onCheckedChange={(checked) => updateLocalOptions({ displayAs: checked ? 'switch' : 'checkbox' })}
              />
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
                        <SelectItem value="button-group">Button Group</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="checkboxGroup">Checkboxes</SelectItem>
                        <SelectItem value="button-group">Button Group</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <label htmlFor="text-fallback" className="text-sm font-medium">Text Fallback</label>
                    <p className="text-xs text-muted-foreground">Allow a free-text "Other" option.</p>
                  </div>
                  <Switch
                    id="text-fallback"
                    checked={localField.options.textFallback}
                    onCheckedChange={(checked) => updateLocalOptions({ textFallback: checked })}
                  />
                </div>
                {localField.options.textFallback && (
                  <InputField
                    id="text-fallback-label"
                    label="Fallback Label"
                    placeholder="e.g., Other, Specify"
                    value={localField.options.textFallbackLabel || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateLocalOptions({ textFallbackLabel: e.target.value })}
                  />
                )}
              </div>

              {showChoiceLayout && (
                <div className="pt-2 border-t">
                  <label className="text-sm font-medium">Choice Layout</label>
                  <div className="mt-2 flex justify-stretch gap-2">
                    <Button
                      size="sm"
                      variant={layout.style === 'auto' ? 'default' : 'outline'}
                      onClick={() => handleLayoutChange('auto')}
                      className="flex-1"
                    >
                      Auto
                    </Button>
                    <Button
                      size="sm"
                      disabled={isCompact}
                      variant={layout.style === 'columns' && layout.columns === 2 ? 'default' : 'outline'}
                      onClick={() => handleLayoutChange('columns', 2)}
                      className="flex-1"
                    >
                      2 Col
                    </Button>
                    <Button
                      size="sm"
                      disabled={isCompact || isNormal}
                      variant={layout.style === 'columns' && layout.columns === 3 ? 'default' : 'outline'}
                      onClick={() => handleLayoutChange('columns', 3)}
                      className="flex-1"
                    >
                      3 Col
                    </Button>
                    <Button
                      size="sm"
                      disabled
                      variant={layout.style === 'columns' && layout.columns === 4 ? 'default' : 'outline'}
                      onClick={() => handleLayoutChange('columns', 4)}
                      className="flex-1"
                    >
                      4 Col
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {localField.type === 'autocomplete-multiple' && (
            <div className="space-y-4">
              <ChoiceEditor
                choices={localField.options.choices || []}
                onChange={handleChoicesChange}
              />
              <InputField
                id="ac-placeholder"
                label="Placeholder Text"
                value={localField.options.placeholder || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateLocalOptions({ placeholder: e.target.value })}
              />
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
              onColorChange={(color) => updateLocalStyling({ color })}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-3 block">Width</label>
            <div className="flex justify-stretch gap-2">
              <Button
                size="sm"
                variant={localField.styling.width === 'compact' ? 'default' : 'outline'}
                onClick={() => updateLocalStyling({ width: 'compact' })}
                className="flex-1"
              >
                Compact
              </Button>
              <Button
                size="sm"
                variant={localField.styling.width === 'normal' || !localField.styling.width ? 'default' : 'outline'}
                onClick={() => updateLocalStyling({ width: 'normal' })}
                className="flex-1"
              >
                Normal
              </Button>
              <Button
                size="sm"
                variant={localField.styling.width === 'wide' ? 'default' : 'outline'}
                onClick={() => updateLocalStyling({ width: 'wide' })}
                className="flex-1"
              >
                Wide
              </Button>
            </div>
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