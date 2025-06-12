// src/components/form-builder/Inspector.tsx
import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useFormBuilderStore } from '@/stores/formBuilderStore';
import { useForm } from 'react-hook-form';
import { InputField } from '@/components/ui/InputField';
import { Checkbox as UiCheckbox } from '@/components/ui/Checkbox';

const Inspector: React.FC = () => {
  const { selectedFieldId, schema, uiSchema, updateFieldSchema, updateFieldUiOptions } = useFormBuilderStore();
  
  const { register, watch, reset } = useForm();

  useEffect(() => {
    if (selectedFieldId && schema.properties[selectedFieldId]) {
      const fieldSchema = schema.properties[selectedFieldId];
      const fieldUiOptions = uiSchema[selectedFieldId]?.['ui:options'] || {};
      reset({
        title: fieldSchema.title,
        ...fieldUiOptions
      });
    }
  }, [selectedFieldId, schema, uiSchema, reset]);
  
  useEffect(() => {
    const subscription = watch((value) => {
        if (!selectedFieldId) return;
        const { title, ...options } = value;
        updateFieldSchema(selectedFieldId, { title });
        updateFieldUiOptions(selectedFieldId, options);
    });
    return () => subscription.unsubscribe();
  }, [watch, selectedFieldId, updateFieldSchema, updateFieldUiOptions]);

  if (!selectedFieldId) {
    return (
      <Card className="h-full">
        <CardHeader><CardTitle>Inspector</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">Select a field on the canvas to see its properties.</p></CardContent>
      </Card>
    );
  }
  
  const selectedType = schema.properties[selectedFieldId]?.type;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Inspector</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
            <InputField id="inspector-title" label="Label" {...register('title')} />
            
            {selectedType === 'number' && (
                <div className="space-y-2 pt-4 border-t">
                    <h4 className="text-sm font-medium">Number Options</h4>
                    <InputField id="inspector-unit" label="Unit" placeholder="e.g., mmHg, kg" {...register('unit')} />
                    <label className="text-sm font-medium">Enabled Inputs</label>
                    <div className="space-y-1">
                        <label className="flex items-center gap-2"><UiCheckbox {...register('enabledInputs')} value="inputBox" /> Standard Input Box</label>
                        <label className="flex items-center gap-2"><UiCheckbox {...register('enabledInputs')} value="slider" /> Slider</label>
                        <label className="flex items-center gap-2"><UiCheckbox {...register('enabledInputs')} value="stepper" /> Stepper Buttons</label>
                    </div>
                </div>
            )}
        </form>
      </CardContent>
    </Card>
  );
};

export default Inspector;