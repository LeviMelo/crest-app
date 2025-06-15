// src/components/form-builder/Inspector.tsx
import React, { useEffect, useCallback, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useFormBuilderStore } from '@/stores/formBuilderStore';
import { useForm, useFieldArray } from 'react-hook-form';
import { InputField } from '@/components/ui/InputField';
import { TextareaField } from '@/components/ui/TextareaField';
import { Checkbox as UiCheckbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { PiTrash } from 'react-icons/pi';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { FIELD_COLORS } from '@/config/formBuilder.config';
import { cn } from '@/lib/utils';

interface Choice {
    value: string;
    label: string;
}

interface InspectorFormValues {
    // Common
    title: string;
    description: string;
    
    // Section
    columns: number;

    // Text
    placeholder: string;

    // Number
    unit: string;
    enabledInputs: ('inputBox' | 'slider' | 'stepper')[];
    
    // Choice
    displayAs: 'radio' | 'dropdown' | 'checkboxGroup';
    choices: Choice[];

    // Style
    color: string;
}

const Inspector: React.FC = () => {
    const { selectedFieldId, schema, uiSchema, updateFieldSchema, updateFieldUiOptions, findFieldParent } = useFormBuilderStore();
    
    const { register, control, watch, reset, setValue } = useForm<InspectorFormValues>({
        defaultValues: {
            title: '',
            description: '',
            columns: 1,
            placeholder: '',
            unit: '',
            enabledInputs: ['inputBox'],
            displayAs: 'radio',
            choices: [],
            color: 'primary',
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "choices"
    });

    const isUpdatingFromStore = useRef(false);

  useEffect(() => {
        if (selectedFieldId) {
            isUpdatingFromStore.current = true;
            
            const state = useFormBuilderStore.getState();
            const { parentSchema } = findFieldParent(state, selectedFieldId);
            const fieldSchema = parentSchema?.properties?.[selectedFieldId];
            const fieldUiSchema = state.uiSchema[selectedFieldId];

            if (fieldSchema && fieldUiSchema) {
                const fieldUiOptions = fieldUiSchema['ui:options'] || {};
                const type = fieldSchema.type;
                
                let choices: Choice[] = [];
                if (type === 'string' && fieldSchema.enum) { // singleChoice
                    choices = (fieldSchema.enum || []).map((value: string, index: number) => ({
                        value,
                        label: fieldSchema.enumNames?.[index] || value
                    }));
                } else if (type === 'array' && fieldSchema.items?.enum) { // multipleChoice
                    choices = (fieldSchema.items.enum || []).map((value: string, index: number) => ({
                        value,
                        label: fieldSchema.items.enumNames?.[index] || value
                    }));
                }
                
      reset({
                    title: fieldSchema.title || '',
                    description: fieldSchema.description || '',
                    columns: fieldUiOptions.columns || 1,
                    placeholder: fieldUiOptions.placeholder || '',
                    unit: fieldUiOptions.unit || '',
                    enabledInputs: fieldUiOptions.enabledInputs || ['inputBox'],
                    displayAs: fieldUiOptions.displayAs || 'radio',
                    choices: choices,
                    color: fieldUiOptions.color || 'primary',
                });
            }
            
            setTimeout(() => isUpdatingFromStore.current = false, 0);
        }
    }, [selectedFieldId, schema, uiSchema, reset, findFieldParent]);
    
    const updateStore = useCallback((data: InspectorFormValues) => {
        if (isUpdatingFromStore.current || !selectedFieldId) return;

        const state = useFormBuilderStore.getState();
        const { parentSchema } = findFieldParent(state, selectedFieldId);
        const fieldSchema = parentSchema?.properties?.[selectedFieldId];
        if (!fieldSchema) return;

        const type = fieldSchema.type;

        // Update Schema
        const schemaChanges: any = {};
        if (fieldSchema.title !== data.title) schemaChanges.title = data.title;
        if (fieldSchema.description !== data.description) schemaChanges.description = data.description;

        if (type === 'string' && fieldSchema.enum) { // singleChoice
            const newEnum = data.choices.map((c: Choice) => c.value);
            const newEnumNames = data.choices.map((c: Choice) => c.label);
            schemaChanges.enum = newEnum;
            schemaChanges.enumNames = newEnumNames;
        } else if (type === 'array') { // multipleChoice
            const newEnum = data.choices.map((c: Choice) => c.value);
            const newEnumNames = data.choices.map((c: Choice) => c.label);
            schemaChanges.items = { ...fieldSchema.items, enum: newEnum, enumNames: newEnumNames };
        }
        if (Object.keys(schemaChanges).length > 0) {
            updateFieldSchema(selectedFieldId, schemaChanges);
        }

        // Update UI Schema Options
        const uiOptionsChanges: any = {};
        const currentUiOptions = state.uiSchema[selectedFieldId]?.['ui:options'] || {};
        if (fieldSchema.type === 'object' && currentUiOptions.columns !== data.columns) uiOptionsChanges.columns = data.columns;
        if (currentUiOptions.placeholder !== data.placeholder) uiOptionsChanges.placeholder = data.placeholder;
        if (currentUiOptions.unit !== data.unit) uiOptionsChanges.unit = data.unit;
        if (JSON.stringify(currentUiOptions.enabledInputs) !== JSON.stringify(data.enabledInputs)) uiOptionsChanges.enabledInputs = data.enabledInputs;
        if (currentUiOptions.displayAs !== data.displayAs) uiOptionsChanges.displayAs = data.displayAs;
        if (currentUiOptions.color !== data.color) uiOptionsChanges.color = data.color;

        if (Object.keys(uiOptionsChanges).length > 0) {
            updateFieldUiOptions(selectedFieldId, uiOptionsChanges);
        }

    }, [selectedFieldId, updateFieldSchema, updateFieldUiOptions, findFieldParent]);
  
  useEffect(() => {
        const subscription = watch(updateStore as (value: unknown) => void);
    return () => subscription.unsubscribe();
    }, [watch, updateStore]);

  if (!selectedFieldId) {
    return (
            <Card className="h-full flex flex-col">
                <CardHeader className="flex-shrink-0"><CardTitle className="text-lg lg:text-xl">Inspector</CardTitle></CardHeader>
                <CardContent className="flex-grow flex items-center justify-center"><div className="text-center"><p className="text-sm lg:text-base text-muted-foreground">Select a field on the canvas to see its properties.</p><p className="text-xs lg:text-sm text-muted-foreground mt-2">On mobile, tap a field in the Canvas tab first.</p></div></CardContent>
      </Card>
    );
  }
  
    const { parentSchema: currentParentSchema } = findFieldParent(useFormBuilderStore.getState(), selectedFieldId);
    const selectedFieldSchema = currentParentSchema?.properties?.[selectedFieldId];
    const selectedType = selectedFieldSchema?.type === 'array' ? 'multipleChoice' : selectedFieldSchema?.type;
    const isChoice = (selectedType === 'string' && selectedFieldSchema?.enum) || selectedType === 'multipleChoice';

    const renderChoiceEditor = () => (
        <div className="space-y-3 pt-4 border-t">
            <h4 className="text-sm lg:text-base font-medium">Options</h4>
            <div className="space-y-2">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                        <div className="flex-grow grid grid-cols-2 gap-2">
                            <InputField id={`choices.${index}.value`} containerClassName="gap-0" label="Value" {...register(`choices.${index}.value`)} placeholder="e.g., option_1" className="text-xs h-8" />
                            <InputField id={`choices.${index}.label`} containerClassName="gap-0" label="Label" {...register(`choices.${index}.label`)} placeholder="e.g., Option 1" className="text-xs h-8" />
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => remove(index)}><PiTrash /></Button>
                    </div>
                ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => append({ value: '', label: '' })}>Add Option</Button>
            
            <div className="space-y-2 pt-2 border-t">
                <label className="text-sm lg:text-base font-medium">Display Style</label>
                <RadioGroup onValueChange={(val: string) => reset({...watch(), displayAs: val as InspectorFormValues['displayAs']})} value={watch('displayAs')}>
                    <label className="flex items-center gap-2 text-sm lg:text-base">
                        <RadioGroupItem value={selectedType === 'multipleChoice' ? 'checkboxGroup' : 'radio'} id={`style-${selectedType}`} />
                        {selectedType === 'multipleChoice' ? 'Checkboxes' : 'Radio Buttons'}
                    </label>
                    <label className="flex items-center gap-2 text-sm lg:text-base">
                        <RadioGroupItem value="dropdown" id="style-dropdown" /> Dropdown Menu
                    </label>
                </RadioGroup>
            </div>
        </div>
    );

  return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex-shrink-0"><CardTitle className="text-lg lg:text-xl">Inspector</CardTitle></CardHeader>
            <CardContent className="flex-grow overflow-auto p-4"><form className="space-y-4">
                <InputField id="inspector-title" label="Label / Title" {...register('title')} className="text-sm lg:text-base"/>
                <TextareaField id="inspector-description" label="Description / Help Text" {...register('description')} rows={3} />
                
                <div className="space-y-3 pt-4 border-t">
                    <h4 className="text-sm lg:text-base font-medium">Styling</h4>
                    <div>
                        <label className="text-sm font-medium">Color</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {FIELD_COLORS.map(color => (
                                <button
                                    key={color.name}
                                    type="button"
                                    onClick={() => setValue('color', color.name)}
                                    className={cn("w-8 h-8 rounded-full border-2", color.className.replace('text-','bg-').replace('/5','/40'), watch('color') === color.name ? 'ring-2 ring-offset-2 ring-primary' : 'border-transparent')}
                                    aria-label={`Set color to ${color.name}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {selectedType === 'object' && (
                    <div className="space-y-3 pt-4 border-t">
                        <h4 className="text-sm lg:text-base font-medium">Section Options</h4>
                         <div>
                            <label htmlFor="columns" className="text-sm font-medium">Layout Columns</label>
                            <Select onValueChange={(value: string) => setValue('columns', parseInt(value, 10))} value={String(watch('columns'))}>
                                <SelectTrigger id="columns" className="w-full mt-1.5">
                                    <SelectValue placeholder="Select number of columns" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1 Column</SelectItem>
                                    <SelectItem value="2">2 Columns</SelectItem>
                                    <SelectItem value="3">3 Columns</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                {selectedType === 'string' && !selectedFieldSchema?.enum && (
                    <div className="space-y-3 pt-4 border-t">
                        <h4 className="text-sm lg:text-base font-medium">Text Options</h4>
                        <InputField id="inspector-placeholder" label="Placeholder" {...register('placeholder')} />
                    </div>
                )}

                {selectedType === 'number' && (
                    <div className="space-y-3 pt-4 border-t">
                        <h4 className="text-sm lg:text-base font-medium">Number Options</h4>
                        <InputField id="inspector-unit" label="Unit" placeholder="e.g., mmHg, kg" {...register('unit')} className="text-sm lg:text-base"/>
                        <div className="space-y-2">
                            <label className="text-sm lg:text-base font-medium">Enabled Inputs</label>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm lg:text-base"><UiCheckbox {...register('enabledInputs')} value="inputBox" /> Standard Input Box</label>
                                <label className="flex items-center gap-2 text-sm lg:text-base"><UiCheckbox {...register('enabledInputs')} value="slider" /> Slider</label>
                                <label className="flex items-center gap-2 text-sm lg:text-base"><UiCheckbox {...register('enabledInputs')} value="stepper" /> Stepper Buttons</label>
                            </div>
                    </div>
                </div>
            )}

                {isChoice && renderChoiceEditor()}
            </form></CardContent>
    </Card>
  );
};

export default Inspector;