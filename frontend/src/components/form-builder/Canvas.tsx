// src/components/form-builder/Canvas.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { useFormBuilderStore } from '@/stores/formBuilderStore';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import FormFieldWrapper from './FormFieldWrapper';

const Canvas: React.FC = () => {
  const { schema, fieldOrder, setFieldOrder } = useFormBuilderStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fieldOrder.indexOf(active.id as string);
      const newIndex = fieldOrder.indexOf(over.id as string);
      const newOrder = [...fieldOrder];
      const [movedItem] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, movedItem);
      setFieldOrder(newOrder);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{schema.title}</CardTitle>
        <CardDescription>{schema.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={fieldOrder} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {fieldOrder.length > 0 ? fieldOrder.map(fieldId => (
                <FormFieldWrapper key={fieldId} fieldId={fieldId} />
              )) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">Drag or click fields from the Toolbox to begin.</p>
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
};

export default Canvas;