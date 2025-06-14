import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { TextareaField } from '@/components/ui/TextareaField';
import { Checkbox } from '@/components/ui/Checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { useFormBuilderStoreV2, Field } from '@/stores/formBuilderStore.v2';
import { PiTrash, PiPlus } from 'react-icons/pi';

const ChoiceEditor: React.FC<{ 
  choices: { value: string; label: string }[], 
  onChange: (choices: { value: string; label: string }[]) => void 
}> = ({ choices, onChange }) => {
  const addChoice = () => {
    onChange([...choices, { value: '', label: '' }]);
  };

  const updateChoice = (index: number, field: 'value' | 'label', value: string) => {
    const newChoices = [...choices];
    newChoices[index][field] = value;
    onChange(newChoices);
  };

  const removeChoice = (index: number) => {
    onChange(choices.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Choices</label>
        <Button size="sm" variant="outline" onClick={addChoice}>
          <PiPlus className="w-3 h-3 mr-1" />
          Add Choice
        </Button>
      </div>
      
      <div className="space-y-2">
        {choices.map((choice, index) => (
          <div key={index} className="flex items-center gap-2 p-2 border rounded">
            <input
              type="text"
              placeholder="Value"
              value={choice.value}
              onChange={(e) => updateChoice(index, 'value', e.target.value)}
              className="flex-1 p-1 text-xs border rounded"
            />
            <input
              type="text"
              placeholder="Label"
              value={choice.label}
              onChange={(e) => updateChoice(index, 'label', e.target.value)}
              className="flex-1 p-1 text-xs border rounded"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => removeChoice(index)}
            >
              <PiTrash className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>
      
      {choices.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">
          No choices added yet
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

  // Save changes to store
  const saveChanges = () => {
    if (localField && selectedFieldId) {
      updateField(selectedFieldId, localField);
    }
  };

  // Auto-save on changes (debounced)
  useEffect(() => {
    if (localField && selectedField) {
      const timeoutId = setTimeout(saveChanges, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [localField]);

  const updateLocalField = (updates: Partial<Field>) => {
    if (localField) {
      setLocalField({ ...localField, ...updates });
    }
  };

  const updateLocalOptions = (optionUpdates: any) => {
    if (localField) {
      setLocalField({
        ...localField,
        options: { ...localField.options, ...optionUpdates }
      });
    }
  };

  if (!selectedFieldId) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Inspector</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">
              Select a field or section to edit its properties
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
        <CardHeader>
          <CardTitle>Section Properties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <div className="pt-4 border-t">
            <Button
              variant="destructive"
              onClick={() => removeField(selectedFieldId)}
              className="w-full"
            >
              <PiTrash className="w-4 h-4 mr-2" />
              Delete Section
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
      <CardHeader>
        <CardTitle>Field Properties</CardTitle>
        <p className="text-sm text-muted-foreground capitalize">
          {localField.type.replace('-', ' ')} Field
        </p>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-auto space-y-4">
        {/* Basic Properties */}
        <div className="space-y-4">
          <InputField
            id="field-label"
            label="Label"
            value={localField.label}
            onChange={(e) => updateLocalField({ label: e.target.value })}
          />
          
          <TextareaField
            id="field-description"
            label="Description"
            value={localField.description || ''}
            onChange={(e) => updateLocalField({ description: e.target.value })}
            rows={2}
          />
          
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
          <h4 className="font-medium">Field Options</h4>
          
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
                <label className="text-sm font-medium">Input Types</label>
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
              <label className="text-sm font-medium">Display As</label>
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
                onChange={(choices) => updateLocalOptions({ choices })}
              />
              
              <div>
                <label className="text-sm font-medium">Display As</label>
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
          <h4 className="font-medium">Styling</h4>
          
          <div>
            <label className="text-sm font-medium">Color</label>
                         <Select
               value={localField.styling.color}
               onValueChange={(value: string) => updateLocalField({ 
                 styling: { ...localField.styling, color: value } 
               })}
             >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="accent">Accent</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="danger">Danger</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t">
          <Button
            variant="destructive"
            onClick={() => removeField(selectedFieldId)}
            className="w-full"
          >
            <PiTrash className="w-4 h-4 mr-2" />
            Delete Field
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InspectorV2; 