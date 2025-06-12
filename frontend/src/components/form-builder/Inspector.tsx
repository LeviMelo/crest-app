// src/components/form-builder/Inspector.tsx
import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useFormBuilderStore } from '@/stores/formBuilderStore';
import { useForm } from 'react-hook-form';
import { InputField } from '@/components/ui/InputField';
import { Checkbox } from '@/components/ui/Checkbox'; // Assuming we create this simple component

const Inspector: React.FC = () => {
  const { selectedFieldId, schema, uiSchema, updateFieldSchema, updateFieldUiOptions } = useFormBuilderStore();
  const form = useForm();
  const { register, handleSubmit, watch, reset } = form;

  useEffect(() => {
    if (selectedFieldId && schema.properties[selectedFieldId]) {
      const fieldSchema = schema.properties[selectedFieldId];
      const fieldUiOptions = uiSchema[selectedFieldId]?.['ui:options'] || {};
      reset({
        // Schema properties
        title: fieldSchema.title,
        // UI options
        ...fieldUiOptions
      });
    }
  }, [selectedFieldId, schema, uiSchema, reset]);
  
  // Watch for changes and update the store in real-time
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
            <InputField label="Label" {...register('title')} />
            
            {/* Number-specific Inspector */}
            {selectedType === 'number' && (
                <div className="space-y-2 pt-4 border-t">
                    <h4 className="text-sm font-medium">Number Options</h4>
                    <InputField label="Unit" placeholder="e.g., mmHg, kg" {...register('unit')} />
                    <label className="text-sm font-medium">Enabled Inputs</label>
                    <div className="space-y-1">
                        <label className="flex items-center gap-2"><Checkbox {...register('enabledInputs')} value="inputBox" /> Standard Input Box</label>
                        <label className="flex items-center gap-2"><Checkbox {...register('enabledInputs')} value="slider" /> Slider</label>
                        <label className="flex items-center gap-2"><Checkbox {...register('enabledInputs')} value="stepper" /> Stepper Buttons</label>
                    </div>
                </div>
            )}
            {/* Add inspectors for other types here */}

        </form>
      </CardContent>
    </Card>
  );
};
// Simple Checkbox for the form
const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({className, ...props}, ref) => {
    return ( <input type="checkbox" className={cn("h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary", className)} ref={ref} {...props} /> );
});

export default Inspector;