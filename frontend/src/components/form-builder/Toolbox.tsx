// src/components/form-builder/Toolbox.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { FORM_BUILDER_PRIMITIVES } from '@/config/formBuilder.config';
import { useFormBuilderStore } from '@/stores/formBuilderStore';

const Toolbox: React.FC = () => {
  const addField = useFormBuilderStore(state => state.addField);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Toolbox</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">Click or drag fields to add them to the canvas.</p>
        <div className="grid grid-cols-2 gap-2">
          {FORM_BUILDER_PRIMITIVES.map(primitive => (
            <button
              key={primitive.type}
              onClick={() => addField(primitive.type)}
              className="p-2 border rounded-lg flex flex-col items-center justify-center text-center hover:bg-accent hover:border-primary transition-all"
            >
              <primitive.icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{primitive.label}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Toolbox;