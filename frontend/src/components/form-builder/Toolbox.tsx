// src/components/form-builder/Toolbox.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { FORM_BUILDER_PRIMITIVES } from '@/config/formBuilder.config';
import { useFormBuilderStore } from '@/stores/formBuilderStore';

const Toolbox: React.FC = () => {
  const addField = useFormBuilderStore(state => state.addField);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-lg lg:text-xl">Toolbox</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-xs lg:text-sm text-muted-foreground mb-4">
          Tap fields to add them to the canvas.
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-3">
          {FORM_BUILDER_PRIMITIVES.map(primitive => (
            <button
              key={primitive.type}
              onClick={() => addField(primitive.type, null)}
              className="p-3 lg:p-4 border rounded-lg flex flex-col items-center justify-center text-center hover:bg-accent hover:border-primary transition-all active:scale-95 min-h-[80px] lg:min-h-[100px]"
            >
              <primitive.icon className="w-6 h-6 lg:w-8 lg:h-8 mb-2" />
              <span className="text-xs lg:text-sm font-medium leading-tight">{primitive.label}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Toolbox;