// src/components/form-builder/Canvas.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { useFormBuilderStore } from '@/stores/formBuilderStore';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import FormFieldWrapper from './FormFieldWrapper';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

const Canvas: React.FC = () => {
  const { schema, uiSchema, setOrder, moveField } = useFormBuilderStore();
  const rootOrder = uiSchema['ui:root']?.['ui:order'] || [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );
  
  const { setNodeRef, isOver } = useDroppable({ id: '__root__' });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeParentId = active.data.current?.parentId || null;
    const overParentId = over.data.current?.isSection ? overId : over.data.current?.parentId || null;
    
    const activeContainer = activeParentId === null ? rootOrder : uiSchema[activeParentId]?.['ui:order'];
    const overContainer = overParentId === null ? rootOrder : uiSchema[overParentId]?.['ui:order'];

    if (!activeContainer || !overContainer) return;

    if (activeParentId === overParentId) {
      // Scenario 1: Reordering within the same container
      const oldIndex = activeContainer.indexOf(activeId);
      const newIndex = overContainer.indexOf(overId);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(activeContainer, oldIndex, newIndex);
        setOrder(newOrder, activeParentId);
      }
    } else {
      // Scenario 2: Moving to a different container
      const overIndex = over.data.current?.isSection 
          ? overContainer.length // Drop at the end of a section
          : overContainer.indexOf(overId); // Drop at the item's position

      if(overIndex !== -1) {
        moveField(activeId, activeParentId, overParentId, overIndex);
      }
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Card className="h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
                <CardTitle className="text-lg lg:text-xl">{schema.title}</CardTitle>
                <CardDescription className="text-sm">{schema.description}</CardDescription>
            </CardHeader>
            <CardContent ref={setNodeRef} className={cn("flex-grow min-h-0 overflow-auto", isOver && "outline-dashed outline-2 outline-primary outline-offset-[-4px] rounded-lg")}>
                <SortableContext items={rootOrder} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3 lg:space-y-4 p-1">
                    {rootOrder.length > 0 ? rootOrder.map(fieldId => (
                        <FormFieldWrapper key={fieldId} fieldId={fieldId} parentId={null} />
                    )) : (
                        <div className="text-center py-12 lg:py-16 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground text-sm lg:text-base">
                            Drag or click fields from the Toolbox to begin.
                        </p>
                        <p className="text-muted-foreground text-xs lg:text-sm mt-2">
                            On mobile, use the Tools tab to add fields.
                        </p>
                        </div>
                    )}
                    </div>
                </SortableContext>
            </CardContent>
        </Card>
    </DndContext>
  );
};

export default Canvas;